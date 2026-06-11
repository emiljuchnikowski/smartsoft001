import type { StorybookConfig } from '@storybook/angular';
import webpack from 'webpack';

const { NormalModuleReplacementPlugin } = webpack;

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: getAbsolutePath('@storybook/angular'),
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    // tsconfig.base.json maps these Angular secondary entrypoints to .d.ts
    // files so ts-jest can type-check them (Jest cannot resolve the types
    // from the package `exports` map). Webpack honours the same tsconfig
    // paths (TsconfigPathsPlugin) and would bundle the .d.ts as an EMPTY
    // module (every export `undefined` at runtime), so the requests are
    // rewritten to the runtime fesm bundles BEFORE resolution for every
    // secondary entrypoint that ships in the preview bundle.
    webpackConfig.plugins = webpackConfig.plugins ?? [];
    webpackConfig.plugins.push(
      new NormalModuleReplacementPlugin(
        /^@angular\/common\/http$/,
        resolveRuntime('@angular/common/http'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/core\/rxjs-interop$/,
        resolveRuntime('@angular/core/rxjs-interop'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/cdk\/drag-drop$/,
        resolveRuntime('@angular/cdk/drag-drop'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/cdk\/table$/,
        resolveRuntime('@angular/cdk/table'),
      ),
    );
    return webpackConfig;
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/** Resolve a specifier to its runtime entry (fesm .mjs) via the exports map. */
function resolveRuntime(specifier: string): string {
  return fileURLToPath(import.meta.resolve(specifier));
}
