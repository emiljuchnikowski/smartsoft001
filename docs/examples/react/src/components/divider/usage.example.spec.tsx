import { fireEvent, render, screen } from '@testing-library/react';

import { SMART_PRESET_COMPONENTS, SmartProvider } from '@smartsoft001/react';

import { DividerUsageExample } from './usage.example';

describe('docs-examples-react: DividerUsageExample', () => {
  function setup(presets = false) {
    return render(
      <SmartProvider
        language="eng"
        {...(presets ? SMART_PRESET_COMPONENTS : {})}
      >
        <DividerUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and the action label', () => {
    // Arrange
    setup();

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Team members' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add member' }),
    ).toBeInTheDocument();
  });

  it('should count the clicks on the action', () => {
    // Arrange
    setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Add member' }));

    // Assert
    expect(screen.getByText('Add member clicks: 1')).toBeInTheDocument();
  });

  it('should draw the title, a line and the action in one row with the presets', () => {
    // Arrange
    setup(true);
    const separator = screen.getByRole('separator');

    // Assert
    expect(separator).toHaveTextContent('Team members');
    expect(
      screen.getByRole('button', { name: 'Add member' }),
    ).toBeInTheDocument();
  });
});
