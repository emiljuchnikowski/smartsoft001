---
title: Fences
section: Getting started
---

Plain output needs a language too:

```
docs-check: 0 errors, 0 warnings
```

A typed fence is fine:

```ts
const answer = 42
```

A fence inside another fence is content, not an opening:

````markdown
```
nested
```
````
