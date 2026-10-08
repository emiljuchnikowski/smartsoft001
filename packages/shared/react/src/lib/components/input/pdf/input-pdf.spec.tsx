import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputPdf } from './input-pdf';
import { SmartInputPdfPreset } from './preset/input-pdf-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class PdfModel {
  @Field({ type: FieldType.pdf })
  value: unknown = null;
}

const attachment = { id: '1', fileName: 'doc.pdf' };

const variants = [
  ['standard', SmartInputPdf],
  ['preset', SmartInputPdfPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(null),
    className,
  }: { control?: SmartFormControl; className?: string } = {},
) {
  const fileService = new FileService(
    { apiUrl: '/api' },
    new SmartHttpClient(),
  );

  new SmartFormGroup({ value: control });

  const view = render(
    <SmartProvider
      language="eng"
      translations={{ MODEL: { value: 'Document' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new PdfModel(),
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.pdf }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, fileService, ...view };
}

/**
 * jsdom only takes a real `FileList` for `input.files`, which tests cannot
 * build; let the drop hand the test's array over as a browser would.
 */
function allowFilesAssignment(input: HTMLElement) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    writable: true,
    value: null,
  });
}

function dropZone() {
  return screen.getByText('Drop file here or').closest('[role="button"]');
}

describe('@smartsoft001/react: SmartInputPdf', () => {
  it.each(variants)(
    '%s: should label the hidden pdf file input',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Document');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', '.pdf');
      expect(input).toHaveAttribute('hidden');
    },
  );

  it.each(variants)(
    '%s: should show the required asterisk for a required control',
    (_name, Input) => {
      const { container } = setup(Input, {
        control: new SmartFormControl(null, SmartValidators.required),
      });

      expect(container.querySelector('label span')).toHaveTextContent('*');
    },
  );

  it.each(variants)(
    '%s: should render show, delete and the file name with a value',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl(attachment) });

      expect(screen.getByRole('button', { name: 'show' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
      expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should not render show and delete without a value',
    (_name, Input) => {
      setup(Input);

      expect(
        screen.queryByRole('button', { name: 'show' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'delete' }),
      ).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should upload the picked pdf and set the attachment as the value',
    async (_name, Input) => {
      const { control, fileService } = setup(Input);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue(attachment);
      const file = new File(['x'], 'doc.pdf');

      fireEvent.change(screen.getByLabelText('Document'), {
        target: { files: [file] },
      });

      await waitFor(() => expect(control.value).toEqual(attachment));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
    },
  );

  it.each(variants)(
    '%s: should reject a file that is not a pdf',
    async (_name, Input) => {
      const { fileService } = setup(Input);
      const upload = jest.spyOn(fileService, 'upload');

      fireEvent.change(screen.getByLabelText('Document'), {
        target: { files: [new File(['x'], 'image.png')] },
      });

      expect(
        await screen.findByText('Invalid file type (.pdf)'),
      ).toBeInTheDocument();
      expect(upload).not.toHaveBeenCalled();
    },
  );

  it.each(variants)(
    '%s: should open the attachment on show',
    (_name, Input) => {
      const { fileService } = setup(Input, {
        control: new SmartFormControl(attachment),
      });
      const download = jest
        .spyOn(fileService, 'download')
        .mockImplementation(() => undefined);

      fireEvent.click(screen.getByRole('button', { name: 'show' }));

      expect(download).toHaveBeenCalledWith('1');
    },
  );

  it.each(variants)(
    '%s: should clear the value once the delete is confirmed',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl(attachment),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(control.value).toBeNull();
      expect(screen.queryByText('doc.pdf')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should append className to the group classes',
    (_name, Input) => {
      const { container } = setup(Input, { className: 'extra-user-class' });

      expect(container.querySelector('label + div')).toHaveClass(
        'extra-user-class',
        'smart:mt-2',
        'smart:flex',
      );
    },
  );

  it.each(variants)(
    '%s: should render nothing without a control',
    (_name, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  describe('standard', () => {
    it('should render the add button without a value and change with one', () => {
      const control = new SmartFormControl<unknown>(null);
      setup(SmartInputPdf, { control });

      expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();

      act(() => control.setValue(attachment));

      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
    });

    it('should mark the control and open the file picker on add', () => {
      const { control } = setup(SmartInputPdf);
      const click = jest.spyOn(screen.getByLabelText('Document'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should render the indigo progress of the upload', async () => {
      const { container, fileService } = setup(SmartInputPdf);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(30);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Document'), {
          target: { files: [new File(['x'], 'doc.pdf')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:h-full.smart\\:bg-indigo-600',
      ) as HTMLElement;

      expect(bar.parentElement).toHaveClass('smart:w-24');
      expect(bar.style.width).toBe('30%');
    });
  });

  describe('preset', () => {
    it('should mark the label with data-role', () => {
      const { container } = setup(SmartInputPdfPreset);

      expect(container.querySelector('label')).toHaveAttribute(
        'data-role',
        'label',
      );
    });

    it('should render the drop zone with the drop / browse texts', () => {
      setup(SmartInputPdfPreset);

      const zone = dropZone();

      expect(zone).toHaveAttribute('tabindex', '0');
      expect(zone).toHaveClass('smart:p-8', 'smart:border-dashed');
      expect(zone).toHaveTextContent('Drop file here or');
      expect(zone).toHaveTextContent('browse');
    });

    it('should mark the control and open the file picker on a click of the drop zone', () => {
      const { control } = setup(SmartInputPdfPreset);
      const click = jest.spyOn(screen.getByLabelText('Document'), 'click');

      fireEvent.click(dropZone() as HTMLElement);

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should open the file picker on Enter', () => {
      setup(SmartInputPdfPreset);
      const click = jest.spyOn(screen.getByLabelText('Document'), 'click');

      fireEvent.keyDown(dropZone() as HTMLElement, { key: 'Enter' });

      expect(click).toHaveBeenCalled();
    });

    it('should open the file picker on Space and prevent scrolling', () => {
      setup(SmartInputPdfPreset);
      const click = jest.spyOn(screen.getByLabelText('Document'), 'click');

      const notPrevented = fireEvent.keyDown(dropZone() as HTMLElement, {
        key: ' ',
      });

      expect(click).toHaveBeenCalled();
      expect(notPrevented).toBe(false);
    });

    it('should not open the file picker on other keys', () => {
      setup(SmartInputPdfPreset);
      const click = jest.spyOn(screen.getByLabelText('Document'), 'click');

      fireEvent.keyDown(dropZone() as HTMLElement, { key: 'a' });

      expect(click).not.toHaveBeenCalled();
    });

    it('should highlight the drop zone while a file is dragged over it', () => {
      setup(SmartInputPdfPreset);
      const zone = dropZone() as HTMLElement;

      fireEvent.dragOver(zone);

      expect(zone).toHaveClass('smart:border-blue-600', 'smart:bg-blue-50');
      expect(zone).not.toHaveClass('smart:border-gray-300');

      fireEvent.dragLeave(zone);

      expect(zone).toHaveClass('smart:border-gray-300');
      expect(zone).not.toHaveClass('smart:border-blue-600');
    });

    it('should upload a dropped file', async () => {
      const { control, fileService } = setup(SmartInputPdfPreset);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue(attachment);
      const file = new File(['x'], 'doc.pdf');
      const zone = dropZone() as HTMLElement;

      allowFilesAssignment(screen.getByLabelText('Document'));
      fireEvent.dragOver(zone);
      fireEvent.drop(zone, { dataTransfer: { files: [file] } });

      await waitFor(() => expect(control.value).toEqual(attachment));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(zone).not.toHaveClass('smart:border-blue-600');
    });

    it('should ignore a drop without files', () => {
      const { control, fileService } = setup(SmartInputPdfPreset);
      const upload = jest.spyOn(fileService, 'upload');

      fireEvent.drop(dropZone() as HTMLElement, {
        dataTransfer: { files: [] },
      });

      expect(upload).not.toHaveBeenCalled();
      expect(control.dirty).toBe(false);
    });

    it('should render the preview card with a value', () => {
      setup(SmartInputPdfPreset, {
        control: new SmartFormControl(attachment),
      });

      expect(screen.getByText('doc.pdf').parentElement).toHaveClass(
        'smart:p-3',
        'smart:rounded-xl',
        'smart:justify-between',
      );
    });

    it('should disable the drop zone and render the progress while uploading', async () => {
      const { container, fileService } = setup(SmartInputPdfPreset);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(60);

          return new Promise(() => undefined);
        });

      expect(dropZone()).not.toHaveAttribute('aria-disabled');

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Document'), {
          target: { files: [new File(['x'], 'doc.pdf')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:transition-all',
      ) as HTMLElement;

      expect(dropZone()).toHaveAttribute('aria-disabled', 'true');
      expect(bar.parentElement).toHaveClass('smart:h-2', 'smart:rounded-full');
      expect(bar.style.width).toBe('60%');
    });
  });
});
