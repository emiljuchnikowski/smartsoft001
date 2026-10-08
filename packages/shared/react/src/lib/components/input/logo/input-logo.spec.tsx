import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputLogo } from './input-logo';
import { SmartInputLogoPreset } from './preset/input-logo-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class LogoModel {
  @Field({ type: FieldType.logo })
  value: unknown = null;
}

const dataUrl = 'data:image/jpeg;base64, eA==';

const variants = [
  ['standard', SmartInputLogo],
  ['preset', SmartInputLogoPreset],
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
      translations={{ MODEL: { value: 'Logo' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new LogoModel(),
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.logo }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, fileService, ...view };
}

describe('@smartsoft001/react: SmartInputLogo', () => {
  afterEach(() => jest.useRealTimers());

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
    '%s: should render nothing without a control',
    (_name, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  describe('standard', () => {
    it('should label the hidden jpeg file input', () => {
      setup(SmartInputLogo);

      const input = screen.getByLabelText('Logo');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', 'image/jpeg');
      expect(input).toHaveAttribute('hidden');
    });

    it('should render the choose button without a value', () => {
      const { container } = setup(SmartInputLogo);

      expect(screen.getByRole('button', { name: 'Wybierz plik' })).toHaveClass(
        'smart:bg-indigo-600',
      );
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should open the file picker on the choose button', () => {
      setup(SmartInputLogo);
      const click = jest.spyOn(screen.getByLabelText('Logo'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'Wybierz plik' }));

      expect(click).toHaveBeenCalled();
    });

    it('should store the picked image as a base64 jpeg data URL', async () => {
      const { control } = setup(SmartInputLogo);

      fireEvent.change(screen.getByLabelText('Logo'), {
        target: { files: [new File(['x'], 'logo.jpg')] },
      });

      await waitFor(() => expect(control.value).toBe(dataUrl));
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should keep the value when no file is picked', () => {
      const { control } = setup(SmartInputLogo, {
        control: new SmartFormControl<unknown>(dataUrl),
      });

      fireEvent.change(screen.getByLabelText('Logo'), {
        target: { files: [] },
      });

      expect(control.value).toBe(dataUrl);
      expect(control.dirty).toBe(false);
    });

    it('should render the image of the value and the clear button', () => {
      const { container } = setup(SmartInputLogo, {
        control: new SmartFormControl<unknown>(dataUrl),
      });

      expect(container.querySelector('img')).toHaveAttribute('src', dataUrl);
      expect(container.querySelector('img')).toHaveClass(
        'smart:h-20',
        'smart:cursor-pointer',
      );
      expect(screen.getByRole('button', { name: '×' })).toHaveClass(
        'smart:bg-red-600',
      );
      expect(
        screen.queryByRole('button', { name: 'Wybierz plik' }),
      ).not.toBeInTheDocument();
    });

    it('should open the file picker on a click of the image', () => {
      const { container } = setup(SmartInputLogo, {
        control: new SmartFormControl<unknown>(dataUrl),
      });
      const click = jest.spyOn(screen.getByLabelText('Logo'), 'click');

      fireEvent.click(container.querySelector('img') as HTMLElement);

      expect(click).toHaveBeenCalled();
    });

    it('should clear the value on the clear button', () => {
      const { control, container } = setup(SmartInputLogo, {
        control: new SmartFormControl<unknown>(dataUrl),
      });

      fireEvent.click(screen.getByRole('button', { name: '×' }));

      expect(control.value).toBeNull();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should merge className into the group classes', () => {
      const { container } = setup(SmartInputLogo, {
        className: 'extra-user-class',
      });

      expect(container.querySelector('label + div')).toHaveClass(
        'extra-user-class',
        'smart:mt-2',
        'smart:gap-x-3',
      );
    });
  });

  describe('preset', () => {
    it('should label the hidden image file input', () => {
      setup(SmartInputLogoPreset);

      const input = screen.getByLabelText('Logo');

      expect(input).toHaveAttribute('accept', '.jpg,.png,.jpeg');
      expect(input).toHaveAttribute('hidden');
    });

    it('should render the avatar placeholder and the add button without a value', () => {
      const { container } = setup(SmartInputLogoPreset);

      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(container.querySelector('svg')?.parentElement).toHaveClass(
        'smart:size-20',
        'smart:rounded-full',
        'smart:bg-gray-100',
      );
      expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'delete' }),
      ).not.toBeInTheDocument();
    });

    it('should render the avatar of the value with change and delete', () => {
      const { container } = setup(SmartInputLogoPreset, {
        control: new SmartFormControl<unknown>({ id: '1' }),
      });
      const image = container.querySelector('img');

      expect(image).toHaveAttribute('src', '/api/attachments/1');
      expect(image).toHaveAttribute('alt', '');
      expect(image).toHaveClass('smart:size-20', 'smart:rounded-full');
      expect(container.querySelector('svg')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
    });

    it('should upload the picked image and show it a second later', async () => {
      const { container, control, fileService } = setup(SmartInputLogoPreset);
      const upload = jest
        .spyOn(fileService, 'upload')
        .mockResolvedValue({ id: '2' });

      fireEvent.change(screen.getByLabelText('Logo'), {
        target: { files: [new File(['x'], 'logo.png')] },
      });

      await waitFor(() => expect(control.value).toEqual({ id: '2' }));
      expect(upload).toHaveBeenCalled();
      await waitFor(
        () =>
          expect(container.querySelector('img')).toHaveAttribute(
            'src',
            '/api/attachments/2',
          ),
        { timeout: 2000 },
      );
    });

    it('should mark the control and open the file picker on add', () => {
      const { control } = setup(SmartInputLogoPreset);
      const click = jest.spyOn(screen.getByLabelText('Logo'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
    });

    it('should clear the value once the delete is confirmed', () => {
      const { control } = setup(SmartInputLogoPreset, {
        control: new SmartFormControl<unknown>({ id: '1' }),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(control.value).toBeNull();
    });

    it('should render the progress of the upload', async () => {
      const { container, fileService } = setup(SmartInputLogoPreset);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(55);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Logo'), {
          target: { files: [new File(['x'], 'logo.png')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:h-full.smart\\:bg-blue-600',
      ) as HTMLElement;

      expect(bar.parentElement).toHaveClass('smart:w-24');
      expect(bar.style.width).toBe('55%');
    });

    it('should append className to the group classes', () => {
      const { container } = setup(SmartInputLogoPreset, {
        className: 'extra-user-class',
      });

      expect(container.querySelector('label + div')).toHaveClass(
        'extra-user-class',
        'smart:gap-x-3',
        'smart:flex-wrap',
      );
    });
  });
});
