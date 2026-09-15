---
title: Quoting
section: Contributing
---

A tag quoted in a code block is documentation, not an instruction:

```markdown
{% snippet file="node/src/quoted.example.ts" region="usage" /%}
{% storybook project="angular" story="components-quoted--playground" /%}
{% skill name="quoted" /%}
```

The same tags outside the fence are instructions and have to resolve:

{% snippet file="node/src/quoted.example.ts" region="usage" /%}

{% storybook project="angular" story="components-quoted--playground" /%}

{% skill name="quoted" /%}
