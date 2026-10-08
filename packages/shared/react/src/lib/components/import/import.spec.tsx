import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SmartImport } from './import';
import { useImport } from './use-import';

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

function inputWithFiles(files: File[]): HTMLInputElement {
  const inputEl = document.createElement('input');
  inputEl.type = 'file';
  Object.defineProperty(inputEl, 'files', { value: files });

  return inputEl;
}

describe('@smartsoft001/react: SmartImport', () => {
  it('should render a button', () => {
    render(<SmartImport />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render the upload icon inside the button', () => {
    render(<SmartImport />);

    expect(screen.getByRole('button').querySelector('svg')).not.toBeNull();
  });

  it('should render a hidden file input', () => {
    const { container } = render(<SmartImport />);

    expect(fileInput(container)).not.toBeVisible();
  });

  it('should accept application/json by default', () => {
    const { container } = render(<SmartImport />);

    expect(fileInput(container)).toHaveAttribute('accept', 'application/json');
  });

  it('should pass accept to the file input', () => {
    const { container } = render(<SmartImport accept="text/csv" />);

    expect(fileInput(container)).toHaveAttribute('accept', 'text/csv');
  });

  it('should open the file picker on button click', () => {
    const { container } = render(<SmartImport />);
    const clickSpy = jest.spyOn(fileInput(container), 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should call onSet with the selected file', () => {
    const onSet = jest.fn();
    const { container } = render(<SmartImport onSet={onSet} />);
    const file = new File(['content'], 'test.json', {
      type: 'application/json',
    });
    const input = fileInput(container);
    Object.defineProperty(input, 'files', { value: [file] });

    fireEvent.change(input);

    expect(onSet).toHaveBeenCalledWith(file);
  });

  it('should apply className to the rendered button', () => {
    render(<SmartImport className="my-import" />);

    expect(screen.getByRole('button')).toHaveClass('my-import');
  });

  describe('useImport', () => {
    it('should call onSet with the file of the event', () => {
      const onSet = jest.fn();
      const file = new File(['content'], 'test.json');
      const { result } = renderHook(() => useImport({ onSet }));

      result.current.onFileSelected({ target: inputWithFiles([file]) });

      expect(onSet).toHaveBeenCalledWith(file);
    });

    it('should reset the input value after a file selection', () => {
      const inputEl = inputWithFiles([new File(['content'], 'test.json')]);
      const valueSpy = jest.spyOn(inputEl, 'value', 'set');
      const { result } = renderHook(() => useImport({}));

      result.current.onFileSelected({ target: inputEl });

      expect(valueSpy).toHaveBeenCalledWith('');
    });

    it('should throw when no file is selected', () => {
      const { result } = renderHook(() => useImport({}));

      expect(() =>
        result.current.onFileSelected({ target: inputWithFiles([]) }),
      ).toThrow('ImportBaseComponent: File not found');
    });

    it('should click the given input on triggerFileInput', () => {
      const inputEl = document.createElement('input');
      const clickSpy = jest.spyOn(inputEl, 'click');
      const { result } = renderHook(() => useImport({}));

      result.current.triggerFileInput(inputEl);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
