import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { GridListUsageExample } from './usage.example';

describe('docs-examples-react: GridListUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <GridListUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and description from the options', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument();
    expect(
      screen.getByText('The people behind the product.'),
    ).toBeInTheDocument();
  });

  it('should render one tile per item', () => {
    setup();

    const tiles = screen.getAllByRole('listitem');

    expect(tiles).toHaveLength(3);
    expect(tiles[2]).toHaveTextContent('Tom Cook');
  });

  it('should render the title of an item with href as a link', () => {
    setup();

    expect(
      screen.getByRole('link', { name: 'Lindsay Walton' }),
    ).toHaveAttribute('href', '/team/lindsay-walton');
  });
});
