# Angular libraries

Instructions for the Angular code of the monorepo. Claude Code loads this file when it works on files in `packages/shared/angular`; `packages/crud/shell/angular/CLAUDE.md` points here for the CRUD shell.

## Projects

| Nx project               | Path                              | Package                            |
| ------------------------ | --------------------------------- | ---------------------------------- |
| `angular`                | `packages/shared/angular`         | `@smartsoft001/angular`            |
| `crud-shell-angular`     | `packages/crud/shell/angular`     | `@smartsoft001/crud-shell-angular` |
| `crud-shell-angular-e2e` | `packages/crud/shell/angular-e2e` | Cypress tests of the CRUD shell    |
| `angular-stack`          | `packages/meta/angular-stack`     | `@smartsoft001/angular-stack`      |

Stack specifics: Angular 22, NgRx 22 for the CRUD state, ng-packagr builds, Storybook through `@storybook/angular`.

## Skills

The Angular skills live in `packages/shared/angular/.claude/skills/`. They load the first time Claude reads or edits a file below `packages/shared/angular`; from the CRUD shell, read the `SKILL.md` directly.

| Skill                | Use For                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `angular-components` | Create/modify Angular UI components (tests, Storybook, docs, plugin sync)     |
| `angular-patterns`   | Angular signals, control flow, `inject()`, import order, debugging            |
| `angular-test-unit`  | TestBed component, service and guard specs (on top of the shared `test-unit`) |

## Agents

Use these together with the shared agents listed in the root `CLAUDE.md`:

| Agent                          | Use For                      |
| ------------------------------ | ---------------------------- |
| `angular-component-scaffolder` | Create standalone components |
| `angular-service-builder`      | Create injectable services   |
| `angular-jest-test-writer`     | Write Jest unit tests        |

## Conventions

- **Component prefix**: the Nx `prefix` is `smart` for `crud-shell-angular` and `lib` for `angular`, but every selector in both libraries uses `smart-` (`smart-button`, `smart-button-standard`, `smart-crud-list-page`); follow the existing selectors.
- Styling: Tailwind CSS 4 with the `smart:` prefix, `ViewEncapsulation.None`, dark mode through `smart:dark:` under a `.dark` class.
- Plugin sync: component changes are mirrored in the `smart-angular` plugin (`packages/shared/claude-plugins/src/plugins/smart-angular/`), as the `angular-components` skill describes.

## Commands

```bash
npx nx test angular
npx nx test crud-shell-angular
npx nx lint angular
npx nx build angular
npx nx storybook angular
npx nx storybook crud-shell-angular
npx nx run angular:build-storybook -c ci
npx nx run angular:test-storybook
```
