# use-stack-packages

Since 2.143.0 the framework publishes four meta packages that pin a set of libraries at one
version: `@smartsoft001/core`, `@smartsoft001/angular-stack`, `@smartsoft001/nestjs-stack` and
`@smartsoft001/payments-stack`. This migration rewrites your `package.json` so a project that
already installs a whole set installs the set instead of listing its parts.

## What it changes

In `dependencies` and in `devDependencies`, whenever a section lists **two or more** packages that
one stack pins, those entries are replaced by a single entry for the stack:

```diff
 "dependencies": {
-  "@smartsoft001/angular": "2.143.0",
-  "@smartsoft001/crud-shell-angular": "2.143.0"
+  "@smartsoft001/angular-stack": "2.143.0"
 }
```

Details worth knowing:

- The stack takes the version the replaced entries carried. They are normally in lockstep. When
  they are not, the highest version wins and the log line says so.
- `@smartsoft001/core` is resolved first, and is itself part of the Angular and the NestJS stack.
  A project with the full core set plus `@smartsoft001/angular` ends up with `angular-stack` alone,
  because that stack already pins `core`.
- An entry for a stack you already install is folded into the result rather than duplicated.
- The new entry keeps the position and the section of the first entry it replaces. If the section
  was sorted alphabetically it stays sorted.
- Every replacement is logged, and one final line names the packages that stayed individually
  installed.

## What it deliberately does not change

- **A single member of a stack.** Installing one library on purpose is a legitimate choice, so one
  entry is never turned into a stack that would pull in the rest.
- **Packages no stack pins**: `@smartsoft001/fb`, `@smartsoft001/google` and
  `@smartsoft001/claude-plugins` are left exactly as they are.
- **Members split across sections.** Each section is counted on its own, so one member in
  `dependencies` and one in `devDependencies` is two lonely entries, not a stack.
- **Anything outside `package.json`.** Imports keep working because the stacks re-export nothing and
  hide nothing: every library stays installed, just by way of the stack. Your lockfile is not
  touched, so run your package manager's install afterwards.

Running the migration a second time changes nothing.

## How to undo it

The change is confined to `package.json`, so `git checkout -- package.json` before you install is
enough. If you have already installed, put the individual entries back at the version the stack
carried and install again. The stacks add no code of their own, so nothing else needs reverting.
