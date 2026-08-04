import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { SearchbarComponent } from './searchbar.component';
import { SearchbarStandardComponent } from './standard/standard.component';
import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { ISearchbarOptions } from '../../models';

interface SearchbarArgs {
  placeholder: string;
  debounceTime: number;
  showToggleButton: boolean;
  show: boolean;
  cssClass: string;
}

const meta: Meta<SearchbarArgs> = {
  title: 'Components/Searchbar',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [SearchbarComponent, SearchbarStandardComponent],
    }),
  ],
  argTypes: {
    placeholder: {
      control: 'text',
      description:
        'Placeholder translation key (falls back to key string if not translated)',
    },
    debounceTime: {
      control: 'number',
      description:
        'Debounce time (ms) before `text` emits. The 1000 ms default means typing takes a full second to propagate.',
    },
    showToggleButton: {
      control: 'boolean',
      description:
        'When `show` is false, display a magnifier button that toggles the input on. With `show` false and this false, the component renders nothing.',
    },
    show: {
      control: 'boolean',
      description: 'Whether the input is visible',
    },
    cssClass: {
      control: 'text',
      description:
        'External CSS classes (alias for `class`) forwarded to the input element',
    },
  },
  args: {
    placeholder: 'search',
    debounceTime: 1000,
    showToggleButton: false,
    show: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<SearchbarArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      isShown: args.show,
      textModel: '',
      options: {
        placeholder: args.placeholder,
        debounceTime: args.debounceTime,
        showToggleButton: args.showToggleButton,
      } as ISearchbarOptions,
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; max-width: 480px;">
        <smart-searchbar
          [(show)]="isShown"
          [(text)]="textModel"
          [options]="options"
          [class]="cssClass"
        />
      </div>
    `,
  }),
};

// `text` is model.required — every instance must bind it or Angular throws
// NG0950. Showcase cells use a short debounce so typing feels responsive.
const section = (title: string, body: string, note?: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${note ? `<p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>` : ''}
    <div style="max-width: 480px;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      shownEmpty: '',
      shownFilled: 'invoice',
      hiddenWithToggle: '',
      hiddenNoToggle: '',
      customPlaceholder: '',
      styled: '',
      shown: true,
      hidden: false,
      base: { debounceTime: 300 } as ISearchbarOptions,
      withToggle: {
        debounceTime: 300,
        showToggleButton: true,
      } as ISearchbarOptions,
      noToggle: {
        debounceTime: 300,
        showToggleButton: false,
      } as ISearchbarOptions,
      customPlaceholderOptions: {
        debounceTime: 300,
        placeholder: 'searchByName',
      } as ISearchbarOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section(
          'Shown, empty',
          `<smart-searchbar [(show)]="shown" [(text)]="shownEmpty" [options]="base" />`,
        )}

        ${section(
          'Shown, pre-filled',
          `<smart-searchbar [(show)]="shown" [(text)]="shownFilled" [options]="base" />`,
        )}

        ${section(
          'Hidden, with toggle button',
          `<smart-searchbar [(show)]="hidden" [(text)]="hiddenWithToggle" [options]="withToggle" />`,
          'Collapsed to a magnifier button that expands the input on click.',
        )}

        ${section(
          'Hidden, without toggle button',
          `<div style="min-height: 24px; border: 1px dashed rgba(127,127,127,.4); border-radius: 6px;">
             <smart-searchbar [(show)]="hidden" [(text)]="hiddenNoToggle" [options]="noToggle" />
           </div>`,
          'Renders nothing at all — the dashed box marks where the component sits.',
        )}

        ${section(
          'Custom placeholder key',
          `<smart-searchbar [(show)]="shown" [(text)]="customPlaceholder" [options]="customPlaceholderOptions" />`,
          'An untranslated key falls back to the raw key string.',
        )}

        ${section(
          'External class',
          `<smart-searchbar
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-2 smart:dark:bg-yellow-900/30"
             [(show)]="shown"
             [(text)]="styled"
             [options]="base"
           />`,
        )}

      </div>
    `,
  }),
};
