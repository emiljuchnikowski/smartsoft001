import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SmartExport } from './export';
import { useExport } from './use-export';

describe('@smartsoft001/react: SmartExport', () => {
  it('should render a button', () => {
    render(<SmartExport handler={jest.fn()} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render the download icon hidden from assistive technology', () => {
    const { container } = render(<SmartExport handler={jest.fn()} />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should give the button a visually hidden accessible name', () => {
    render(<SmartExport handler={jest.fn()} value={{ data: 'test' }} />);

    expect(screen.getByRole('button', { name: 'Export' })).toContainElement(
      screen.getByText('Export'),
    );
  });

  it('should render the accessible name in an sr-only span', () => {
    render(<SmartExport handler={jest.fn()} />);

    expect(screen.getByText('Export')).toHaveClass('smart:sr-only');
  });

  it('should call handler with value on button click', () => {
    const handler = jest.fn();
    render(<SmartExport handler={handler} value={{ data: 'test' }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect(handler).toHaveBeenCalledWith({ data: 'test' }, undefined);
  });

  it('should pass fileName to the handler on button click', () => {
    const handler = jest.fn();
    render(
      <SmartExport
        handler={handler}
        value={{ data: 'test' }}
        fileName="report.csv"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));

    expect(handler).toHaveBeenCalledWith({ data: 'test' }, 'report.csv');
  });

  it('should disable the button when there is no value', () => {
    render(<SmartExport handler={jest.fn()} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should enable the button when there is a value', () => {
    render(<SmartExport handler={jest.fn()} value="data" />);

    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('should apply className to the rendered button', () => {
    render(<SmartExport handler={jest.fn()} className="my-export" />);

    expect(screen.getByRole('button')).toHaveClass('my-export');
  });

  it('should apply className to the wrapper around the button', () => {
    render(<SmartExport handler={jest.fn()} className="my-export" />);

    expect(screen.getByRole('button').parentElement).toHaveClass('my-export');
  });

  describe('useExport', () => {
    it('should call handler with value and fileName on onClick', async () => {
      const handler = jest.fn();
      const { result } = renderHook(() =>
        useExport({ handler, value: { data: 'test' }, fileName: 'a.json' }),
      );

      await result.current.onClick();

      expect(handler).toHaveBeenCalledWith({ data: 'test' }, 'a.json');
    });

    it('should not call handler on onClick when value is undefined', async () => {
      const handler = jest.fn();
      const { result } = renderHook(() => useExport({ handler }));

      await result.current.onClick();

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
