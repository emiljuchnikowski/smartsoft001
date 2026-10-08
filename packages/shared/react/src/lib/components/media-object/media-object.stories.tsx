import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartMediaObjectPreset } from './preset/media-object-preset';
import { IMediaObjectOptions } from '../../models';

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
  parameters: {
    // SmartMediaObjectPreset is rendered directly; the registration mirrors
    // how the preset becomes the replacement for every <SmartMediaObject>.
    smart: { components: { 'media-object': SmartMediaObjectPreset } },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: 640 }}>
      <SmartMediaObjectPreset
        mediaUrl={IMAGE}
        mediaAlt="Portrait"
        options={{
          alignment: args.alignment,
          position: args.position,
          wide: args.wide,
          responsive: args.responsive,
          nested: args.nested,
        }}
      >
        <h3 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
          {args.heading}
        </h3>
        <p>{args.body}</p>
      </SmartMediaObjectPreset>
    </div>
  ),
};
// #endregion

const Item = ({
  heading,
  body,
  options,
}: {
  heading: string;
  body: string;
  options: IMediaObjectOptions;
}) => (
  <SmartMediaObjectPreset
    mediaUrl={IMAGE}
    mediaAlt="Portrait"
    options={options}
  >
    <h3 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
      {heading}
    </h3>
    <p>{body}</p>
  </SmartMediaObjectPreset>
);

const Section = ({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{note}</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {children}
    </div>
  </section>
);

// A dashed frame around each example makes the row box — and therefore where
// the media sits inside it — readable at a glance.
const Framed = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <p
      style={{ fontSize: 13, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}
    >
      {label}
    </p>
    <div
      style={{
        border: '1px dashed rgba(128,128,128,.5)',
        borderRadius: 8,
        padding: 12,
      }}
    >
      {children}
    </div>
  </div>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        padding: 24,
        maxWidth: 640,
      }}
    >
      <Section
        title="Alignments"
        note="Body copy runs taller than the 64px thumbnail so the media visibly moves: flush to the top, centred, dropped to the bottom, or stretched to the full row height."
      >
        {ALIGNMENTS.map((alignment) => (
          <Framed key={alignment} label={ALIGNMENT_LABELS[alignment]}>
            <Item
              heading="Media object"
              body={TALL_BODY}
              options={{ alignment }}
            />
          </Framed>
        ))}
      </Section>

      <Section
        title="Positions"
        note="The row reverses so the media sits on the trailing edge."
      >
        {POSITIONS.map((position) => (
          <Framed key={position} label={POSITION_LABELS[position]}>
            <Item
              heading="Media object"
              body="The thumbnail swaps sides while the body keeps its reading order."
              options={{ position, alignment: 'center' }}
            />
          </Framed>
        ))}
      </Section>

      <Section
        title="Wide"
        note="Each modifier is paired with the unmodified default directly above it, so the change is a direct comparison."
      >
        <Framed label="Default, a 64px square thumbnail">
          <Item
            heading="Media object"
            body="A square thumbnail beside the body."
            options={{ alignment: 'center' }}
          />
        </Framed>
        <Framed label="Wide, twice the thumbnail width">
          <Item
            heading="Media object"
            body="Twice the thumbnail width, for landscape imagery."
            options={{ wide: true, alignment: 'center' }}
          />
        </Framed>
      </Section>

      <Section
        title="Responsive"
        note="Driven by the `sm` (640px) viewport breakpoint, not the container width — narrow the preview (or pick a mobile viewport in the toolbar) and only the second example folds into a column."
      >
        <Framed label="Default, always a row">
          <Item
            heading="Media object"
            body="Stays side by side at every viewport width."
            options={{ alignment: 'center' }}
          />
        </Framed>
        <Framed label="Responsive, a column under 640px">
          <Item
            heading="Media object"
            body="Stacks the media above the body on narrow viewports, then rows out from sm up."
            options={{ responsive: true }}
          />
        </Framed>
      </Section>

      <Section
        title="Nested"
        note="Nesting is a relationship, so it is shown in context: a reply sitting inside the body of a parent media object, with the tighter gap and the top margin that separates it."
      >
        <Framed label="A reply nested inside a parent body">
          <SmartMediaObjectPreset
            mediaUrl={IMAGE}
            mediaAlt="Portrait"
            options={{ alignment: 'top' }}
          >
            <h3 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
              Parent post
            </h3>
            <p>The parent entry, laid out with the default 16px gap.</p>
            <SmartMediaObjectPreset
              mediaUrl={IMAGE}
              mediaAlt="Portrait"
              options={{ nested: true, alignment: 'top' }}
            >
              <h4 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
                Nested reply
              </h4>
              <p>
                Indented from the parent body, with a 12px gap and a top margin.
              </p>
            </SmartMediaObjectPreset>
          </SmartMediaObjectPreset>
        </Framed>
      </Section>
    </div>
  ),
};
