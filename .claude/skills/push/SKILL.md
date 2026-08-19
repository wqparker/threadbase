---
name: push
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git fetch:*), Bash(git push:*), Bash(git rev-parse:*)
description: Push the current branch's commits to origin, with safety checks
disable-model-invocation: true
---

## Current State
- Branch: !`git branch --show-current`
- Status: !`git status`
- Upstream tracking: !`git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>&1`

## Instructions
Push the current branch to origin.

- Refuse and stop if the current branch is `main` — this repo takes no direct commits to main (see CLAUDE.md git workflow).
- Run `git fetch origin` first so the ahead/behind state above is trustworthy before deciding how to push.
- If the branch has no upstream yet, push with `git push -u origin <branch>`. Otherwise a plain `git push`.
- If the branch is behind its upstream (someone else pushed, or main was squash-merged and this branch never synced), stop and tell me rather than force-pushing or merging automatically.
