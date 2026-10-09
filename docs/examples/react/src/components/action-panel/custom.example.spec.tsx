import { fireEvent, render, screen } from '@testing-library/react';

import { SmartActionPanel, SmartProvider } from '@smartsoft001/react';

import { ActionPanelCustomExample, CustomActionPanel } from './custom.example';

describe('docs-examples-react: ActionPanelCustomExample', () => {
  it('should render the custom action panel instead of the standard one', () => {
    const { container } = render(<ActionPanelCustomExample />);

    const panel = container.querySelector('.docs-action-panel');
    expect(panel).not.toBeNull();
    expect(panel).toHaveTextContent('Transfer ownership');
    expect(container.querySelector('section.action-panel')).toBeNull();
  });

  it('should call onActionClick with the action id when an action is clicked', () => {
    const onActionClick = jest.fn();
    render(
      <SmartProvider components={{ 'action-panel': CustomActionPanel }}>
        <SmartActionPanel
          options={{ actions: [{ id: 'transfer', label: 'Transfer' }] }}
          onActionClick={onActionClick}
        />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Transfer' }));

    expect(onActionClick).toHaveBeenCalledWith({ actionId: 'transfer' });
  });
});
