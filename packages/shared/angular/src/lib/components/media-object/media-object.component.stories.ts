import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MediaObjectComponent } from './media-object.component';
import { MediaObjectPresetComponent } from './preset/preset.component';
import { MEDIA_OBJECT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const IMAGE =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const ALIGNMENTS = ['top', 'center', 'bottom', 'stretched'] as const;
const POSITIONS = ['left', 'right'] as const;

// Showcase captions read as prose, never as the raw option value.
const ALIGNMENT_LABELS: Record<(typeof ALIGNMENTS)[number], string> = {
  top: 'Flush with the top',
  center: 'Centred against the body',
  bottom: 'Dropped to the bottom',
  stretched: 'Stretched to the full height',
};

const POSITION_LABELS: Record<(typeof POSITIONS)[number], string> = {
  left: 'Media on the leading edge',
  right: 'Media on the trailing edge',
};

// The thumbnail is 64px tall. Body copy shorter than that makes every
// cross-axis alignment collapse to within a couple of pixels of each other, so
// the alignment examples deliberately run several lines taller than the media.
const TALL_BODY = `Cross-axis alignment only shows up when the body is taller than the
  thumbnail, so this copy deliberately runs past 64px. Watch where the image
  sits against the block as the alignment changes — flush with the first line,
  centred against the whole block, dropped to the last line, or stretched to
  fill the full height.`;

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
    body: {
      control: 'text',
      description:
        'Keep this longer than ~64px of copy, otherwise `alignment` has almost nothing to move against.',
    },
    alignment: {
      control: 'select',
      options: ALIGNMENTS,
      description:
        'Cross-axis placement of the media against the body. `stretched` fills the row height instead.',
    },
    position: {
      control: 'inline-radio',
      options: POSITIONS,
      description: 'Which edge the media sits on.',
    },
    wide: { control: 'boolean', description: 'Doubles the media width.' },
    responsive: {
      control: 'boolean',
      description:
        'Stacks into a column below the `sm` (640px) viewport breakpoint. Narrow the preview to see it.',
    },
    nested: {
      control: 'boolean',
      description: 'Tighter gap plus a top margin, for threaded replies.',
    },
  },
  args: {
    heading: 'Media object',
    body: TALL_BODY,
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

const section = (title: string, note: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <p style="font-size: 13px; opacity: .7; margin-bottom: 8px;">${note}</p>
    <div style="display: flex; flex-direction: column; gap: 24px;">${body}</div>
  </section>
`;

// A dashed frame around each example makes the row box — and therefore where
// the media sits inside it — readable at a glance.
const framed = (label: string, body: string) => `
  <div>
    <p style="font-size: 13px; font-weight: 600; opacity: .75; margin-bottom: 6px;">${label}</p>
    <div style="border: 1px dashed rgba(128,128,128,.5); border-radius: 8px; padding: 12px;">
      ${body}
    </div>
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { image: IMAGE },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; padding: 24px; max-width: 640px;">

        ${section(
          'Alignments',
          'Body copy runs taller than the 64px thumbnail so the media visibly moves: flush to the top, centred, dropped to the bottom, or stretched to the full row height.',
          ALIGNMENTS.map((alignment) =>
            framed(
              ALIGNMENT_LABELS[alignment],
              item('Media object', TALL_BODY, `{ alignment: '${alignment}' }`),
            ),
          ).join('\n'),
        )}

        ${section(
          'Positions',
          'The row reverses so the media sits on the trailing edge.',
          POSITIONS.map((position) =>
            framed(
              POSITION_LABELS[position],
              item(
                'Media object',
                'The thumbnail swaps sides while the body keeps its reading order.',
                `{ position: '${position}', alignment: 'center' }`,
              ),
            ),
          ).join('\n'),
        )}

        ${section(
          'Wide',
          'Each modifier is paired with the unmodified default directly above it, so the change is a direct comparison.',
          [
            framed(
              'Default, a 64px square thumbnail',
              item(
                'Media object',
                'A square thumbnail beside the body.',
                `{ alignment: 'center' }`,
              ),
            ),
            framed(
              'Wide, twice the thumbnail width',
              item(
                'Media object',
                'Twice the thumbnail width, for landscape imagery.',
                `{ wide: true, alignment: 'center' }`,
              ),
            ),
          ].join('\n'),
        )}

        ${section(
          'Responsive',
          'Driven by the `sm` (640px) viewport breakpoint, not the container width — narrow the preview (or pick a mobile viewport in the toolbar) and only the second example folds into a column.',
          [
            framed(
              'Default, always a row',
              item(
                'Media object',
                'Stays side by side at every viewport width.',
                `{ alignment: 'center' }`,
              ),
            ),
            framed(
              'Responsive, a column under 640px',
              item(
                'Media object',
                'Stacks the media above the body on narrow viewports, then rows out from sm up.',
                `{ responsive: true }`,
              ),
            ),
          ].join('\n'),
        )}

        ${section(
          'Nested',
          'Nesting is a relationship, so it is shown in context: a reply sitting inside the body of a parent media object, with the tighter gap and the top margin that separates it.',
          framed(
            'A reply nested inside a parent body',
            `
              <smart-media-object-preset
                [mediaUrl]="image"
                mediaAlt="Portrait"
                [options]="{ alignment: 'top' }"
              >
                <h3 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Parent post</h3>
                <p>The parent entry, laid out with the default 16px gap.</p>
                <smart-media-object-preset
                  [mediaUrl]="image"
                  mediaAlt="Portrait"
                  [options]="{ nested: true, alignment: 'top' }"
                >
                  <h4 class="smart:font-semibold smart:text-gray-900 smart:dark:text-white">Nested reply</h4>
                  <p>Indented from the parent body, with a 12px gap and a top margin.</p>
                </smart-media-object-preset>
              </smart-media-object-preset>
            `,
          ),
        )}

      </div>
    `,
  }),
};
