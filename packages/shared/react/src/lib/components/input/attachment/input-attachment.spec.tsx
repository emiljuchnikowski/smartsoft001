import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputAttachment } from './input-attachment';
import { SmartInputAttachmentPreset } from './preset/input-attachment-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class AttachmentModel {
  @Field({ type: FieldType.attachment })
  value: unknown = null;
}

const attachment = { id: '1', fileName: 'report.docx' };

const variants = [
  ['standard', SmartInputAttachment],
  ['preset', SmartInputAttachmentPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(null),
    fieldOptions = { type: FieldType.attachment },
    className,
  }: {
    control?: SmartFormControl;
    fieldOptions?: IFieldOptions;
    className?: string;
  } = {},
) {
  const fileService = new FileService(
    { apiUrl: '/api' },
    new SmartHttpClient(),
  );

  new SmartFormGroup({ value: control });

  const view = render(
    <SmartProvider
      language="eng"
      translations={{ MODEL: { value: 'Attachment' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new AttachmentModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
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
  return screen
    .getByText('Drop file here or')
    .closest('[role="button"]') as HTMLElement;
}

describe('@smartsoft001/react: SmartInputAttachment', () => {
  it.each(variants)(
    '%s: should label the hidden file input',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Attachment');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('hidden');
    },
  );

  it.each(variants)(
    '%s: should set accept on the file input from fieldOptions.possibilities',
    (_name, Input) => {
      setup(Input, {
        fieldOptions: { type: FieldType.attachment, possibilities: '.docx' },
      });

      expect(screen.getByLabelText('Attachment')).toHaveAttribute(
        'accept',
        '.docx',
      );
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
    '%s: should render download, delete and the file name with a value',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl(attachment) });

      expect(
        screen.getByRole('button', { name: 'download' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
      expect(screen.getByText('report.docx')).toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should not render download and delete without a value',
    (_name, Input) => {
      setup(Input);

      expect(
        screen.queryByRole('button', { name: 'download' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'delete' }),
      ).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should upload the picked file and set the attachment as the value',
    async (_name, Input) => {
      const { control, fileService } = setup(Input);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue(attachment);
      const file = new File(['x'], 'report.docx');

      fireEvent.change(screen.getByLabelText('Attachment'), {
        target: { files: [file] },
      });

      await waitFor(() => expect(control.value).toEqual(attachment));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
    },
  );

  it.each(variants)(
    '%s: should report a failed upload',
    async (_name, Input) => {
      const { control, fileService } = setup(Input);
      jest.spyOn(fileService, 'upload').mockRejectedValue(new Error('500'));

      fireEvent.change(screen.getByLabelText('Attachment'), {
        target: { files: [new File(['x'], 'report.docx')] },
      });

      expect(await screen.findByText('Error')).toBeInTheDocument();
      expect(control.value).toBeNull();
    },
  );

  it.each(variants)('%s: should download the attachment', (_name, Input) => {
    const { fileService } = setup(Input, {
      control: new SmartFormControl(attachment),
    });
    const download = jest
      .spyOn(fileService, 'download')
      .mockImplementation(() => undefined);

    fireEvent.click(screen.getByRole('button', { name: 'download' }));

    expect(download).toHaveBeenCalledWith('1');
  });

  it.each(variants)(
    '%s: should clear the value once the delete is confirmed',
    (_name, Input) => {
      const { control } = setup(Input, {
        control: new SmartFormControl(attachment),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(control.value).toBeNull();
      expect(screen.queryByText('report.docx')).not.toBeInTheDocument();
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
      setup(SmartInputAttachment, { control });

      expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();

      act(() => control.setValue(attachment));

      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
    });

    it('should mark the control and open the file picker on add', () => {
      const { control } = setup(SmartInputAttachment);
      const click = jest.spyOn(screen.getByLabelText('Attachment'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should render the indigo progress of the upload', async () => {
      const { container, fileService } = setup(SmartInputAttachment);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(25);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Attachment'), {
          target: { files: [new File(['x'], 'report.docx')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:h-full.smart\\:bg-indigo-600',
      ) as HTMLElement;

      expect(bar.parentElement).toHaveClass('smart:w-24');
      expect(bar.style.width).toBe('25%');
    });
  });

  describe('preset', () => {
    it('should render the drop zone with the drop / browse texts', () => {
      setup(SmartInputAttachmentPreset);

      const zone = dropZone();

      expect(zone).toHaveAttribute('tabindex', '0');
      expect(zone).toHaveClass('smart:p-12', 'smart:border-dashed');
      expect(zone).toHaveTextContent('Drop file here or');
      expect(zone).toHaveTextContent('browse');
    });

    it('should mark the control and open the file picker on a click of the drop zone', () => {
      const { control } = setup(SmartInputAttachmentPreset);
      const click = jest.spyOn(screen.getByLabelText('Attachment'), 'click');

      fireEvent.click(dropZone());

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
    });

    it('should open the file picker on Enter and Space', () => {
      setup(SmartInputAttachmentPreset);
      const click = jest.spyOn(screen.getByLabelText('Attachment'), 'click');

      fireEvent.keyDown(dropZone(), { key: 'Enter' });
      fireEvent.keyDown(dropZone(), { key: ' ' });

      expect(click).toHaveBeenCalledTimes(2);
    });

    it('should highlight the drop zone while a file is dragged over it', () => {
      setup(SmartInputAttachmentPreset);

      fireEvent.dragOver(dropZone());

      expect(dropZone()).toHaveClass('smart:border-blue-600');

      fireEvent.dragLeave(dropZone());

      expect(dropZone()).toHaveClass('smart:border-gray-300');
    });

    it('should upload a dropped file', async () => {
      const { control, fileService } = setup(SmartInputAttachmentPreset);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue(attachment);
      const file = new File(['x'], 'report.docx');

      allowFilesAssignment(screen.getByLabelText('Attachment'));
      fireEvent.drop(dropZone(), { dataTransfer: { files: [file] } });

      await waitFor(() => expect(control.value).toEqual(attachment));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
      expect(control.touched).toBe(true);
    });

    it('should render the preview card with a value', () => {
      setup(SmartInputAttachmentPreset, {
        control: new SmartFormControl(attachment),
      });

      expect(screen.getByText('report.docx').parentElement).toHaveClass(
        'smart:p-3',
        'smart:rounded-xl',
      );
    });

    it('should disable the drop zone and render the progress while uploading', async () => {
      const { container, fileService } = setup(SmartInputAttachmentPreset);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(75);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Attachment'), {
          target: { files: [new File(['x'], 'report.docx')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:transition-all',
      ) as HTMLElement;

      expect(dropZone()).toHaveAttribute('aria-disabled', 'true');
      expect(bar.style.width).toBe('75%');
    });
  });
});
