"""End-to-end stdio tests for snapshot restoration across MCP processes."""
import asyncio
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


HARNESS = Path(__file__).resolve().parents[1]
KEY = 'process-test-key-that-is-at-least-thirty-two-bytes-long'


class HarnessMCPProcessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / 'repo'
        harness = self.repo / 'scripts' / 'harness'
        harness.parent.mkdir(parents=True)
        shutil.copytree(HARNESS, harness, ignore=shutil.ignore_patterns('__pycache__'))
        self.server = harness / 'harness_mcp.py'
        subprocess.run(['git', 'init', '-b', 'main'], cwd=self.repo, check=True, capture_output=True)
        subprocess.run(['git', 'config', 'user.email', 'test@example.invalid'], cwd=self.repo,
                       check=True, capture_output=True)
        subprocess.run(['git', 'config', 'user.name', 'Harness test'], cwd=self.repo,
                       check=True, capture_output=True)
        (self.repo / 'baseline.txt').write_text('baseline\n')
        subprocess.run(['git', 'add', 'baseline.txt'], cwd=self.repo, check=True, capture_output=True)
        subprocess.run(['git', 'commit', '-m', 'Baseline'], cwd=self.repo,
                       check=True, capture_output=True)

    def call_server(self, calls):
        async def run():
            parameters = StdioServerParameters(
                command=sys.executable,
                args=[str(self.server)],
                env={**os.environ, 'HARNESS_SNAPSHOT_HMAC_KEY': KEY},
            )
            async with stdio_client(parameters) as streams:
                async with ClientSession(*streams) as client:
                    await client.initialize()
                    tools = await client.list_tools()
                    results = []
                    for name, arguments in calls:
                        result = await client.call_tool(name, arguments)
                        self.assertFalse(result.isError, result)
                        payload = result.structuredContent
                        if payload is None:
                            payload = json.loads(result.content[0].text)
                        results.append(payload)
                    return {tool.name for tool in tools.tools}, results

        return asyncio.run(run())

    def snapshot(self, workflow_id='process-restore'):
        tools, results = self.call_server([
            ('harness_start', {'issue': 189, 'workflow_id': workflow_id}),
            ('harness_snapshot', {}),
        ])
        self.assertTrue({'harness_start', 'harness_snapshot', 'harness_restore'} <= tools)
        self.assertEqual(results[0]['status'], 'PASS', results[0])
        self.assertEqual(results[1]['status'], 'PASS', results[1])
        return results[1]['snapshot_id']

    def test_fresh_mcp_process_lists_tools_and_restores_snapshot(self):
        snapshot_id = self.snapshot()

        tools, results = self.call_server([
            ('harness_restore', {
                'issue': 189,
                'workflow_id': 'process-restore',
                'snapshot_id': snapshot_id,
            }),
            ('harness_status', {}),
        ])

        self.assertIn('harness_restore', tools)
        self.assertEqual(results[0]['status'], 'PASS', results[0])
        self.assertEqual(results[1]['workflow']['history'][-1]['status'], 'RESTORED')

    def test_real_head_change_rejects_restore(self):
        snapshot_id = self.snapshot('head-change')
        subprocess.run(['git', 'commit', '--allow-empty', '-m', 'Advance head'], cwd=self.repo,
                       check=True, capture_output=True)

        _, results = self.call_server([('harness_restore', {
            'issue': 189,
            'workflow_id': 'head-change',
            'snapshot_id': snapshot_id,
        })])

        self.assertEqual(results[0]['status'], 'BLOCK')
        self.assertIn('Git context', results[0]['error'])

    def test_real_runtime_module_change_rejects_restore(self):
        snapshot_id = self.snapshot('runtime-change')
        module = self.server.parent / 'sdd_manager.py'
        module.write_text(module.read_text() + '\n# changed after snapshot\n')

        _, results = self.call_server([('harness_restore', {
            'issue': 189,
            'workflow_id': 'runtime-change',
            'snapshot_id': snapshot_id,
        })])

        self.assertEqual(results[0]['status'], 'BLOCK')
        self.assertIn('runtime', results[0]['error'])
