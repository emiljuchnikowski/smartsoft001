import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { StackedLayoutUsageExample } from './usage.example';

describe('docs-examples-react: StackedLayoutUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <StackedLayoutUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the navigation and the title from the options', () => {
    // Act
    setup();

    // Assert
    expect(screen.getByRole('navigation')).toHaveTextContent('Dashboard');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Projects',
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
      'data-role',
      'title',
    );
  });

  it('should expose the default container width on the layout root', () => {
    // Act
    const { container } = setup();

    // Assert
    expect(container.querySelector('[data-container-width]')).toHaveAttribute(
      'data-container-width',
      'xl',
    );
  });

  it('should render the children in the main area', () => {
    // Act
    setup();

    // Assert
    expect(screen.getByRole('main')).toHaveTextContent(
      'You have 3 active projects',
    );
  });
});
