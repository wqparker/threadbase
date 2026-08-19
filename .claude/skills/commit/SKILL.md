---
name: commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git log:*)
description: Stage all changes and commit
disable-model-invocation: true
---

## Current State/comm
- Status: !`git status`
- Unstaged diff: !`git diff`
- Recent commit style: !`git log --oneline -10`

## Instructions
1. Stage every modified and untracked file/directory shown in the status
   above, by name (e.g. `git add path/to/file`) — never `git add -A` or
   `git add .`, so nothing outside what was just reviewed gets swept in
   silently.
2. If anything about to be staged looks like a secret, credential, or a
   large/generated artifact that doesn't belong in git, stop and flag it
   instead of adding it.
3. Commit. If $ARGUMENTS is provided, use it verbatim as the commit
   message. Otherwise generate a concise message from the staged diff,
   matching the style of the recent commits above.
