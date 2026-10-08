import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, IFieldOptions, Model } from '@smartsoft001/models';

import { SmartInputFile } from './input-file';
import { SmartInputFilePreset } from './preset/input-file-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class FileModel {
  @Field({ type: FieldType.file })
  value: unknown = null;
}

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl(null),
    fieldOptions = { type: FieldType.file },
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
      translations={{ MODEL: { value: 'File' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new FileModel(),
          treeLevel: 0,
        }}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, fileService, ...view };
}

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe('@smartsoft001/react: SmartInputFile', () => {
  describe('standard', () => {
    it('should render the model label', () => {
      const { container } = setup(SmartInputFile);

      expect(container.querySelector('label')).toHaveTextContent('File');
    });

    it('should label the hidden file input', () => {
      setup(SmartInputFile);

      const input = screen.getByLabelText('File');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('hidden');
    });

    it('should render the add button without a value', () => {
      setup(SmartInputFile);

      expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
    });

    it('should render the change button with a value', () => {
      setup(SmartInputFile, {
        control: new SmartFormControl({ name: 'x.pdf' }),
      });

      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
    });

    it('should not render the file name without a value', () => {
      const { container } = setup(SmartInputFile);

      expect(container.querySelector('div > span')).not.toBeInTheDocument();
    });

    it('should render the name of the value', () => {
      setup(SmartInputFile, {
        control: new SmartFormControl({ name: 'x.pdf' }),
      });

      expect(screen.getByText('x.pdf')).toHaveClass(
        'smart:text-sm',
        'smart:text-gray-700',
      );
    });

    it('should set accept on the file input from fieldOptions.possibilities', () => {
      const { container } = setup(SmartInputFile, {
        fieldOptions: {
          type: FieldType.file,
          possibilities: 'application/pdf',
        },
      });

      expect(fileInput(container)).toHaveAttribute('accept', 'application/pdf');
    });

    it('should show the required asterisk for a required control', () => {
      const { container } = setup(SmartInputFile, {
        control: new SmartFormControl(null, SmartValidators.required),
      });

      expect(container.querySelector('label span')).toHaveTextContent('*');
    });

    it('should append className to the group classes', () => {
      const { container } = setup(SmartInputFile, {
        className: 'extra-user-class',
      });

      expect(container.querySelector('label + div')).toHaveClass(
        'extra-user-class',
        'smart:flex',
        'smart:items-center',
      );
    });

    it('should mark the control and open the file picker on add', () => {
      const { container, control } = setup(SmartInputFile);
      const click = jest.spyOn(fileInput(container), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should set the picked file as the value', () => {
      const { container, control } = setup(SmartInputFile);
      const file = new File(['x'], 'test.txt');

      fireEvent.change(fileInput(container), { target: { files: [file] } });

      expect(control.value).toBe(file);
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('should render nothing without a control', () => {
      const { container } = render(<SmartInputFile fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('preset', () => {
    it('should render the styled native file input labelled with the model label', () => {
      setup(SmartInputFilePreset);

      const input = screen.getByLabelText('File');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).not.toHaveAttribute('hidden');
      expect(input).toHaveClass(
        'smart:block',
        'smart:w-full',
        'smart:rounded-lg',
        'smart:file:py-3',
      );
    });

    it('should append className to the input classes', () => {
      setup(SmartInputFilePreset, { className: 'extra-user-class' });

      expect(screen.getByLabelText('File')).toHaveClass(
        'extra-user-class',
        'smart:block',
      );
    });

    it('should set accept on the file input from fieldOptions.possibilities', () => {
      setup(SmartInputFilePreset, {
        fieldOptions: { type: FieldType.file, possibilities: '.pdf,.doc' },
      });

      expect(screen.getByLabelText('File')).toHaveAttribute(
        'accept',
        '.pdf,.doc',
      );
    });

    it('should focus the input when the field is focused', () => {
      setup(SmartInputFilePreset, {
        fieldOptions: { type: FieldType.file, focused: true },
      });

      expect(screen.getByLabelText('File')).toHaveFocus();
    });

    it('should show the required asterisk for a required control', () => {
      const { container } = setup(SmartInputFilePreset, {
        control: new SmartFormControl(null, SmartValidators.required),
      });

      expect(container.querySelector('label span')).toHaveTextContent('*');
    });

    it('should not render the download and delete buttons without a value', () => {
      setup(SmartInputFilePreset);

      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('should render download, delete and the file name with a value', () => {
      setup(SmartInputFilePreset, {
        control: new SmartFormControl({ id: '1', fileName: 'doc.pdf' }),
      });

      expect(
        screen.getByRole('button', { name: 'download' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
      expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    });

    it('should upload the picked file and set the attachment as the value', async () => {
      const { control, fileService } = setup(SmartInputFilePreset);
      const attachment = { id: '1', fileName: 'doc.pdf' };
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue(attachment);
      const file = new File(['x'], 'doc.pdf');

      fireEvent.change(screen.getByLabelText('File'), {
        target: { files: [file] },
      });

      await waitFor(() => expect(control.value).toEqual(attachment));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
      expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    });

    it('should render the progress of the upload', async () => {
      const { container, fileService } = setup(SmartInputFilePreset);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(40);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('File'), {
          target: { files: [new File(['x'], 'doc.pdf')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:bg-blue-600',
      ) as HTMLElement;

      expect(bar).toBeInTheDocument();
      expect(bar.style.width).toBe('40%');
    });

    it('should reject a file whose type is not accepted', async () => {
      const { control, fileService } = setup(SmartInputFilePreset, {
        fieldOptions: { type: FieldType.file, possibilities: '.pdf' },
      });
      const upload = jest.spyOn(fileService, 'upload');

      fireEvent.change(screen.getByLabelText('File'), {
        target: { files: [new File(['x'], 'image.png')] },
      });

      expect(
        await screen.findByText('Invalid file type (.pdf)'),
      ).toBeInTheDocument();
      expect(upload).not.toHaveBeenCalled();
      expect(control.value).toBeNull();
    });

    it('should download the attachment', () => {
      const { fileService } = setup(SmartInputFilePreset, {
        control: new SmartFormControl({ id: '1', fileName: 'doc.pdf' }),
      });
      const download = jest
        .spyOn(fileService, 'download')
        .mockImplementation(() => undefined);

      fireEvent.click(screen.getByRole('button', { name: 'download' }));

      expect(download).toHaveBeenCalledWith('1');
    });

    it('should clear the value once the delete is confirmed', () => {
      const { control } = setup(SmartInputFilePreset, {
        control: new SmartFormControl({ id: '1', fileName: 'doc.pdf' }),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(control.value).toBeNull();
      expect(control.dirty).toBe(true);
      expect(screen.queryByText('doc.pdf')).not.toBeInTheDocument();
    });

    it('should render nothing without a control', () => {
      const { container } = render(
        <SmartInputFilePreset fieldOptions={undefined} />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
});
