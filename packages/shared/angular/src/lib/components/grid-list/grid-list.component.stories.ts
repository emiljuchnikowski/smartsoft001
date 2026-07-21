import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { GridListComponent } from './grid-list.component';
import { GridListPresetComponent } from './preset/preset.component';
import { IGridListOptions } from '../../models';
import { GRID_LIST_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const LOGO =
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=96&h=96&q=80';

const CARD_ITEMS: IGridListOptions['items'] = [
  {
    id: '1',
    title: 'Lindsay Walton',
    description: 'Front-end developer',
    imageUrl: LOGO,
    href: '#',
  },
  {
    id: '2',
    title: 'Courtney Henry',
    description: 'Designer',
    imageUrl: LOGO,
    href: '#',
  },
  {
    id: '3',
    title: 'Tom Cook',
    description: 'Director of Product',
    imageUrl: LOGO,
    href: '#',
  },
];

const meta: Meta = {
  title: 'Components/GridList',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [GridListComponent],
      // Register the preset variation as the replacement for the standard grid
      // list, so every <smart-grid-list> renders GridListPresetComponent.
      providers: [
        {
          provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
          useValue: GridListPresetComponent,
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Preset: Story = {
  name: 'Preset',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      cards: {
        title: 'Team',
        description: 'The people building the product.',
        columns: 3,
        gap: 'md',
        layout: 'cards',
        items: CARD_ITEMS,
      } as IGridListOptions,
      horizontal: {
        title: 'Horizontal layout',
        columns: 2,
        gap: 'md',
        layout: 'horizontal',
        items: CARD_ITEMS,
      } as IGridListOptions,
      logos: {
        title: 'Logos',
        columns: 4,
        gap: 'lg',
        layout: 'logos',
        items: [
          { title: 'Acme', href: '#', imageUrl: LOGO },
          { title: 'Globex', href: '#', imageUrl: LOGO },
          { title: 'Soylent', href: '#', imageUrl: LOGO },
          { title: 'Initech', href: '#', imageUrl: LOGO },
        ],
      } as IGridListOptions,
      empty: { title: 'Empty state', items: [] } as IGridListOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 40px; padding: 24px; max-width: 960px;">

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Cards</h3>
          <smart-grid-list [options]="cards"></smart-grid-list>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Horizontal</h3>
          <smart-grid-list [options]="horizontal"></smart-grid-list>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Logos</h3>
          <smart-grid-list [options]="logos"></smart-grid-list>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Empty</h3>
          <smart-grid-list [options]="empty"></smart-grid-list>
        </section>

      </div>
    `,
  }),
};
