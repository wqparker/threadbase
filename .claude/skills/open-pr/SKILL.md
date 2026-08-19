---
name: open-pr
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*)
description: Open a GitHub PR for the current feature branch into main
disable-model-invocation: true
---

## Current State
- Branch: !`git branch O-show-current`
- Status: !`git status`
- Commits ahead of main: !`git log main..HEAD --oneline`

## Instructions
Open a pull request for the current branch into `main`.

- Refuse if the current branch is `main`.
- Make sure the branch is pushed to origin first (push it if it isn't, or if there are unpushed commits).
- Check `gh pr view --json state` for this branch first — if a PR is already open, don't create a duplicate; report its URL instead.
- Write the PR title (under 70 chars) and a short body summarizing the commits shown above.
- This is the create-the-PR step only. Do not merge, squash, or delete the branch — that happens later, manually, once the PR has been reviewed.
