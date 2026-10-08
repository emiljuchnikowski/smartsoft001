import type { Decorator, Preview } from '@storybook/react-vite';

import '../../../../shared/react/src/lib/styles.css';
import '../src/lib/styles.css';
import { SmartConfig, SmartProvider } from '@smartsoft001/react';

import { STORYBOOK_TRANSLATIONS } from '../../../../shared/react/.storybook/storybook-translations';

function getSystemTheme(): string {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

/**
 * The same frame as the @smartsoft001/react Storybook: a `SmartProvider`
 * fixed to 'pl' with the Storybook model labels, the `.dark` class driven by
 * the toolbar, and `parameters.smart` merged into the provider.
 */
const withSmart: Decorator = (Story, context) => {
  const theme = context.globals['theme'] || getSystemTheme();
  const isDark = theme === 'dark';

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }

  const smart = (context.parameters['smart'] ?? {}) as SmartConfig;

  return (
    <SmartProvider
      language="pl"
      translations={STORYBOOK_TRANSLATIONS}
      {...smart}
    >
      <Story />
    </SmartProvider>
  );
};

const preview: Preview = {
  initialGlobals: {
    theme: getSystemTheme(),
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withSmart],
};

export default preview;
