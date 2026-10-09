import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/lib/styles.css';
import { SmartConfig, SmartProvider } from '../src';
import { STORYBOOK_TRANSLATIONS } from './storybook-translations';

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
 * Every story renders inside a `SmartProvider` fixed to 'pl' with the
 * Storybook model labels, so its text is the same on every run, and follows
 * the toolbar theme through the `.dark` class on `<html>` and `<body>`.
 */
const withSmart: Decorator = (Story, context) => {
  const theme = context.globals['theme'] || getSystemTheme();
  const isDark = theme === 'dark';

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }

  // A story replaces implementations or adds providers through
  // `parameters.smart`, a `SmartConfig` spread over the defaults below.
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
