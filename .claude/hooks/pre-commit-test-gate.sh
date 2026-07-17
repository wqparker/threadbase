#!/bin/bash
# Blocks `git commit` unless the backend Jest suite passes.
# Only covers server/ - there's no frontend test runner yet.
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT/server" || exit 1
npm test > /tmp/threadbase-precommit-test.log 2>&1

if [ $? -eq 0 ]; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
else
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"npm test failed in /server before commit. See /tmp/threadbase-precommit-test.log for details, or ask Claude to run the test-runner agent to diagnose and fix."}}'
fi
