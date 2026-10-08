import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { useState } from 'react';

import { SmartAccordion } from './accordion';
import {
  SmartAccordionBaseProps,
  SmartAccordionProps,
} from './accordion.types';
import { SmartAccordionBody } from './body/accordion-body';
import { SmartAccordionHeader } from './header/accordion-header';
import { SmartAccordionPreset } from './preset/accordion-preset';
import { useAccordion } from './use-accordion';

function Host(props: Partial<SmartAccordionProps>) {
  const [show, setShow] = useState(false);

  return (
    <>
      <output data-testid="state">{String(show)}</output>
      <SmartAccordion
        show={show}
        onShowChange={setShow}
        accordionHeader={<div>Test Header</div>}
        accordionBody={<div>Test Body Content</div>}
        {...props}
      />
    </>
  );
}

describe('@smartsoft001/react: SmartAccordion', () => {
  describe('wrapper (default variation)', () => {
    it('should render the container with the border classes', () => {
      const { container } = render(<SmartAccordion className="extra" />);

      expect(container.firstElementChild).toHaveClass(
        'smart:rounded-lg',
        'smart:border',
        'smart:border-gray-200',
        'extra',
      );
    });

    it('should render the header content in the header button', () => {
      render(<SmartAccordion accordionHeader="Test Header" />);

      expect(
        screen.getByRole('button', { name: 'Test Header' }),
      ).toBeInTheDocument();
    });

    it('should hide the body when closed', () => {
      render(<SmartAccordion accordionBody="Test Body Content" />);

      expect(screen.queryByText('Test Body Content')).toBeNull();
    });

    it('should show the body when the header is clicked', () => {
      render(<SmartAccordion accordionBody="Test Body Content" />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Test Body Content')).toHaveClass('smart:px-4');
    });

    it('should hide the body again on a second click', () => {
      render(<SmartAccordion accordionBody="Test Body Content" />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByText('Test Body Content')).toBeNull();
    });

    it('should not toggle when disabled', () => {
      render(
        <SmartAccordion
          options={{ disabled: true }}
          accordionBody="Test Body Content"
        />,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByText('Test Body Content')).toBeNull();
    });

    it('should render the chevron icon', () => {
      const { container } = render(<SmartAccordion />);

      expect(container.querySelector('button svg')).toBeInTheDocument();
    });

    it('should update a two-way bound show on toggle', () => {
      render(<Host />);

      fireEvent.click(screen.getByRole('button', { name: 'Test Header' }));

      expect(screen.getByTestId('state')).toHaveTextContent('true');
      expect(screen.getByText('Test Body Content')).toBeInTheDocument();
    });

    it('should start open and sync a two-way bound show when options.open is true', () => {
      render(<Host options={{ open: true }} />);

      expect(screen.getByTestId('state')).toHaveTextContent('true');
      expect(screen.getByText('Test Body Content')).toBeInTheDocument();
    });

    it('should close on header click after starting open from options.open', () => {
      render(<Host options={{ open: true }} />);

      fireEvent.click(screen.getByRole('button', { name: 'Test Header' }));

      expect(screen.getByTestId('state')).toHaveTextContent('false');
      expect(screen.queryByText('Test Body Content')).toBeNull();
    });
  });

  describe('useAccordion', () => {
    it('should default show to false', () => {
      const { result } = renderHook(() => useAccordion({}));

      expect(result.current.show).toBe(false);
    });

    it('should toggle show from false to true', () => {
      const { result } = renderHook(() => useAccordion({}));

      act(() => result.current.toggle());

      expect(result.current.show).toBe(true);
    });

    it('should toggle show from true to false', () => {
      const { result } = renderHook(() => useAccordion({ defaultShow: true }));

      act(() => result.current.toggle());

      expect(result.current.show).toBe(false);
    });

    it('should not toggle when disabled', () => {
      const { result } = renderHook(() =>
        useAccordion({ options: { disabled: true } }),
      );

      act(() => result.current.toggle());

      expect(result.current.show).toBe(false);
    });

    it('should report the new state through onShowChange on toggle', () => {
      const onShowChange = jest.fn();
      const { result } = renderHook(() => useAccordion({ onShowChange }));

      act(() => result.current.toggle());

      expect(onShowChange).toHaveBeenCalledWith(true);
    });

    it('should follow the controlled show prop', () => {
      const { result, rerender } = renderHook(
        (props: { show: boolean }) => useAccordion(props),
        { initialProps: { show: false } },
      );

      rerender({ show: true });

      expect(result.current.show).toBe(true);
    });

    it('should not change a controlled show by itself on toggle', () => {
      const onShowChange = jest.fn();
      const { result } = renderHook(() =>
        useAccordion({ show: false, onShowChange }),
      );

      act(() => result.current.toggle());

      expect(result.current.show).toBe(false);
      expect(onShowChange).toHaveBeenCalledWith(true);
    });

    it('should return the shared container classes', () => {
      const { result } = renderHook(() => useAccordion({}));

      expect(result.current.sharedContainerClasses).toEqual([
        'smart:divide-y',
        'smart:divide-gray-200',
        'smart:rounded-lg',
        'smart:border',
        'smart:border-gray-200',
        'smart:dark:divide-white/10',
        'smart:dark:border-white/10',
      ]);
    });

    describe('options.open', () => {
      it('should start open when options.open is true on first render', () => {
        const { result } = renderHook(() =>
          useAccordion({ options: { open: true } }),
        );

        expect(result.current.show).toBe(true);
      });

      it('should report the initial open state through onShowChange once', () => {
        const onShowChange = jest.fn();
        renderHook(() =>
          useAccordion({ options: { open: true }, onShowChange }),
        );

        expect(onShowChange).toHaveBeenCalledTimes(1);
        expect(onShowChange).toHaveBeenCalledWith(true);
      });

      it('should ask a controlled closed accordion to open', () => {
        const onShowChange = jest.fn();
        renderHook(() =>
          useAccordion({ show: false, options: { open: true }, onShowChange }),
        );

        expect(onShowChange).toHaveBeenCalledWith(true);
      });

      it('should not report anything when show is already true', () => {
        const onShowChange = jest.fn();
        renderHook(() =>
          useAccordion({ show: true, options: { open: true }, onShowChange }),
        );

        expect(onShowChange).not.toHaveBeenCalled();
      });

      it('should not reopen after the user closes it', () => {
        const { result, rerender } = renderHook(() =>
          useAccordion({ options: { open: true } }),
        );

        act(() => result.current.toggle());
        rerender();

        expect(result.current.show).toBe(false);
      });

      it('should ignore options.open changing after the first render', () => {
        const { result, rerender } = renderHook(
          (props: { open: boolean }) =>
            useAccordion({ options: { open: props.open } }),
          { initialProps: { open: false } },
        );

        rerender({ open: true });

        expect(result.current.show).toBe(false);
      });
    });
  });

  describe('header', () => {
    it('should render a full-width button with the content', () => {
      render(<SmartAccordionHeader>Title</SmartAccordionHeader>);

      expect(screen.getByRole('button', { name: 'Title' })).toHaveClass(
        'smart:flex',
        'smart:w-full',
        'smart:font-medium',
      );
    });

    it('should show the chevron-down icon when not open', () => {
      const { container } = render(<SmartAccordionHeader open={false} />);

      expect(container.querySelector('svg path')?.getAttribute('d')).toContain(
        '5.22 8.22',
      );
    });

    it('should show the chevron-up icon when open', () => {
      const { container } = render(<SmartAccordionHeader open />);

      expect(container.querySelector('svg path')?.getAttribute('d')).toContain(
        '14.78 11.78',
      );
    });

    it('should style the icon', () => {
      const { container } = render(<SmartAccordionHeader />);

      expect(container.querySelector('svg')).toHaveClass(
        'smart:text-gray-400',
        'smart:transition-transform',
        'smart:duration-200',
      );
    });

    it('should be disabled with the disabled classes', () => {
      render(<SmartAccordionHeader disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        'smart:opacity-50',
        'smart:cursor-not-allowed',
      );
    });

    it('should append className', () => {
      render(<SmartAccordionHeader className="extra" />);

      expect(screen.getByRole('button')).toHaveClass('extra');
    });
  });

  describe('body', () => {
    it('should render the content with the body classes', () => {
      render(
        <SmartAccordionBody className="extra">Content</SmartAccordionBody>,
      );

      expect(screen.getByText('Content')).toHaveClass(
        'smart:px-4',
        'smart:py-3',
        'smart:text-gray-600',
        'extra',
      );
    });
  });

  describe('preset', () => {
    function PresetHost(props: Partial<SmartAccordionBaseProps>) {
      const [show, setShow] = useState(false);

      return (
        <>
          <output data-testid="state">{String(show)}</output>
          <SmartAccordionPreset
            show={show}
            onShowChange={setShow}
            headerTpl="Test Header"
            bodyTpl="Test Body Content"
            {...props}
          />
        </>
      );
    }

    function renderPreset(props: Partial<SmartAccordionBaseProps> = {}) {
      return render(
        <SmartAccordionPreset
          headerTpl="Test Header"
          bodyTpl="Test Body Content"
          {...props}
        />,
      );
    }

    it('should render the bordered card container, transparent while closed', () => {
      const { container } = renderPreset();

      expect(container.firstElementChild).toHaveClass(
        'smart:rounded-xl',
        'smart:border',
        'smart:bg-white',
        'smart:border-transparent',
      );
    });

    it('should show the container border while open', () => {
      const { container } = renderPreset({ defaultShow: true });

      expect(container.firstElementChild).toHaveClass('smart:border-gray-200');
    });

    it('should render the header content in the toggle button', () => {
      renderPreset();

      expect(
        screen.getByRole('button', { name: 'Test Header' }),
      ).toBeInTheDocument();
    });

    it('should hide the body when closed', () => {
      renderPreset();

      expect(screen.queryByRole('region')).toBeNull();
    });

    it('should show the body region when opened via click', () => {
      renderPreset();

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('region')).toHaveTextContent('Test Body Content');
    });

    it('should toggle the body on repeated clicks', () => {
      renderPreset();

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryByRole('region')).toBeNull();
    });

    it('should reflect the open state via aria-expanded', () => {
      renderPreset();
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should point aria-controls at the body region', () => {
      renderPreset({ defaultShow: true });

      const controls = screen.getByRole('button').getAttribute('aria-controls');
      expect(controls).toMatch(/^smart-accordion-preset-/);
      expect(screen.getByRole('region')).toHaveAttribute('id', controls);
    });

    it('should show the chevron-down icon when closed', () => {
      const { container } = renderPreset();

      expect(container.querySelector('button svg path')).toHaveAttribute(
        'd',
        'm6 9 6 6 6-6',
      );
    });

    it('should show the chevron-up icon when open', () => {
      const { container } = renderPreset({ defaultShow: true });

      expect(container.querySelector('button svg path')).toHaveAttribute(
        'd',
        'm18 15-6-6-6 6',
      );
    });

    it('should apply the active text colour when open', () => {
      renderPreset({ defaultShow: true });

      expect(screen.getByRole('button')).toHaveClass('smart:text-blue-600');
    });

    it('should be disabled and not toggle when options.disabled', () => {
      render(<PresetHost options={{ disabled: true }} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(button).toBeDisabled();
      expect(screen.queryByRole('region')).toBeNull();
      expect(screen.getByTestId('state')).toHaveTextContent('false');
    });

    it('should append className to the container', () => {
      const { container } = renderPreset({ className: 'my-custom-class' });

      expect(container.firstElementChild).toHaveClass('my-custom-class');
    });

    it('should update a two-way bound show on toggle', () => {
      render(<PresetHost />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByTestId('state')).toHaveTextContent('true');
    });

    it('should start open and sync a two-way bound show when options.open is true', () => {
      render(<PresetHost options={{ open: true }} />);

      expect(screen.getByTestId('state')).toHaveTextContent('true');
      expect(screen.getByRole('region')).toHaveTextContent('Test Body Content');
    });
  });
});
