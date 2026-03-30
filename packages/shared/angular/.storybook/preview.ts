import type { Preview } from '@storybook/angular';

function getSystemTheme(): string {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

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
  decorators: [
    (story, context) => {
      const theme = context.globals['theme'] || getSystemTheme();
      const isDark = theme === 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
        document.documentElement.style.backgroundColor = isDark
          ? '#111827'
          : '#f9fafb';
        document.body.style.backgroundColor = isDark ? '#111827' : '#f9fafb';
        document.documentElement.style.color = isDark ? '#f9fafb' : '#111827';
        document.body.style.color = isDark ? '#f9fafb' : '#111827';
      }
      return story();
    },
  ],
};

export default preview;
