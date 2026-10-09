import { fireEvent, render, screen } from '@testing-library/react';

import { CustomToggle, ToggleCustomExample } from './custom.example';

describe('docs-examples-react: ToggleCustomExample', () => {
  it('should render the custom toggle instead of the standard one', () => {
    const { container } = render(<ToggleCustomExample />);

    expect(container.querySelector('.docs-toggle')).toHaveClass(
      'docs-toggle--label-right',
    );
    expect(container.querySelector('.smart-toggle')).toBeNull();
  });

  it('should render the label and the description from the options', () => {
    const { container } = render(<ToggleCustomExample />);

    expect(container.querySelector('.docs-toggle__label')).toHaveTextContent(
      'Allow notifications',
    );
    expect(
      container.querySelector('.docs-toggle__description'),
    ).toHaveTextContent('Send me an email');
  });

  it('should flip the value kept by the implementation when clicked', () => {
    render(<ToggleCustomExample />);
    const input = screen.getByRole('checkbox', { name: 'Allow notifications' });

    fireEvent.click(input);

    expect(input).toBeChecked();
  });

  it('should report the new value through onValueChange', () => {
    const onValueChange = jest.fn();
    render(
      <CustomToggle
        value={false}
        options={{ label: 'Dark mode' }}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Dark mode' }));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
