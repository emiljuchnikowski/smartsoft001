import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SectionHeadingPresetComponent } from './preset/preset.component';
import { SectionHeadingComponent } from './section-heading.component';
import { ISectionHeadingOptions } from '../../models';
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const meta: Meta<SectionHeadingComponent> = {
  title: 'Components/Section heading',
  component: SectionHeadingComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SectionHeadingComponent>;

export const Standard: Story = {
  name: 'Standard',
  render: () => ({
    props: {
      options: {
        title: 'Applicants',
        label: 'in Engineering',
        description: 'Users currently active in this workspace.',
      } as ISectionHeadingOptions,
    },
    template: `
      <div style="padding: 24px; max-width: 720px;">
        <smart-section-heading [options]="options" />
      </div>
    `,
  }),
};

const IMAGE_URL =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60';

export const Preset: Story = {
  name: 'Preset (HyperUI)',
  parameters: { controls: { disable: true } },
  // Register the preset variation as the replacement for the standard
  // component, so every <smart-section-heading> renders the preset.
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
          useValue: SectionHeadingPresetComponent,
        },
      ],
    }),
  ],
  render: () => ({
    props: {
      half: {
        title: 'Manage your team in one place',
        label: 'New',
        description:
          'A balanced two-column split of copy and imagery for the default layout.',
        presentation: { layout: 'half' },
      } as ISectionHeadingOptions,
      narrow: {
        title: 'Ship faster with less effort',
        description: 'A narrow text column paired with a wide image.',
        presentation: { layout: 'narrow' },
      } as ISectionHeadingOptions,
      wide: {
        title: 'Designed for scale',
        description: 'The image leads and the copy follows on the right.',
        presentation: { layout: 'wide' },
      } as ISectionHeadingOptions,
      vertical: {
        title: 'Everything, stacked',
        description: 'Copy on top, image underneath — no grid.',
        presentation: { layout: 'vertical' },
      } as ISectionHeadingOptions,
    },
    template: `
      <ng-template #image>
        <img
          src="${IMAGE_URL}"
          alt=""
          class="smart:rounded smart:aspect-video smart:w-full smart:object-cover"
        />
      </ng-template>

      <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px;">
        <smart-section-heading [options]="{ ...half, imageTpl: image }" />
        <smart-section-heading [options]="{ ...narrow, imageTpl: image }" />
        <smart-section-heading [options]="{ ...wide, imageTpl: image }" />
        <smart-section-heading [options]="{ ...vertical, imageTpl: image }" />
      </div>
    `,
  }),
};
