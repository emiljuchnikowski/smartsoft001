// #region usage
import { IGridListOptions, SmartGridList } from '@smartsoft001/react';

const options: IGridListOptions = {
  title: 'Team',
  description: 'The people behind the product.',
  // layout, columns and gap shape the grid of SmartGridListPreset.
  layout: 'cards',
  columns: 3,
  gap: 'md',
  items: [
    {
      id: 'lindsay',
      title: 'Lindsay Walton',
      description: 'Front-end Developer',
      href: '/team/lindsay-walton',
    },
    { id: 'courtney', title: 'Courtney Henry', description: 'Designer' },
    { id: 'tom', title: 'Tom Cook', description: 'Director of Product' },
  ],
};

export function GridListUsageExample() {
  return <SmartGridList options={options} />;
}
// #endregion
