import { fireEvent, render, screen } from '@testing-library/react';

import { SmartDrawer } from './drawer';
import { SmartDrawerProps } from './drawer.types';
import { SmartDrawerPreset } from './preset/drawer-preset';
import { SmartDrawerStandard } from './standard/drawer-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartDrawer', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(
        <SmartDrawer open title="Drawer Title">
          Body
        </SmartDrawer>,
      );

      expect(
        screen.getByRole('dialog', { name: 'Drawer Title' }),
      ).toHaveAttribute('data-position', 'right');
    });

    it('should pass the callbacks to the implementation', () => {
      const onOpenChange = jest.fn();
      const onClosed = jest.fn();
      render(
        <SmartDrawer
          open
          title="Drawer Title"
          onOpenChange={onOpenChange}
          onClosed={onClosed}
        >
          Body
        </SmartDrawer>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onClosed).toHaveBeenCalledTimes(1);
    });

    it('should render the implementation registered as components.drawer', () => {
      const Custom = ({ title, open }: SmartDrawerProps) => (
        <div data-testid="custom">{open ? title : 'closed'}</div>
      );

      render(
        <SmartProvider components={{ drawer: Custom }}>
          <SmartDrawer open title="Drawer Title" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Drawer Title');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('standard', () => {
    it('should not render the aside when closed', () => {
      render(<SmartDrawerStandard>Body</SmartDrawerStandard>);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render a modal dialog aside when open', () => {
      render(<SmartDrawerStandard open>Body</SmartDrawerStandard>);

      const aside = screen.getByRole('dialog');

      expect(aside.tagName).toBe('ASIDE');
      expect(aside).toHaveAttribute('aria-modal', 'true');
    });

    it('should open from defaultOpen when uncontrolled', () => {
      render(<SmartDrawerStandard defaultOpen>Body</SmartDrawerStandard>);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should default data-position to right', () => {
      render(<SmartDrawerStandard open>Body</SmartDrawerStandard>);

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-position',
        'right',
      );
    });

    it('should reflect options.position in data-position', () => {
      render(
        <SmartDrawerStandard open options={{ position: 'left' }}>
          Body
        </SmartDrawerStandard>,
      );

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-position',
        'left',
      );
    });

    it('should apply className on the aside', () => {
      render(
        <SmartDrawerStandard open className="my-extra-class">
          Body
        </SmartDrawerStandard>,
      );

      expect(screen.getByRole('dialog')).toHaveClass('my-extra-class');
    });

    it('should render children inside the aside', () => {
      render(
        <SmartDrawerStandard open>
          <span data-testid="projected">x</span>
        </SmartDrawerStandard>,
      );

      expect(screen.getByRole('dialog')).toContainElement(
        screen.getByTestId('projected'),
      );
    });

    it('should not render a header without a title', () => {
      const { container } = render(
        <SmartDrawerStandard open>Body</SmartDrawerStandard>,
      );

      expect(container.querySelector('header')).toBeNull();
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('should label the aside with the title heading', () => {
      render(
        <SmartDrawerStandard open title="My Drawer">
          Body
        </SmartDrawerStandard>,
      );

      expect(screen.getByRole('dialog', { name: 'My Drawer' })).toHaveAttribute(
        'aria-labelledby',
        'smart-drawer-title',
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
        'id',
        'smart-drawer-title',
      );
    });

    it('should render the close button with the title', () => {
      render(
        <SmartDrawerStandard open title="My Drawer">
          Body
        </SmartDrawerStandard>,
      );

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should not render the overlay by default', () => {
      const { container } = render(
        <SmartDrawerStandard open>Body</SmartDrawerStandard>,
      );

      expect(container.querySelector('.drawer-overlay')).toBeNull();
    });

    it('should render the overlay when options.withOverlay is true', () => {
      const { container } = render(
        <SmartDrawerStandard open options={{ withOverlay: true }}>
          Body
        </SmartDrawerStandard>,
      );

      expect(container.querySelector('.drawer-overlay')).toBeInTheDocument();
    });

    it('should call onOpenChange(false) when the close button is clicked', () => {
      const onOpenChange = jest.fn();
      render(
        <SmartDrawerStandard open title="My Drawer" onOpenChange={onOpenChange}>
          Body
        </SmartDrawerStandard>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onClosed once when the close button is clicked', () => {
      const onClosed = jest.fn();
      render(
        <SmartDrawerStandard open title="My Drawer" onClosed={onClosed}>
          Body
        </SmartDrawerStandard>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClosed).toHaveBeenCalledTimes(1);
    });

    it('should hide itself on close when uncontrolled', () => {
      render(
        <SmartDrawerStandard defaultOpen title="My Drawer">
          Body
        </SmartDrawerStandard>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should stay open on close until the controlled open prop changes', () => {
      render(
        <SmartDrawerStandard open title="My Drawer" onOpenChange={jest.fn()}>
          Body
        </SmartDrawerStandard>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close on overlay click', () => {
      const onOpenChange = jest.fn();
      const onClosed = jest.fn();
      const { container } = render(
        <SmartDrawerStandard
          open
          options={{ withOverlay: true }}
          onOpenChange={onOpenChange}
          onClosed={onClosed}
        >
          Body
        </SmartDrawerStandard>,
      );

      fireEvent.click(container.querySelector('.drawer-overlay') as Element);

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onClosed).toHaveBeenCalledTimes(1);
    });
  });

  describe('preset', () => {
    const backdrop = (container: HTMLElement) =>
      container.querySelector('div[aria-hidden="true"]');

    it('should not render the panel when closed', () => {
      render(
        <SmartDrawerPreset title="Offcanvas title">Body</SmartDrawerPreset>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render the panel labelled by the title when open', () => {
      render(
        <SmartDrawerPreset open title="Offcanvas title">
          Body
        </SmartDrawerPreset>,
      );

      expect(
        screen.getByRole('dialog', { name: 'Offcanvas title' }),
      ).toHaveAttribute('aria-labelledby', 'smart-drawer-preset-title');
    });

    it('should render a focusable modal panel', () => {
      render(<SmartDrawerPreset open>Body</SmartDrawerPreset>);

      const panel = screen.getByRole('dialog');

      expect(panel).toHaveAttribute('aria-modal', 'true');
      expect(panel).toHaveAttribute('tabindex', '-1');
      expect(panel).not.toHaveAttribute('aria-labelledby');
    });

    it('should default to the right placement', () => {
      render(<SmartDrawerPreset open>Body</SmartDrawerPreset>);

      const panel = screen.getByRole('dialog');

      expect(panel).toHaveAttribute('data-position', 'right');
      expect(panel).toHaveClass('smart:end-0', 'smart:max-w-xs');
    });

    it('should place the panel on the left when options.position is left', () => {
      render(
        <SmartDrawerPreset open options={{ position: 'left' }}>
          Body
        </SmartDrawerPreset>,
      );

      const panel = screen.getByRole('dialog');

      expect(panel).toHaveAttribute('data-position', 'left');
      expect(panel).toHaveClass('smart:start-0');
    });

    it('should widen the panel when options.wide is true', () => {
      render(
        <SmartDrawerPreset open options={{ wide: true }}>
          Body
        </SmartDrawerPreset>,
      );

      const panel = screen.getByRole('dialog');

      expect(panel).toHaveClass('smart:max-w-md');
      expect(panel).not.toHaveClass('smart:max-w-xs');
    });

    it('should not render a backdrop by default', () => {
      const { container } = render(
        <SmartDrawerPreset open>Body</SmartDrawerPreset>,
      );

      expect(backdrop(container)).toBeNull();
    });

    it('should render a backdrop when options.withOverlay is true', () => {
      const { container } = render(
        <SmartDrawerPreset open options={{ withOverlay: true }}>
          Body
        </SmartDrawerPreset>,
      );

      expect(backdrop(container)).toHaveClass('smart:bg-gray-900/50');
    });

    it('should apply branded header classes when options.brandedHeader is true', () => {
      render(
        <SmartDrawerPreset open options={{ brandedHeader: true }}>
          Body
        </SmartDrawerPreset>,
      );

      expect(screen.getByRole('dialog').querySelector('div')).toHaveClass(
        'smart:bg-blue-600',
      );
    });

    it('should render children in the body', () => {
      render(
        <SmartDrawerPreset open>
          <span data-testid="projected">x</span>
        </SmartDrawerPreset>,
      );

      expect(screen.getByTestId('projected').parentElement).toHaveClass(
        'smart:p-4',
      );
    });

    it('should close and call onClosed when the close button is clicked', () => {
      const onClosed = jest.fn();
      render(
        <SmartDrawerPreset
          defaultOpen
          title="Offcanvas title"
          onClosed={onClosed}
        >
          Body
        </SmartDrawerPreset>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call onOpenChange(false) when the backdrop is clicked', () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartDrawerPreset
          open
          options={{ withOverlay: true }}
          onOpenChange={onOpenChange}
        >
          Body
        </SmartDrawerPreset>,
      );

      fireEvent.click(backdrop(container) as Element);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should apply className on the panel', () => {
      render(
        <SmartDrawerPreset open className="my-extra-class">
          Body
        </SmartDrawerPreset>,
      );

      expect(screen.getByRole('dialog')).toHaveClass(
        'my-extra-class',
        'smart:fixed',
      );
    });
  });
});
