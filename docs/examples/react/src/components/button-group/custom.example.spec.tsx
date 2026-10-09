import { fireEvent, render, screen } from '@testing-library/react';

import { SmartButtonGroup, SmartProvider } from '@smartsoft001/react';

import { ButtonGroupCustomExample, CustomButtonGroup } from './custom.example';

describe('docs-examples-react: ButtonGroupCustomExample', () => {
  it('should render the custom button group with the pre-selected button', () => {
    const { container } = render(<ButtonGroupCustomExample />);

    const buttons = container.querySelectorAll('.docs-button-group__button');
    expect(container.querySelector('.docs-button-group')).not.toBeNull();
    expect(buttons).toHaveLength(3);
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('.smart-button-group-label')).toBeNull();
  });

  it('should select the clicked button and call onButtonClick', () => {
    const onButtonClick = jest.fn();
    render(
      <SmartProvider components={{ 'button-group': CustomButtonGroup }}>
        <SmartButtonGroup
          buttons={[
            { id: 'month', label: 'Month' },
            { id: 'date', label: 'Date' },
          ]}
          defaultSelected="month"
          onButtonClick={onButtonClick}
        />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Date' }));

    expect(onButtonClick).toHaveBeenCalledWith({ buttonId: 'date' });
    expect(screen.getByRole('button', { name: 'Date' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
