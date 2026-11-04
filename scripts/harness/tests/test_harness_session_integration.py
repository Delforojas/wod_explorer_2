"""Real read-only harness calls share one ledger; no production repository writes."""
from contextlib import chdir
from datetime import datetime, timezone
import json
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

HARNESS = Path(__file__).resolve().parents[1]
if not (HARNESS / 'workflow_controller.py').exists():
    HARNESS = Path(__file__).parent
sys.path.insert(0, str(HARNESS))
sys.dont_write_bytecode = True
from evidence_manager import EvidenceManager, EvidenceError, using_evidence
from workflow_controller import WorkflowController
import git_policy
import sdd_manager
import verification_runner


class HarnessSessionIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name).resolve()
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        for args in [('init','-b','feat/075-test'), ('config','user.email','test@example.invalid'),
                     ('config','user.name','Test')]:
            subprocess.run(['git',*args],cwd=self.repo,capture_output=True,check=True)
        (self.repo / 'initial.txt').write_text('baseline')
        subprocess.run(['git','add','initial.txt'],cwd=self.repo,capture_output=True,check=True)
        subprocess.run(['git','commit','-m','Initial'],cwd=self.repo,capture_output=True,check=True)
        self.session = EvidenceManager(75, self.repo, 'wf')

    def snapshot(self):
        return {str(p.relative_to(self.repo)):p.read_bytes() for p in self.repo.rglob('*') if p.is_file()}

    def files(self, folder):
        folder.mkdir(parents=True,exist_ok=True)
        (folder/'spec.md').write_text('# Spec\n## Objetivo\nImplement behavior\n## Alcance\nRequested scope\n## Comportamiento esperado\nExpected behavior\n## Criterios de aceptación\n- Behavior verified\n')
        (folder/'plan.md').write_text('# Plan\nImplement and verify existing components\n')
        (folder/'tasks.md').write_text('- [x] Implement and verify the behavior\n')

    def test_git_observation_is_registered_without_duplicate_git_reads(self):
        self.files(self.repo)
        before = self.snapshot()
        with chdir(self.repo), using_evidence(self.session), patch('git_policy.read_status', wraps=git_policy.read_status) as status:
            result = git_policy.review_changes(75,'spec.md','plan.md','tasks.md')
        self.assertEqual(status.call_count,1)
        self.assertEqual(result['pre_stage_evidence']['status'],'PASS')
        self.assertEqual(self.session.get('pre_stage_evidence')['payload'], result['pre_stage_evidence'])
        self.assertEqual(before,self.snapshot())
        self.session.invalidate('staging-change',source='explicit test notification')
        with self.assertRaises(EvidenceError):
            self.session.get('pre_stage_evidence')

    def test_sdd_validation_is_reused_by_planning_guard_without_rereading(self):
        self.files(self.repo/'specs/075-feature')
        c = WorkflowController(75,self.repo,'wf')
        c.phase = 4
        before = self.snapshot()
        with chdir(self.repo), patch('sdd_manager.observe', wraps=sdd_manager.observe) as observe:
            c.invoke('sdd_manager.inspect',{'issue':75,'validate':True,'require_completed':True})
            reference = c.evidence.reference('sdd_validation_evidence')
            c.decide_guard('sdd','PASS','.opencode/commands/guardarails/sdd.md',[reference],'SDD reviewed')
            self.assertEqual(c.advance()['phase'],5)
            c.decide_guard('planning','PASS','.opencode/commands/guardarails/planning.md',[reference],'Planning reviewed')
            self.assertEqual(c.advance()['phase'],6)
            self.assertEqual(observe.call_count,1)
        self.assertEqual(before,self.snapshot())
        summary = c.export_static(authorized=True)
        self.assertIn('sdd',summary['static'])
        self.assertNotIn('mutable',summary)

    def test_runner_registers_exact_executed_report_in_same_session(self):
        (self.repo/'check.py').write_text('print("ok")\n')
        registry = self.root/'registry.json'
        registry.write_text(json.dumps({'checks':[{'id':'unit','command':[sys.executable,'check.py'],
                                                   'cwd':'.','sources':['check.py'],'timeout_seconds':5}]}))
        catalog = verification_runner.discover(self.repo,str(registry))['verification_catalog']
        selection = self.root/'selection.json'
        selection.write_text(json.dumps({'status':'APPROVED','source':'workflow-selection','issue':75,
            'workflow_id':'wf','repository':str(self.repo),'phase':7,'checks':['unit'],'applicable_checks':['unit'],
            'catalog_sha256':catalog['catalog_sha256'],'source_fingerprint':catalog['source_fingerprint']['sha256'],
            'tasks_completed':True,'applicability_complete':True}))
        before = self.snapshot()
        with chdir(self.repo),using_evidence(self.session):
            result = verification_runner.run_checks(75,'wf',['unit'],str(selection),registry_path=str(registry),log_dir=self.root/'logs')
        self.assertEqual(result['verification_evidence']['status'],'PASS',result)
        self.assertEqual(self.session.get('verification_evidence')['payload'],result['verification_evidence'])
        self.assertEqual(before,self.snapshot())

    def test_controlled_commit_uses_only_in_memory_evidence_inputs(self):
        import hashlib
        from evidence_manager import digest
        self.files(self.repo)
        (self.repo/'initial.txt').write_text('approved implementation\n')
        c = WorkflowController(75,self.repo,'wf')
        c.phase = 7
        with chdir(self.repo):
            (self.repo/'check.py').write_text(
                "from pathlib import Path\nassert Path('initial.txt').read_text() == 'approved implementation\\n'\n")
            registry = {'checks':[{'id':'unit','command':[sys.executable,'check.py'],
                'cwd':'.','sources':['initial.txt'],'timeout_seconds':5}]}
            catalog = c.invoke('verification_runner.discover',{'repo_root':self.repo,'registry_path':registry})['verification_catalog']
            self.assertEqual(catalog['status'],'PASS',catalog)
            selection = {'status':'APPROVED','source':'workflow-selection','issue':75,
                'workflow_id':'wf','repository':str(self.repo),'phase':7,'checks':['unit'],'applicable_checks':['unit'],
                'catalog_sha256':catalog['catalog_sha256'],'source_fingerprint':catalog['source_fingerprint']['sha256'],
                'tasks_completed':True,'applicability_complete':True}
            verification = c.invoke('verification_runner.run_checks',{'issue':75,'workflow_id':'wf',
                'selected':['unit'],'selection_path':selection,'registry_path':registry,'log_dir':self.root/'logs'})['verification_evidence']
            self.assertEqual(verification['status'],'PASS',verification)
            verification_ref = c.evidence.reference('verification_evidence')
            c.decide_guard('verification','PASS','.opencode/commands/guardarails/verification.md',
                           [verification_ref],'All applicable checks passed')
            transition = c.advance()
            self.assertEqual(transition['phase'],9,transition)
            pre = c.invoke('git_policy.review_changes',{'issue':75,'spec_path':'spec.md','plan_path':'plan.md','tasks_path':'tasks.md'})['pre_stage_evidence']
            pre_ref = c.evidence.reference('pre_stage_evidence')
            c.decide_guard('change-review','PASS','.opencode/commands/guardarails/change-review.md',[pre_ref],'Only initial.txt is approved')
            blocked = c.advance()
            self.assertEqual(blocked['status'],'BLOCK',blocked)
            self.assertEqual(blocked['phase'],9,blocked)
            self.assertIn('Guard does not bind every mandatory current evidence entry',blocked['errors'])
            c.decide_guard('change-review','PASS','.opencode/commands/guardarails/change-review.md',
                           [pre_ref,verification_ref],'Changes and current verification reviewed')
            transition = c.advance()
            self.assertEqual(transition['phase'],10,transition)
            approved = {'status':'PASS','issue':75,'evidence_sha256':digest(pre), 'manifest':[
                {'path':'initial.txt','mode':'100644','sha256':hashlib.sha256((self.repo/'initial.txt').read_bytes()).hexdigest()}]}
            staged = c.invoke('git_policy.prepare_staging',{'issue':75,'evidence_path':{'evidence_ref':pre_ref},'approval_path':approved})['staging_preparation_evidence']
            stage_ref = c.evidence.reference('staging_preparation_evidence')
            policy = {'policy':'standard-main','base_branch':'main','base_ref':'origin/main',
                      'base_remote_ref':'refs/heads/main','base_sha':pre['head_sha'],
                      'pr_target':'main','pr_target_ref':'refs/heads/main'}
            patch_bytes = subprocess.check_output(['git','diff','--cached',pre['head_sha'],'--binary','--full-index',
                                                   '--no-ext-diff','--no-textconv','--no-relative'],cwd=self.repo)
            manifest = {'status':'PASS','issue':75,'repository':str(self.repo),'branch':pre['branch'],
                'head_sha':pre['head_sha'],'base_sha':pre['head_sha'],'approved_commits':[],
                'candidate_paths':['initial.txt'],'unrelated_paths':[],
                'candidate_diff_sha256':hashlib.sha256(patch_bytes).hexdigest(),
                'policy_sha256':digest(policy),'staging_evidence_sha256':digest(staged)}
            baseline = {'evidence_ref':pre_ref,'historical':True}
            arguments = {'issue':75,'evidence_path':baseline,'staging_path':{'evidence_ref':stage_ref},
                         'policy_path':policy,'manifest_path':manifest}
            checked = c.invoke('git_policy.pre_commit_check',arguments)['pre_commit_evidence']
            self.assertEqual(checked['status'],'PASS',checked)
            checked_ref = c.evidence.reference('pre_commit_evidence')
            message = 'feat: approved implementation (#75)\n'
            authorization = {'status':'APPROVED','issue':75,'workflow_id':'wf',
                'pre_commit_evidence_sha256':digest(checked),'message_sha256':hashlib.sha256(message.encode()).hexdigest()}
            created = c.invoke('git_policy.create_commit',{**arguments,'pre_commit_path':{'evidence_ref':checked_ref},
                'authorization_path':authorization,'message_path':{'text':message},'workflow_id':'wf'})['commit_creation_evidence']
            self.assertEqual(created['status'],'PASS',created)
            creation_ref = c.evidence.reference('commit_creation_evidence')
            final = c.invoke('git_policy.check_commit',{**arguments,
                'staging_path':{'evidence_ref':stage_ref,'historical':True},
                'pre_commit_path':{'evidence_ref':checked_ref,'historical':True},
                'creation_path':{'evidence_ref':creation_ref},'authorization_path':authorization,
                'message_path':{'text':message},'workflow_id':'wf'})['commit_check_evidence']
            self.assertEqual(final['status'],'PASS',final)
        self.assertEqual(c.commit_step,4)
        # The runner owns a diagnostic source manifest; workflow inputs stay in memory.
        diagnostic_manifests = list((self.root/'logs').glob('verification-*/source-manifest.json'))
        self.assertEqual(len(diagnostic_manifests),1)
        self.assertEqual(list(self.root.rglob('*.json')),diagnostic_manifests,
                         'Only the runner diagnostic manifest may be materialized')
        self.assertNotIn('pre_stage_evidence',json.dumps(c.export_static(authorized=True)))
