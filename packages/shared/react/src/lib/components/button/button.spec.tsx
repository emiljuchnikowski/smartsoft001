import { fireEvent, render, screen } from '@testing-library/react';

import { SmartButton } from './button';
import { SmartButtonProps } from './button.types';
import { SmartButtonPreset } from './preset/button-preset';
import { SmartButtonStandard } from './standard/button-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartButton', () => {
  it('should render the standard implementation by default', () => {
    render(<SmartButton options={{ click: jest.fn() }}>Save</SmartButton>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'smart:bg-indigo-600',
    );
  });

  it('should call click', () => {
    const click = jest.fn();
    render(<SmartButton options={{ click }}>Save</SmartButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('should render the implementation registered as components.button', () => {
    const Custom = ({ children }: SmartButtonProps) => (
      <span data-testid="custom">{children}</span>
    );

    render(
      <SmartProvider components={{ button: Custom }}>
        <SmartButton options={{ click: jest.fn() }}>Save</SmartButton>
      </SmartProvider>,
    );

    expect(screen.getByTestId('custom')).toHaveTextContent('Save');
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should not click before the confirmation', (_name, Button) => {
    const click = jest.fn();
    render(<Button options={{ click, confirm: true }}>Delete</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(click).not.toHaveBeenCalled();
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should show the translated confirm button', (_name, Button) => {
    render(
      <Button options={{ click: jest.fn(), confirm: true }}>Delete</Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      screen.getByRole('button', { name: 'potwierdź' }),
    ).toBeInTheDocument();
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should click once confirmed', (_name, Button) => {
    const click = jest.fn();
    render(
      <SmartProvider language="eng">
        <Button options={{ click, confirm: true }}>Delete</Button>
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

    expect(click).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should go back to the button on cancel', (_name, Button) => {
    const click = jest.fn();
    render(
      <SmartProvider language="eng">
        <Button options={{ click, confirm: true }}>Delete</Button>
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should not click on cancel', (_name, Button) => {
    const click = jest.fn();
    render(
      <SmartProvider language="eng">
        <Button options={{ click, confirm: true }}>Delete</Button>
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));

    expect(click).not.toHaveBeenCalled();
  });

  it.each([
    ['standard', SmartButtonStandard],
    ['preset', SmartButtonPreset],
  ])('%s: should be disabled while loading', (_name, Button) => {
    render(<Button options={{ click: jest.fn(), loading: true }}>Save</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply the size classes', () => {
    render(
      <SmartButtonStandard options={{ click: jest.fn(), size: 'xs' }}>
        Save
      </SmartButtonStandard>,
    );

    expect(screen.getByRole('button')).toHaveClass('smart:text-xs');
  });

  it('should map the secondary variant to the outline preset', () => {
    render(
      <SmartButtonPreset options={{ click: jest.fn(), variant: 'secondary' }}>
        Save
      </SmartButtonPreset>,
    );

    expect(screen.getByRole('button')).not.toHaveClass('smart:bg-indigo-600');
  });
});
