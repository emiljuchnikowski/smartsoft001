import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { SmartSearchbar } from './searchbar';
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

/** Controlled `show` and `text`: the story keeps both in its state. */
const SearchbarPlayground = (args: SearchbarArgs) => {
  const [isShown, setIsShown] = useState(args.show);
  const [textModel, setTextModel] = useState('');

  return (
    <div style={{ padding: 40, maxWidth: 480 }}>
      <SmartSearchbar
        show={isShown}
        onShowChange={setIsShown}
        text={textModel}
        onTextChange={setTextModel}
        options={
          {
            placeholder: args.placeholder,
            debounceTime: args.debounceTime,
            showToggleButton: args.showToggleButton,
          } as ISearchbarOptions
        }
        className={args.cssClass}
      />
    </div>
  );
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => <SearchbarPlayground key={String(args.show)} {...args} />,
};
// #endregion

// Showcase cells use a short debounce so typing feels responsive.
const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
    {note ? (
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    ) : null}
    <div style={{ maxWidth: 480 }}>{children}</div>
  </section>
);

const base = { debounceTime: 300 } as ISearchbarOptions;
const withToggle = {
  debounceTime: 300,
  showToggleButton: true,
} as ISearchbarOptions;
const noToggle = {
  debounceTime: 300,
  showToggleButton: false,
} as ISearchbarOptions;
const customPlaceholderOptions = {
  debounceTime: 300,
  placeholder: 'searchByName',
} as ISearchbarOptions;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      <Section title="Shown, empty">
        <SmartSearchbar defaultShow={true} defaultText="" options={base} />
      </Section>

      <Section title="Shown with text typed in">
        <SmartSearchbar
          defaultShow={true}
          defaultText="invoice"
          options={base}
        />
      </Section>

      <Section
        title="Hidden, with toggle button"
        note="Collapsed to a magnifier button that expands the input on click."
      >
        <SmartSearchbar
          defaultShow={false}
          defaultText=""
          options={withToggle}
        />
      </Section>

      <Section
        title="Hidden, without toggle button"
        note="Renders nothing at all — the dashed box marks where the component sits."
      >
        <div
          style={{
            minHeight: 24,
            border: '1px dashed rgba(127,127,127,.4)',
            borderRadius: 6,
          }}
        >
          <SmartSearchbar
            defaultShow={false}
            defaultText=""
            options={noToggle}
          />
        </div>
      </Section>

      <Section
        title="Custom placeholder key"
        note="An untranslated key falls back to the raw key string."
      >
        <SmartSearchbar
          defaultShow={true}
          defaultText=""
          options={customPlaceholderOptions}
        />
      </Section>

      <Section title="External class">
        <SmartSearchbar
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-2 smart:dark:bg-yellow-900/30"
          defaultShow={true}
          defaultText=""
          options={base}
        />
      </Section>
    </div>
  ),
};
