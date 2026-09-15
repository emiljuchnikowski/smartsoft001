---
title: Agents
section: Contributing
order: 3
nextjs:
  metadata:
    title: Claude Code agents
    description: The shared, Angular and NestJS agents defined in the repository's .claude directory and when Claude Code delegates to each of them.
---

The repository's `CLAUDE.md` makes delegation mandatory: when an agent exists for a task, Claude Code hands the task to it instead of doing it inline. The agents are defined in `.claude/agents` and grouped by prefix. {% .lead %}

---

## Shared agents

| Agent                      | Use for                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `shared-tdd-developer`     | All code changes: red, green, refactor. Mandatory for `/impl`.                          |
| `shared-build-verifier`    | Verifying that builds succeed and diagnosing build errors.                              |
| `shared-test-runner`       | Running test suites and reporting results.                                              |
| `shared-logic-implementer` | Implementing business logic in services, utilities and libraries.                       |
| `shared-style-enforcer`    | Fixing ESLint and Prettier findings.                                                    |
| `shared-config-updater`    | Editing `project.json`, `tsconfig`, `nx.json`, `package.json` and ESLint configuration. |
| `shared-file-creator`      | Creating files from templates and repository patterns.                                  |
| `shared-error-handler`     | Standardising error handling in services, controllers and components.                   |
| `shared-security-scanner`  | Scanning dependencies and code patterns for vulnerabilities.                            |
| `shared-test-fixer`        | Diagnosing and repairing failing tests.                                                 |
| `shared-coverage-enforcer` | Checking and raising test coverage.                                                     |

## Angular agents

| Agent                          | Use for                                              |
| ------------------------------ | ---------------------------------------------------- |
| `angular-component-scaffolder` | Creating standalone components with signals.         |
| `angular-service-builder`      | Creating injectable services with `inject()`.        |
| `angular-jest-test-writer`     | Writing Jest unit tests for components and services. |

## NestJS agents

| Agent                    | Use for                                                |
| ------------------------ | ------------------------------------------------------ |
| `nestjs-service-builder` | Creating injectable services, repositories, providers. |
| `nestjs-module-builder`  | Creating modules and wiring their providers.           |

## How the workflow uses them

`/impl` records which agents it will use in the `orchestration.md` attachment of the issue and runs independent agents in parallel. When verification fails, the failure type decides who fixes it: lint errors go to `shared-style-enforcer`, type errors to `shared-logic-implementer`, test failures to `shared-test-fixer` and build errors to `shared-build-verifier`. The plugin's [`angular-components` agent](/docs/skills/angular-components-agent) is different in kind: it is meant for applications that consume `@smartsoft001/angular`, not for changes to the framework itself.
