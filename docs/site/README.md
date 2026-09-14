# @smartsoft001/docs

Public documentation site for the `@smartsoft001/*` framework, published to GitHub Pages at
https://emiljuchnikowski.github.io/smartsoft001/.

Built with [Next.js](https://nextjs.org) (static export), [Markdoc](https://markdoc.io) and
[Tailwind CSS](https://tailwindcss.com) on top of the Tailwind Plus **Syntax** site template.
The template is used under the [Tailwind Plus license](https://tailwindcss.com/plus/license)
as part of this end product; it is not redistributed on its own.

## Commands

```bash
npx nx run docs:serve   # http://localhost:3000/smartsoft001/
npx nx run docs:build   # static export to docs/site/out
npx nx run docs:lint
```

Pages live in `src/app/**/page.md` (Markdoc). Navigation is defined in `src/lib/navigation.ts`.
Global search is powered by FlexSearch and indexed at build time (`src/markdoc/search.mjs`).
