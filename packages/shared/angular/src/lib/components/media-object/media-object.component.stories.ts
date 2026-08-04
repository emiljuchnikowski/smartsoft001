import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MediaObjectComponent } from './media-object.component';
import { MediaObjectPresetComponent } from './preset/preset.component';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const IMAGE =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const ALIGNMENTS = ['top', 'center', 'bottom', 'stretched'] as const;
const POSITIONS = ['left', 'right'] as const;

interface MediaObjectArgs {
  heading: string;
  body: string;
  alignment: (typeof ALIGNMENTS)[number];
  position: (typeof POSITIONS)[number];
  wide: boolean;
  responsive: boolean;
  nested: boolean;
}

const meta: Meta<MediaObjectArgs> = {
  title: 'Components/MediaObject',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      // MediaObjectPresetComponent is used through its own selector because
      // <smart-media-object> dispatches through NgComponentOutlet once the
      // token is registered, which drops the projected body.
      imports: [MediaObjectComponent, MediaObjectPresetComponent],
      providers: [
        {
          provide: MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN,
          useValue: MediaObjectPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    heading: { control: 'text' },
    body: { control: 'text' },
    alignment: { control: 'select', options: ALIGNMENTS },
    position: { control: 'inline-radio', options: POSITIONS },
    wide: { control: 'boolean' },
    responsive: { control: 'boolean' },
    nested: { control: 'boolean' },
  },
  args: {
    heading: 'Media object',
    body: 'Rounded thumbnail beside the projected body.',
    alignment: 'center',
    position: 'left',
    wide: false,
    responsive: false,
    nested: false,
  },
};

export default meta;
type Story = StoryObj<MediaObjectArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      image: IMAGE,
      heading: args.heading,
      body: args.body,
      options: {
        alignment: args.alignment,
        position: args.position,
        wide: args.wide,
        responsive: args.responsive,
        nested: args.nested,
      },
    },
    template: `
      <div style="padding: 40px; max-width: 640px;">
        <smart-media-object-preset
          [mediaUrl]="image"
          mediaAlt="Portrait"
          [options]="options"
        >
          <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">{{ heading }}</h3>
          <p>{{ body }}</p>
        </smart-media-object-preset>
      </div>
    `,
  }),
};

const item = (heading: string, body: string, options: string) => `
  <smart-media-object-preset
    [mediaUrl]="image"
    mediaAlt="Portrait"
    [options]="${options}"
  >
    <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">${heading}</h3>
    <p>${body}</p>
  </smart-media-object-preset>
`;

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="display: flex; flex-direction: column; gap: 24px;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { image: IMAGE },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 640px;">

        ${section(
          'Alignments',
          ALIGNMENTS.map((alignment) =>
            item(
              `alignment: ${alignment}`,
              'Two lines of body copy so the cross-axis alignment is visible against the thumbnail.',
              `{ alignment: '${alignment}' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Positions',
          POSITIONS.map((position) =>
            item(
              `position: ${position}`,
              'The row reverses so the media sits on the trailing edge.',
              `{ position: '${position}', alignment: 'center' }`,
            ),
          ).join('\n'),
        )}

        ${section(
          'Modifiers',
          [
            item(
              'wide',
              'A wider thumbnail footprint for landscape imagery.',
              `{ wide: true }`,
            ),
            item(
              'responsive',
              'Stacks into a column on mobile, then rows out from the sm breakpoint.',
              `{ responsive: true }`,
            ),
            item(
              'nested',
              'Indented with a tighter gap, for replies and threaded content.',
              `{ nested: true }`,
            ),
          ].join('\n'),
        )}

      </div>
    `,
  }),
};
