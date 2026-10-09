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
    setup();

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

  it('should hand the clicked action id to the handler', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'New project' }));

    expect(screen.getByText('Last action: new-project')).toBeInTheDocument();
  });
});
