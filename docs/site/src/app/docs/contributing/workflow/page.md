---
title: Workflow
section: Contributing
order: 1
nextjs:
  metadata:
    title: Contribution workflow
    description: The Linear-driven flow of a change through the plan, impl, commit, push and review skills of the repository.
---

A change travels through five repository skills. Each one reads the Linear issue, does one step and writes its result back, so the issue ends up holding the plan, the implementation report, the commit references and the review. {% .lead %}

---

## The sequence

1. **`/plan FRA-123`** analyses the issue, the codebase and earlier commits and attaches `plan.md` to the issue.
2. **`/impl FRA-123`** implements that plan with test-driven development, pausing every three changes for confirmation.
3. **`/commit FRA-123`** turns the staged changes into a conventional commit that references the issue.
4. **`/push FRA-123`** pushes the branch, moves the issue to In Review and opens the pull request.
5. **`/review FRA-123`** reviews the change for quality, tests, security and performance before it is merged.

All of them live in `.claude/skills/<name>/SKILL.md` and are loaded by Claude Code when you type the command. The reports they post to Linear are written in Polish; the code, commits and pull requests are in English.

## Plan

{% skill name="plan" source="repo" /%}

The plan is an attachment, never a comment, so `/impl` can find it without scanning the discussion. When the issue has sub-issues, every sub-issue gets its own plan and the parent only receives the `AI Plan` label. A plan is regenerated when a comment on the issue is newer than the attachment, which is how review feedback reaches the next implementation round. Plans are written in Polish and list the steps, the files to touch, the cross-package dependencies, the testing strategy and the risks.

## Impl

{% skill name="impl" source="repo" /%}

Implementation starts by moving the issue to In Progress and saving an `orchestration.md` attachment that names the agents that will do the work. Code is written test-first by the `shared-tdd-developer` agent (see [Agents](/docs/contributing/agents)). The skill applies the **3x3 rule**: after every three changes it summarises what was done, lists the next three steps and waits for a yes. When the plan is complete it runs tests, lint and build, posts an implementation report and moves the issue to In Review. Passing `--auto` removes every pause for CI runs and logs each checkpoint as a Linear comment instead.

## Commit

{% skill name="commit" source="repo" /%}

The commit message follows [Conventional Commits](/docs/contributing/conventions#commit-messages) with the scope chosen from the changed files and a `Refs: FRA-123` footer. Before committing, the skill runs `npm run format` and stages what the formatter changed. The `commit-msg` hook then runs commitlint and the full `lint`, `test`, `build` and `postbuild` targets of every project, so a commit that lands is one CI would accept.

## Push

{% skill name="push" source="repo" /%}

Before pushing, the skill lists the commits, classifies the sub-issues into done and not done, and asks whether to move the finished ones to In Review. On a feature branch it then checks for an existing pull request and offers to create one against `main` with a summary of the sub-issues and commits. On `main` it watches the CI run and moves the issue back to To Do with an error comment if the pipeline fails.

## Review

{% skill name="review" source="repo" /%}

The review runs over the diff of the issue's branch (or `--staged`, or `--diff=main`) in four dimensions: code quality, tests, security and performance. Findings are posted to the issue as a comment so they become part of the next plan when the implementation goes another round.

## After the merge

Merging to `main` triggers the `Publish` workflow, which versions and publishes every `@smartsoft001/*` package to npm, and after a successful publish the `Docs` workflow rebuilds this site, including the Storybook smoke test and the documentation parity checks described in [Documentation](/docs/contributing/documentation).

The version of a release is the latest release tag plus a minor bump, read by `nx release` from git rather than from the manifests. The workflow pushes the tag as soon as the packages are on npm and only then writes the bumped manifests back to `main`, rebasing onto whatever merged meanwhile. If that write-back is still rejected, the manifests on `main` stay one release behind until the next run, which is harmless: the next release reads the tag, not the manifests, and tags on every branch count, so a number that reached npm is never reused. Two releases were lost that way before the version came from git, and each had to be stepped over by hand.
