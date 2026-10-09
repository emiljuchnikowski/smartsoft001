import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { NavbarUsageExample } from './usage.example';

describe('docs-examples-react: NavbarUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <NavbarUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the logo and items from the options', () => {
    const { container } = setup();

    expect(container.querySelector('.logo img')).toHaveAttribute('alt', 'Acme');
    expect(container.querySelector('.items')).toHaveTextContent('Dashboard');
    expect(container.querySelector('.items')).toHaveTextContent('Projects');
  });

  it('should mark the first item as current', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveClass(
      'current',
    );
  });

  it('should make the clicked item current through the handler', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));

    expect(screen.getByRole('button', { name: 'Projects' })).toHaveClass(
      'current',
    );
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveClass(
      'current',
    );
  });
});
