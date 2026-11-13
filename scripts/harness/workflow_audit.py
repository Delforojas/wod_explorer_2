"""Schema validation for externally supplied workflow facts.

These helpers normalise data; they intentionally do not claim that a caller
or a remote service is trustworthy. Trust remains with the configured MCP and
the workflow guard that records the observation.
"""
from datetime import datetime


class AuditError(ValueError):
    pass


def normalize_github_observation(value):
    required = {'source', 'repository', 'number', 'state', 'issue_url', 'observed_at', 'comments'}
    if not isinstance(value, dict) or set(value) != required or value['source'] != 'github-mcp':
        raise AuditError('GitHub observation has an invalid schema or source')
    if value['state'] not in ('open', 'closed') or not isinstance(value['number'], int) or value['number'] < 1:
        raise AuditError('GitHub observation has an invalid Issue state')
    if datetime.fromisoformat(value['observed_at']).tzinfo is None or not isinstance(value['comments'], list):
        raise AuditError('GitHub observation is incomplete')
    if any(not isinstance(item, dict) or set(item) != {'id', 'body'} or not isinstance(item['id'], int)
           or not isinstance(item['body'], str) for item in value['comments']):
        raise AuditError('GitHub comments are incomplete')
    return dict(value)


def validate_action_log(value, workflow_id):
    required = {'source', 'complete', 'coverage', 'workflow_id', 'events'}
    if not isinstance(value, dict) or set(value) != required or value['source'] != 'workflow-action-log':
        raise AuditError('Action audit has an invalid schema or source')
    if value['complete'] is not True or value['coverage'] != 'entire-workflow' or value['workflow_id'] != workflow_id:
        raise AuditError('Action audit is incomplete')
    events = value['events']
    if not isinstance(events, list) or not events or [item.get('sequence') for item in events] != list(range(1, len(events) + 1)):
        raise AuditError('Action audit sequence is incomplete')
    allowed = {'issue-start', 'advance', 'record-external', 'record-static', 'decide-guard', 'notify',
               'snapshot', 'export-static', 'revisit-phase', 'enter-repair', 'inspect', 'validate-base',
               'prepare-branch', 'check-branch', 'sdd', 'planning',
               'implementation', 'verification', 'review-changes', 'change-review', 'prepare-staging',
               'pre-commit-check', 'create-commit', 'check-commit', 'commit-guard', 'post-check-commit',
               'post-commit-guard', 'github-read', 'github-documentation', 'github-documentation-guard',
               'manual-validation-plan', 'remote-refs-check', 'final-check', 'handoff-guard'}
    if events[0].get('operation') != 'issue-start' or any(item.get('operation') not in allowed for item in events):
        raise AuditError('Action audit contains an unverified external operation')
    if any(item['operation'] in {'push', 'finish-issue', 'manual-approve'} for item in events):
        raise AuditError('Action audit contains a prohibited operation')
    return {'source': value['source'], 'workflow_id': workflow_id, 'events': [dict(item) for item in events]}
