import type { StorybookConfig } from '@storybook/angular';
import webpack from 'webpack';

const { NormalModuleReplacementPlugin } = webpack;

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

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
        require.resolve('@angular/common/http'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/core\/rxjs-interop$/,
        require.resolve('@angular/core/rxjs-interop'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/cdk\/drag-drop$/,
        require.resolve('@angular/cdk/drag-drop'),
      ),
      new NormalModuleReplacementPlugin(
        /^@angular\/cdk\/table$/,
        require.resolve('@angular/cdk/table'),
      ),
    );
    return webpackConfig;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
