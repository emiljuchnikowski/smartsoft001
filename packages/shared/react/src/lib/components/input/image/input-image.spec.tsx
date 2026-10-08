import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputImage } from './input-image';
import { SmartInputImagePreset } from './preset/input-image-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class ImageModel {
  @Field({ type: FieldType.image })
  value: unknown = null;
}

const variants = [
  ['standard', SmartInputImage],
  ['preset', SmartInputImagePreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  {
    control = new SmartFormControl<unknown>(null),
    className,
  }: { control?: SmartFormControl<unknown>; className?: string } = {},
) {
  const fileService = new FileService(
    { apiUrl: '/api' },
    new SmartHttpClient(),
  );

  new SmartFormGroup({ value: control });

  const view = render(
    <SmartProvider
      language="eng"
      translations={{ MODEL: { value: 'Photo' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new ImageModel(),
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.image }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, fileService, ...view };
}

describe('@smartsoft001/react: SmartInputImage', () => {
  afterEach(() => jest.useRealTimers());

  it.each(variants)(
    '%s: should label the hidden image file input',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Photo');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', '.jpg,.png,.jpeg');
      expect(input).toHaveAttribute('hidden');
    },
  );

  it.each(variants)(
    '%s: should show the required asterisk for a required control',
    (_name, Input) => {
      const { container } = setup(Input, {
        control: new SmartFormControl<unknown>(null, SmartValidators.required),
      });

      expect(container.querySelector('label span')).toHaveTextContent('*');
    },
  );

  it.each(variants)(
    '%s: should render only the add button without a value',
    (_name, Input) => {
      const { container } = setup(Input);

      expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'delete' }),
      ).not.toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should render change, delete and the image of the value',
    (_name, Input) => {
      const { container } = setup(Input, {
        control: new SmartFormControl<unknown>({ id: '1' }),
      });

      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/api/attachments/1',
      );
    },
  );

  it.each(variants)(
    '%s: should mark the control and open the file picker on add',
    (_name, Input) => {
      const { control } = setup(Input);
      const click = jest.spyOn(screen.getByLabelText('Photo'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    },
  );

  it.each(variants)(
    '%s: should upload the picked image and set the attachment as the value',
    async (_name, Input) => {
      const { control, fileService } = setup(Input);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue({ id: '2' });
      const file = new File(['x'], 'photo.png');

      fireEvent.change(screen.getByLabelText('Photo'), {
        target: { files: [file] },
      });

      await waitFor(() => expect(control.value).toEqual({ id: '2' }));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
    },
  );

  it.each(variants)(
    '%s: should reject a file that is not an image',
    async (_name, Input) => {
      const { fileService } = setup(Input);
      const upload = jest.spyOn(fileService, 'upload');

      fireEvent.change(screen.getByLabelText('Photo'), {
        target: { files: [new File(['x'], 'doc.pdf')] },
      });

      expect(
        await screen.findByText('Invalid file type (.jpg,.png,.jpeg)'),
      ).toBeInTheDocument();
      expect(upload).not.toHaveBeenCalled();
    },
  );

  it.each(variants)(
    '%s: should update the image a second after the value changes',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container, control } = setup(Input, {
        control: new SmartFormControl<unknown>({ id: '1' }),
      });

      act(() => control.setValue({ id: '2' }));
      act(() => jest.advanceTimersByTime(999));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/api/attachments/1',
      );

      act(() => jest.advanceTimersByTime(1));

      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        '/api/attachments/2',
      );
    },
  );

  it.each(variants)(
    '%s: should remove the image a second after the delete is confirmed',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container, control } = setup(Input, {
        control: new SmartFormControl<unknown>({ id: '1' }),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));
      act(() => jest.advanceTimersByTime(1000));

      expect(control.value).toBeNull();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should append className to the group classes',
    (_name, Input) => {
      const { container } = setup(Input, { className: 'extra-user-class' });

      expect(container.querySelector('label + div')).toHaveClass(
        'extra-user-class',
        'smart:flex',
        'smart:flex-wrap',
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

  it('standard: should render the bordered image and the indigo progress', async () => {
    const { container, fileService } = setup(SmartInputImage, {
      control: new SmartFormControl<unknown>({ id: '1' }),
    });

    jest.spyOn(fileService, 'upload').mockImplementation((_file, progress) => {
      progress?.(10);

      return new Promise(() => undefined);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Photo'), {
        target: { files: [new File(['x'], 'photo.png')] },
      });
    });

    const bar = container.querySelector(
      '.smart\\:h-full.smart\\:bg-indigo-600',
    ) as HTMLElement;

    expect(container.querySelector('img')).toHaveClass(
      'smart:max-h-96',
      'smart:border-gray-300',
    );
    expect(bar.style.width).toBe('10%');
  });

  it('preset: should render the Preline image preview and the blue progress', async () => {
    const { container, fileService } = setup(SmartInputImagePreset, {
      control: new SmartFormControl<unknown>({ id: '1' }),
    });

    jest.spyOn(fileService, 'upload').mockImplementation((_file, progress) => {
      progress?.(90);

      return new Promise(() => undefined);
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Photo'), {
        target: { files: [new File(['x'], 'photo.png')] },
      });
    });

    const bar = container.querySelector(
      '.smart\\:h-full.smart\\:bg-blue-600',
    ) as HTMLElement;
    const image = container.querySelector('img');

    expect(image).toHaveClass('smart:w-56', 'smart:rounded-lg');
    expect(image).toHaveAttribute('alt', '');
    expect(bar.style.width).toBe('90%');
  });
});
