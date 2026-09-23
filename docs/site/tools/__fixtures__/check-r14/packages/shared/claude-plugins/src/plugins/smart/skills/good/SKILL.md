---
name: good
description: Cites only paths that exist
user-invocable: false
---

# Good

## Reference implementation

The example application under `docs/examples/app` is the pattern to copy.

- `docs/examples/app/apps/web/src/app/app.config.ts`: a file that exists.
- `docs/examples/app/apps/web/`: a directory, cited with a trailing slash.
- `docs/examples/app/apps/web`: the same directory without it.
- `docs/examples/angular/src/nothing.ts`: another example root, not this rule's business.
- `packages/shared/angular/src/lib/nothing.ts`: a package path, not this rule's business.
