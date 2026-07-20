#!/usr/bin/env python3
import json
import os
import sys

RESULTS_PATH = 'test-results/results.json'

if not os.path.exists(RESULTS_PATH):
    sys.exit(0)

with open(RESULTS_PATH) as f:
    report = json.load(f)

passed = failed = 0
flaky = []
failed_titles = []


def walk(suite):
    global passed, failed
    for spec in suite.get('specs', []):
        if spec.get('ok'):
            passed += 1
        else:
            failed += 1
            failed_titles.append(spec.get('title'))
        for t in spec.get('tests', []):
            if t.get('status') == 'flaky':
                flaky.append(spec.get('title'))
    # specs live inside describe blocks, which are nested suites, not
    # directly under the file-level suite — recurse to reach them.
    for nested in suite.get('suites', []):
        walk(nested)


for suite in report.get('suites', []):
    walk(suite)

project = os.environ.get('MATRIX_PROJECT', 'unknown')

with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as out:
    out.write(f'## Playwright Results — {project}\n')
    out.write('| Status | Count |\n|--------|-------|\n')
    out.write(f'| ✅ Passed | {passed} |\n')
    out.write(f'| ❌ Failed | {failed} |\n')
    if failed_titles:
        out.write('\n**Failed tests:**\n')
        for title in failed_titles:
            out.write(f'- {title}\n')
    if flaky:
        out.write(f'| 🔁 Flaky (passed after retry) | {len(flaky)} |\n')
        out.write('\n**Flaky tests:**\n')
        for title in flaky:
            out.write(f'- {title}\n')
