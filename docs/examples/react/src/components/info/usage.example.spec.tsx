import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { InfoUsageExample } from './usage.example';

describe('docs-examples-react: InfoUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <InfoUsageExample />
      </SmartProvider>,
    );
  }

  it('should keep the hint hidden until the trigger is clicked', () => {
    setup();

    expect(screen.queryByTestId('info-popover')).toBeNull();
  });

  it('should show the text from the options when the trigger is clicked', () => {
    setup();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('info-popover')).toHaveTextContent(
      'We only use your email to send order updates.',
    );
  });

  it('should hide the text again on a click outside', () => {
    setup();
    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(document.body);

    expect(screen.queryByTestId('info-popover')).toBeNull();
  });
});
