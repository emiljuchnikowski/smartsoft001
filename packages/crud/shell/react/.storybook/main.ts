import type { StorybookConfig } from '@storybook/react-vite';

import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(here, '../../../../..');

/**
 * The `@smartsoft001/*` path aliases of tsconfig.base.json, so the stories
 * import the libraries from source.
 */
function workspaceAliases(): Record<string, string> {
  const tsconfig = require(join(workspaceRoot, 'tsconfig.base.json'));
  const paths: Record<string, string[]> = tsconfig.compilerOptions.paths;

  return Object.fromEntries(
    Object.entries(paths)
      .filter(([name]) => name.startsWith('@smartsoft001/'))
      .map(([name, [target]]) => [name, join(workspaceRoot, target)]),
  );
}

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: { ...workspaceAliases() },
    },
    css: {
      ...viteConfig.css,
      postcss: join(workspaceRoot, 'postcss.config.js'),
    },
  }),
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
