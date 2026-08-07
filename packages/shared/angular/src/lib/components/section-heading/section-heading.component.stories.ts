import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SectionHeadingPresetComponent } from './preset/preset.component';
import { SectionHeadingComponent } from './section-heading.component';
import { ISectionHeadingOptions } from '../../models';
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const LAYOUTS = ['half', 'narrow', 'wide', 'vertical'] as const;

const IMAGE_URL =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60';

interface SectionHeadingArgs {
  title: string;
  description: string;
  label: string;
  layout: (typeof LAYOUTS)[number];
  withBadge: boolean;
  withActions: boolean;
  withImage: boolean;
  cssClass: string;
}

const meta: Meta<SectionHeadingArgs> = {
  title: 'Components/Section heading',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SectionHeadingComponent],
      // Register the preset variation as the replacement for the standard
      // component, so every <smart-section-heading> renders the preset.
      providers: [
        {
          provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
          useValue: SectionHeadingPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    label: { control: 'text', description: 'Eyebrow text above the title.' },
    layout: { control: 'select', options: LAYOUTS },
    withBadge: { control: 'boolean' },
    withActions: { control: 'boolean' },
    withImage: { control: 'boolean' },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: {
    title: 'Manage your team in one place',
    description:
      'A balanced two-column split of copy and imagery for the default layout.',
    label: 'New',
    layout: 'half',
    withBadge: false,
    withActions: false,
    withImage: true,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<SectionHeadingArgs>;

// `inputGroupTpl` and `tabsTpl` are intentionally absent: they are standard-only
// slots that SectionHeadingPresetComponent does not render. They stay covered by
// standard/standard.component.spec.ts.
const SLOTS = `
  <ng-template #image>
    <img
      src="${IMAGE_URL}"
      alt=""
      class="smart:rounded smart:aspect-video smart:w-full smart:object-cover"
    />
  </ng-template>

  <ng-template #badge>
    <span class="smart:rounded-full smart:bg-green-100 smart:px-2 smart:py-0.5 smart:text-xs smart:font-medium smart:text-green-800">
      Beta
    </span>
  </ng-template>

  <ng-template #actions>
    <a href="#" class="smart:rounded-md smart:bg-teal-600 smart:px-4 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
      Get started
    </a>
  </ng-template>
`;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      // A props factory so the TemplateRefs declared below can reach the
      // options object — Angular template expressions have no object spread.
      build: (
        image: unknown,
        badge: unknown,
        actions: unknown,
      ): ISectionHeadingOptions => ({
        title: args.title,
        description: args.description,
        label: args.label || undefined,
        presentation: { layout: args.layout },
        imageTpl: args.withImage ? (image as any) : undefined,
        badgeTpl: args.withBadge ? (badge as any) : undefined,
        actionsTpl: args.withActions ? (actions as any) : undefined,
      }),
      cssClass: args.cssClass,
    },
    template: `
      ${SLOTS}
      <div style="padding: 40px; max-width: 960px;">
        <smart-section-heading
          [options]="build(image, badge, actions)"
          [class]="cssClass"
        />
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="display: flex; flex-direction: column; gap: 24px;">${body}</div>
  </section>
`;

const heading = (options: string) =>
  `<smart-section-heading [options]="${options}" />`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      ${SLOTS}

      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 960px;">

        ${section(
          'Presentation layouts',
          LAYOUTS.map((layout) =>
            heading(`{
              title: 'Layout: ${layout}',
              description: 'Copy and imagery arranged by the ${layout} layout.',
              presentation: { layout: '${layout}' },
              imageTpl: image
            }`),
          ).join('\n'),
        )}

        ${section(
          'Eyebrow combinations',
          [
            heading(`{
              title: 'Label only',
              description: 'An eyebrow built from the label text.',
              label: 'New',
              presentation: { layout: 'vertical' }
            }`),
            heading(`{
              title: 'Badge only',
              description: 'An eyebrow built from the badge slot.',
              badgeTpl: badge,
              presentation: { layout: 'vertical' }
            }`),
            heading(`{
              title: 'Label and badge',
              description: 'Both eyebrow sources together.',
              label: 'New',
              badgeTpl: badge,
              presentation: { layout: 'vertical' }
            }`),
            heading(`{
              title: 'Neither',
              description: 'No eyebrow row is rendered at all.',
              presentation: { layout: 'vertical' }
            }`),
          ].join('\n'),
        )}

        ${section(
          'Actions slot',
          [
            heading(`{
              title: 'With actions',
              description: 'The actions slot renders beneath the description.',
              actionsTpl: actions,
              presentation: { layout: 'vertical' }
            }`),
            heading(`{
              title: 'Without actions',
              description: 'No actions slot supplied.',
              presentation: { layout: 'vertical' }
            }`),
          ].join('\n'),
        )}

        ${section(
          'Image slot',
          [
            heading(`{
              title: 'With image',
              description: 'The image zone is rendered.',
              imageTpl: image,
              presentation: { layout: 'half' }
            }`),
            heading(`{
              title: 'Without image',
              description: 'The image zone is skipped entirely.',
              presentation: { layout: 'half' }
            }`),
          ].join('\n'),
        )}

        ${section(
          'External class',
          `<smart-section-heading
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [options]="{
               title: 'Styled container',
               description: 'The external class merges into the outer section.',
               presentation: { layout: 'vertical' }
             }"
           />`,
        )}

      </div>
    `,
  }),
};
