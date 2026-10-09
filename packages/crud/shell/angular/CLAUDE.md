# @smartsoft001/crud-shell-angular

The Angular CRUD screens (Nx project `crud-shell-angular`), built on `@smartsoft001/angular`. The Angular instructions, agents and commands are in `packages/shared/angular/CLAUDE.md`.

## Skills

The Angular skills live in `packages/shared/angular/.claude/skills/` and load only once a file there is read. Before changing code here, read the one that applies:

- components, stories, docs: `packages/shared/angular/.claude/skills/angular-components/SKILL.md`
- signals, control flow, `inject()`, NgRx debugging: `packages/shared/angular/.claude/skills/angular-patterns/SKILL.md`
- specs: `packages/shared/angular/.claude/skills/angular-test-unit/SKILL.md`

## Specifics

- Selectors are `smart-crud-<name>` (`smart-crud-list-page`, `smart-crud-filter`).
- Feature state is NgRx; the end-to-end tests are the Cypress project `crud-shell-angular-e2e` (`packages/crud/shell/angular-e2e`).

```bash
npx nx test crud-shell-angular
npx nx lint crud-shell-angular
npx nx build crud-shell-angular
npx nx storybook crud-shell-angular
npx nx run crud-shell-angular:build-storybook -c ci
```
