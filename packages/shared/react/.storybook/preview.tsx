import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/lib/styles.css';
import { SmartProvider } from '../src';
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
 * Storybook model labels, and follows the toolbar theme through the `.dark`
 * class, exactly as the Angular Storybook does, so the two can be compared
 * screenshot by screenshot.
 */
const withSmart: Decorator = (Story, context) => {
  const theme = context.globals['theme'] || getSystemTheme();
  const isDark = theme === 'dark';

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }

  return (
    <SmartProvider language="pl" translations={STORYBOOK_TRANSLATIONS}>
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
