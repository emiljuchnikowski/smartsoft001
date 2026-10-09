import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { EmptyStateUsageExample } from './usage.example';

describe('docs-examples-react: EmptyStateUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <EmptyStateUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title, description and action from the options', () => {
    // Arrange
    setup();

    // Assert
    expect(
      screen.getByRole('heading', { name: 'No projects' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating a new project.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'New project' }),
    ).toBeInTheDocument();
  });

  it('should show the id of the clicked action', () => {
    // Arrange
    setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'New project' }));

    // Assert
    expect(screen.getByText('Last action: new-project')).toBeInTheDocument();
  });
});
