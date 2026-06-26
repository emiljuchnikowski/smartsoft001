import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DrawerComponent } from './drawer.component';
import { DrawerPresetComponent } from './preset/preset.component';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [DrawerComponent],
      // Register the preset variation as the replacement for the standard
      // drawer, so every <smart-drawer> renders DrawerPresetComponent.
      providers: [
        {
          provide: DRAWER_STANDARD_COMPONENT_TOKEN,
          useValue: DrawerPresetComponent,
        },
      ],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      open: args.open,
      title: args.title,
      options: {
        position: args.position,
        wide: args.wide,
        withOverlay: args.withOverlay,
        brandedHeader: args.brandedHeader,
      },
    },
    template: `
      <div style="position: relative; min-height: 360px;">
        <smart-drawer [open]="open" [title]="title" [options]="options">
          <p class="smart:text-gray-900 smart:dark:text-white">
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </p>
        </smart-drawer>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Right (default)</h3>
          <div style="position: relative; min-height: 240px; border: 1px dashed #cbd5e1;">
            <smart-drawer [open]="true" title="Offcanvas title" [options]="{ position: 'right' }">
              <p class="smart:text-gray-900 smart:dark:text-white">Right placement.</p>
            </smart-drawer>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Left</h3>
          <div style="position: relative; min-height: 240px; border: 1px dashed #cbd5e1;">
            <smart-drawer [open]="true" title="Offcanvas title" [options]="{ position: 'left' }">
              <p class="smart:text-gray-900 smart:dark:text-white">Left placement.</p>
            </smart-drawer>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Wide + branded header</h3>
          <div style="position: relative; min-height: 240px; border: 1px dashed #cbd5e1;">
            <smart-drawer [open]="true" title="Wide drawer" [options]="{ position: 'right', wide: true, brandedHeader: true }">
              <p class="smart:text-gray-900 smart:dark:text-white">Wider panel with a branded header.</p>
            </smart-drawer>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">With overlay (backdrop)</h3>
          <div style="position: relative; min-height: 240px; border: 1px dashed #cbd5e1;">
            <smart-drawer [open]="true" title="Offcanvas title" [options]="{ position: 'right', withOverlay: true }">
              <p class="smart:text-gray-900 smart:dark:text-white">Dimmed backdrop behind the panel.</p>
            </smart-drawer>
          </div>
        </section>

      </div>
    `,
  }),
};
