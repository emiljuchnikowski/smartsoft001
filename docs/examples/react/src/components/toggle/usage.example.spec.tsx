import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ToggleUsageExample } from './usage.example';

describe('docs-examples-react: ToggleUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <ToggleUsageExample />
      </SmartProvider>,
    );

    return screen.getByRole('checkbox', { name: 'Email notifications' });
  }

  it('should render the switch from the options and the state value', () => {
    const input = setup();

    expect(input).toBeChecked();
  });

  it('should describe the switch with the description text', () => {
    const input = setup();

    expect(input).toHaveAccessibleDescription(
      'Get an email when someone comments on your post.',
    );
  });

  it('should write the new value back to the state', () => {
    const input = setup();

    fireEvent.click(input);

    expect(input).not.toBeChecked();
  });
});
