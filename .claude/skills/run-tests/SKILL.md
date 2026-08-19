---
name: run-tests
allowed-tools: Bash(cd "C:/Users/willq/OneDrive/Desktop/CS Projects/threadbase" && npm --prefix server test:*), Bash(cd "C:/Users/willq/OneDrive/Desktop/CS Projects/threadbase" && npm --prefix client test:*)
description: Run the full test suite (server + client) and report results in detail
disable-model-invocation: true
---

## Instructions
Run both test suites and report the results in depth. Each command is
prefixed with an explicit `cd` into the repo root using its correctly-cased
(uppercase drive letter) absolute path — this skill's `!` pre-execution
otherwise spawns with a lowercase `c:/...` working directory on this
machine, which breaks Vitest's module resolution (Node's require cache is
case-sensitive) and fails with a spurious "Vitest failed to find the
runner" error. Jest is unaffected, so this only matters for the client
suite, but both lines use it for consistency.

1. Backend (Jest, with coverage): !`cd "C:/Users/willq/OneDrive/Desktop/CS Projects/threadbase" && npm --prefix server test`
2. Frontend (Vitest): !`cd "C:/Users/willq/OneDrive/Desktop/CS Projects/threadbase" && npm --prefix client test`

For each suite, report:
- Pass/fail counts and total run time
- Full detail for any failing test — assertion, expected vs actual, file and line
- The coverage summary from the backend run

If everything passes, keep the report short (counts + coverage only). If anything fails, lead with the failures.
