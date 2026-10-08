import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputVideo } from './input-video';
import { SmartInputVideoPreset } from './preset/input-video-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';
import { SmartHttpClient } from '../../../services/http/http.client';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class VideoModel {
  @Field({ type: FieldType.video })
  value: unknown = null;
}

const movie = { id: '2', fileName: 'movie.mp4' };

const variants = [
  ['standard', SmartInputVideo],
  ['preset', SmartInputVideoPreset],
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
      translations={{ MODEL: { value: 'Movie' } }}
      fileService={fileService}
    >
      <Input
        options={{
          control,
          fieldKey: 'value',
          model: new VideoModel(),
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.video }}
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

describe('@smartsoft001/react: SmartInputVideo', () => {
  afterEach(() => jest.useRealTimers());

  it.each(variants)(
    '%s: should label the hidden mp4 file input',
    (_name, Input) => {
      setup(Input);

      const input = screen.getByLabelText('Movie');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', '.mp4');
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
    '%s: should not render play and delete without a value',
    (_name, Input) => {
      setup(Input);

      expect(
        screen.queryByRole('button', { name: 'play' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'delete' }),
      ).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should render play and delete with a value',
    (_name, Input) => {
      setup(Input, { control: new SmartFormControl<unknown>(movie) });

      expect(screen.getByRole('button', { name: 'play' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'delete' }),
      ).toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should upload the picked mp4 and set the attachment as the value',
    async (_name, Input) => {
      const { control, fileService } = setup(Input);
      const upload = jest.spyOn(fileService, 'upload').mockResolvedValue(movie);
      const file = new File(['x'], 'movie.mp4');

      fireEvent.change(screen.getByLabelText('Movie'), {
        target: { files: [file] },
      });

      await waitFor(() => expect(control.value).toEqual(movie));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
    },
  );

  it.each(variants)(
    '%s: should play the new video five seconds after the value changes',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container, control } = setup(Input);

      act(() => control.setValue(movie));
      act(() => jest.advanceTimersByTime(5000));
      fireEvent.click(screen.getByRole('button', { name: 'play' }));

      expect(container.querySelector('video')).toHaveAttribute('controls');
      expect(container.querySelector('video')).toHaveAttribute(
        'controlsList',
        'nodownload',
      );
      expect(container.querySelector('video source')).toHaveAttribute(
        'src',
        '/api/attachments/2',
      );
      expect(container.querySelector('video source')).toHaveAttribute(
        'type',
        'video/mp4',
      );
      expect(
        screen.queryByRole('button', { name: 'play' }),
      ).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should not show the video before the five seconds pass',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container, control } = setup(Input);

      act(() => control.setValue(movie));
      act(() => jest.advanceTimersByTime(4999));
      fireEvent.click(screen.getByRole('button', { name: 'play' }));

      expect(container.querySelector('video')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should not get a video URL for the initial value',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container } = setup(Input, {
        control: new SmartFormControl<unknown>(movie),
      });

      act(() => jest.advanceTimersByTime(5000));
      fireEvent.click(screen.getByRole('button', { name: 'play' }));

      expect(container.querySelector('video')).not.toBeInTheDocument();
    },
  );

  it.each(variants)(
    '%s: should stop playing when the value changes',
    (_name, Input) => {
      jest.useFakeTimers();
      const { container, control } = setup(Input);

      act(() => control.setValue(movie));
      act(() => jest.advanceTimersByTime(5000));
      fireEvent.click(screen.getByRole('button', { name: 'play' }));
      act(() => control.setValue({ id: '3', fileName: 'other.mp4' }));

      expect(container.querySelector('video')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'play' })).toBeInTheDocument();
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
    it('should render the indigo add button without a value and change with one', () => {
      const control = new SmartFormControl<unknown>(null);
      setup(SmartInputVideo, { control });

      expect(screen.getByRole('button', { name: 'add' })).toHaveClass(
        'smart:bg-indigo-600',
      );

      act(() => control.setValue(movie));

      expect(
        screen.getByRole('button', { name: 'change' }),
      ).toBeInTheDocument();
    });

    it('should mark the control and open the file picker on add', () => {
      const { control } = setup(SmartInputVideo);
      const click = jest.spyOn(screen.getByLabelText('Movie'), 'click');

      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(click).toHaveBeenCalled();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
    });

    it('should clear the value on delete without a confirmation', () => {
      const { control } = setup(SmartInputVideo, {
        control: new SmartFormControl<unknown>(movie),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));

      expect(control.value).toBeNull();
      expect(control.dirty).toBe(true);
    });

    it('should render the indigo progress of the upload', async () => {
      const { container, fileService } = setup(SmartInputVideo);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(20);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Movie'), {
          target: { files: [new File(['x'], 'movie.mp4')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:h-full.smart\\:bg-indigo-600',
      ) as HTMLElement;

      expect(bar.parentElement).toHaveClass('smart:w-24');
      expect(bar.style.width).toBe('20%');
    });
  });

  describe('preset', () => {
    it('should mark the label with data-role', () => {
      const { container } = setup(SmartInputVideoPreset);

      expect(container.querySelector('label')).toHaveAttribute(
        'data-role',
        'label',
      );
    });

    it('should render the drop zone with the drop / browse texts', () => {
      setup(SmartInputVideoPreset);

      const zone = dropZone();

      expect(zone).toHaveAttribute('tabindex', '0');
      expect(zone).toHaveClass('smart:p-8', 'smart:border-dashed');
      expect(zone).toHaveTextContent('browse');
    });

    it('should open the file picker on a click, Enter and Space', () => {
      const { control } = setup(SmartInputVideoPreset);
      const click = jest.spyOn(screen.getByLabelText('Movie'), 'click');

      fireEvent.click(dropZone());
      fireEvent.keyDown(dropZone(), { key: 'Enter' });
      fireEvent.keyDown(dropZone(), { key: ' ' });

      expect(click).toHaveBeenCalledTimes(3);
      expect(control.touched).toBe(true);
    });

    it('should highlight the drop zone while a file is dragged over it', () => {
      setup(SmartInputVideoPreset);

      fireEvent.dragOver(dropZone());

      expect(dropZone()).toHaveClass('smart:border-blue-600');

      fireEvent.dragLeave(dropZone());

      expect(dropZone()).toHaveClass('smart:border-gray-300');
    });

    it('should upload a dropped file', async () => {
      const { control, fileService } = setup(SmartInputVideoPreset);
      const upload = jest.spyOn(fileService, 'upload').mockResolvedValue(movie);
      const file = new File(['x'], 'movie.mp4');

      allowFilesAssignment(screen.getByLabelText('Movie'));
      fireEvent.drop(dropZone(), { dataTransfer: { files: [file] } });

      await waitFor(() => expect(control.value).toEqual(movie));
      expect(upload).toHaveBeenCalledWith(file, expect.any(Function));
    });

    it('should render the preview card with the file name', () => {
      setup(SmartInputVideoPreset, {
        control: new SmartFormControl<unknown>(movie),
      });

      expect(screen.getByText('movie.mp4').parentElement).toHaveClass(
        'smart:p-3',
        'smart:rounded-xl',
      );
    });

    it('should clear the value once the delete is confirmed', () => {
      const { control } = setup(SmartInputVideoPreset, {
        control: new SmartFormControl<unknown>(movie),
      });

      fireEvent.click(screen.getByRole('button', { name: 'delete' }));
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }));

      expect(control.value).toBeNull();
    });

    it('should render the framed video', () => {
      jest.useFakeTimers();
      const { container, control } = setup(SmartInputVideoPreset);

      act(() => control.setValue(movie));
      act(() => jest.advanceTimersByTime(5000));
      fireEvent.click(screen.getByRole('button', { name: 'play' }));

      expect(container.querySelector('video')).toHaveClass(
        'smart:w-full',
        'smart:rounded-xl',
        'smart:border-gray-200',
      );
    });

    it('should disable the drop zone and render the progress while uploading', async () => {
      const { container, fileService } = setup(SmartInputVideoPreset);

      jest
        .spyOn(fileService, 'upload')
        .mockImplementation((_file, progress) => {
          progress?.(45);

          return new Promise(() => undefined);
        });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Movie'), {
          target: { files: [new File(['x'], 'movie.mp4')] },
        });
      });

      const bar = container.querySelector(
        '.smart\\:transition-all',
      ) as HTMLElement;

      expect(dropZone()).toHaveAttribute('aria-disabled', 'true');
      expect(bar.style.width).toBe('45%');
    });
  });
});
