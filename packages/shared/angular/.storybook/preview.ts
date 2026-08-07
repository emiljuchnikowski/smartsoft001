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
        // Toggling the class is the whole mechanism — `styles.css` redefines
        // Tailwind's `dark:` variant as `&:where(.dark, .dark *)`.
        //
        // Deliberately no inline background/color here. Forcing #f9fafb in
        // light mode put every component on a gray-50 page, which the presets
        // (Preline / HyperUI / Tailwind UI derived) are not designed for:
        // gray-100 selected states, gray-50 surfaces and hairline borders all
        // disappeared against it. Light mode renders on white, dark mode gets
        // its background from the component surfaces themselves.
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
      }
      return story();
    },
  ],
};

export default preview;
