import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartDrawer } from './drawer';
import { SmartDrawerPreset } from './preset/drawer-preset';

interface DrawerArgs {
  open: boolean;
  title: string;
  position: 'left' | 'right';
  wide: boolean;
  withOverlay: boolean;
  brandedHeader: boolean;
}

const meta: Meta<DrawerArgs> = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // drawer, so every <SmartDrawer> renders SmartDrawerPreset.
    smart: { components: { drawer: SmartDrawerPreset } },
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    position: { control: 'radio', options: ['left', 'right'] },
    wide: { control: 'boolean' },
    withOverlay: { control: 'boolean' },
    brandedHeader: { control: 'boolean' },
  },
  args: {
    open: true,
    title: 'Offcanvas title',
    position: 'right',
    wide: false,
    withOverlay: false,
    brandedHeader: false,
  },
};

export default meta;
type Story = StoryObj<DrawerArgs>;

// The Angular stories bind `[open]` one way into the drawer's `open` model,
// so the drawer can still close itself: `defaultOpen` (re-mounted when the
// control changes) is the React counterpart.

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        minHeight: 360,
      }}
    >
      <SmartDrawer
        key={String(args.open)}
        defaultOpen={args.open}
        title={args.title}
        options={{
          position: args.position,
          wide: args.wide,
          withOverlay: args.withOverlay,
          brandedHeader: args.brandedHeader,
        }}
      >
        <p className="smart:text-gray-900 smart:dark:text-white">
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </p>
      </SmartDrawer>
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const frame = {
  position: 'relative',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  minHeight: 240,
  border: '1px dashed #cbd5e1',
} as const;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Right (default)</h3>
        <div style={frame}>
          <SmartDrawer
            defaultOpen={true}
            title="Offcanvas title"
            options={{ position: 'right' }}
          >
            <p className="smart:text-gray-900 smart:dark:text-white">
              Right placement.
            </p>
          </SmartDrawer>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Left</h3>
        <div style={frame}>
          <SmartDrawer
            defaultOpen={true}
            title="Offcanvas title"
            options={{ position: 'left' }}
          >
            <p className="smart:text-gray-900 smart:dark:text-white">
              Left placement.
            </p>
          </SmartDrawer>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Wide + branded header</h3>
        <div style={frame}>
          <SmartDrawer
            defaultOpen={true}
            title="Wide drawer"
            options={{ position: 'right', wide: true, brandedHeader: true }}
          >
            <p className="smart:text-gray-900 smart:dark:text-white">
              Wider panel with a branded header.
            </p>
          </SmartDrawer>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With overlay (backdrop)</h3>
        <div style={frame}>
          <SmartDrawer
            defaultOpen={true}
            title="Offcanvas title"
            options={{ position: 'right', withOverlay: true }}
          >
            <p className="smart:text-gray-900 smart:dark:text-white">
              Dimmed backdrop behind the panel.
            </p>
          </SmartDrawer>
        </div>
      </section>
    </div>
  ),
};
