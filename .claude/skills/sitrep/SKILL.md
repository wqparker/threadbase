---
name: sitrep
description: Give status report of current progress and work
allowed-tools: Bash(git status:*), Read
model: sonnet
---

Review project plan file in `@${CLAUDE_PROJECT_DIR}/docs/project-plan.md`
Compare most recent git commits, current git branch, and current project files to determine what progress has been made in the plan so far, what (if any) the current step that is being worked on is, and what the next step may be
