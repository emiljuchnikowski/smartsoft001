import { fireEvent, render, screen } from '@testing-library/react';

import { CustomDateEdit, DateEditCustomExample } from './custom.example';

describe('docs-examples-react: DateEditCustomExample', () => {
  it('should render the custom editor built on the hook', () => {
    const { container } = render(<DateEditCustomExample />);

    expect(container.querySelector('.docs-date-edit__input')).not.toBeNull();
    expect(container.querySelector('input[type="number"]')).toBeNull();
  });

  it('should seed the editor with the value bound by the parent', () => {
    render(<DateEditCustomExample />);

    expect(screen.getByLabelText('Start date')).toHaveValue('2026-04-07');
  });

  it('should push a picked date back to the parent', () => {
    render(<DateEditCustomExample />);

    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2026-05-01' },
    });

    expect(screen.getByText('Selected: 2026-05-01')).toBeInTheDocument();
  });

  it('should report a cleared date as not valid', () => {
    const onValidChange = jest.fn();
    render(
      <CustomDateEdit
        defaultValue="2026-04-07"
        onValidChange={onValidChange}
      />,
    );
    const input = screen.getByLabelText('Start date');

    fireEvent.change(input, { target: { value: '' } });

    expect(onValidChange).toHaveBeenCalledWith(false);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
