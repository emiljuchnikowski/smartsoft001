import { fireEvent, render, screen } from '@testing-library/react';

import { CustomToggle, ToggleCustomExample } from './custom.example';

describe('docs-examples-react: ToggleCustomExample', () => {
  it('should render the custom toggle instead of the standard one', () => {
    // Act
    const { container } = render(<ToggleCustomExample />);

    // Assert
    expect(container.querySelector('.docs-toggle')).toHaveClass(
      'docs-toggle--label-right',
    );
    expect(container.querySelector('.smart-toggle')).toBeNull();
  });

  it('should render the label and the description from the options', () => {
    // Act
    const { container } = render(<ToggleCustomExample />);

    // Assert
    expect(container.querySelector('.docs-toggle__label')).toHaveTextContent(
      'Allow notifications',
    );
    expect(
      container.querySelector('.docs-toggle__description'),
    ).toHaveTextContent('Send me an email');
    expect(screen.getByText('Notifications are off.')).toBeInTheDocument();
  });

  it('should flip the value kept by the implementation and show it', () => {
    // Arrange
    render(<ToggleCustomExample />);
    const input = screen.getByRole('checkbox', { name: 'Allow notifications' });

    // Act
    fireEvent.click(input);

    // Assert
    expect(input).toBeChecked();
    expect(screen.getByText('Notifications are on.')).toBeInTheDocument();
  });

  it('should report the new value through onValueChange', () => {
    // Arrange
    const onValueChange = jest.fn();
    render(
      <CustomToggle
        value={false}
        options={{ label: 'Dark mode' }}
        onValueChange={onValueChange}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole('checkbox', { name: 'Dark mode' }));

    // Assert
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
