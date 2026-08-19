---
name: create-tests
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Read, Write, Edit, Glob, Grep
description: Write unit tests for the most recently written or modified code
disable-model-invocation: true
---

## Current State
- Status: !`git status`
- Uncommitted diff: !`git diff`
- Last commit, used only if the working tree is clean: !`git log -1 -p`

## Instructions
Write tests for whatever code was most recently written or changed.

- If there are uncommitted changes, base the tests on those. If the working tree is clean, base them on the most recent commit shown above instead.
- Follow this repo's testing conventions (see CLAUDE.md):
  - Backend: Jest + supertest, matching the existing style in `server/tests/`
  - `server/lib/groupLaundry.js`, and any other pure lib function, must be tested with hand-written plain JS object fixtures in `server/tests/fixtures/` — no DB or Express involved
  - Frontend: Vitest + Testing Library, matching the existing style in `client/src/**/*.test.jsx`
- Only write tests for code that's actually worth testing — skip trivial config or markup-only changes, and say so rather than inventing a test.
- Don't modify the source files under test unless writing the test surfaces an actual bug, in which case flag it before fixing it.
