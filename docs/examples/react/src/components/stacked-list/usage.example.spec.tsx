import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { StackedListUsageExample } from './usage.example';

describe('docs-examples-react: StackedListUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <StackedListUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the list heading from the options', () => {
    // Act
    setup();

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Team members' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('People with access to this workspace.'),
    ).toBeInTheDocument();
  });

  it('should render one row per item with its details', () => {
    // Arrange
    setup();

    // Act
    const rows = screen.getAllByRole('listitem');

    // Assert
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Leslie Alexander');
    expect(rows[0]).toHaveTextContent('Co-Founder / CEO');
  });

  it('should render the title of an item with a href as a link', () => {
    // Act
    setup();

    // Assert
    expect(
      screen.getByRole('link', { name: 'Leslie Alexander' }),
    ).toHaveAttribute('href', '/team/leslie');
  });
});
