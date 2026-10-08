import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailVideo } from './detail-video';
import { SmartDetailVideoPreset } from './preset/detail-video-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';

@Model({})
class Lesson {
  @Field({ type: FieldType.video, details: true })
  clip: { id: string } | null = null;
}

function options(clip?: { id: string }): IDetailOptions<Lesson> {
  return {
    key: 'clip',
    item:
      clip === undefined ? undefined : Object.assign(new Lesson(), { clip }),
    options: { type: FieldType.video },
  };
}

function setup(children: ReactNode) {
  const fileService = {
    getUrl: jest.fn((id: string) => `/files/${id}`),
    download: jest.fn(),
  };

  const view = render(
    <SmartProvider fileService={fileService as unknown as FileService}>
      {children}
    </SmartProvider>,
  );

  return { ...view, fileService };
}

const variants = [
  ['standard', SmartDetailVideo],
  ['preset', SmartDetailVideoPreset],
] as const;

describe('@smartsoft001/react: SmartDetailVideo', () => {
  it.each(variants)(
    '%s: should render a <video> with the URL of the file as source',
    (_name, Detail) => {
      const { container, fileService } = setup(
        <Detail options={options({ id: 'xyz' })} />,
      );

      expect(container.querySelector('video source')).toHaveAttribute(
        'src',
        '/files/xyz',
      );
      expect(fileService.getUrl).toHaveBeenCalledWith('xyz');
    },
  );

  it.each(variants)(
    '%s: should render an mp4 source with controls and no download',
    (_name, Detail) => {
      const { container } = setup(<Detail options={options({ id: 'xyz' })} />);
      const video = container.querySelector('video');

      expect([
        video?.hasAttribute('controls'),
        video?.getAttribute('controlslist'),
        video?.querySelector('source')?.getAttribute('type'),
      ]).toEqual([true, 'nodownload', 'video/mp4']);
    },
  );

  it.each(variants)(
    '%s: should render nothing when there is no item',
    (_name, Detail) => {
      const { container } = setup(<Detail options={options()} />);

      expect(container.querySelector('video')).toBeNull();
    },
  );

  it('should append className to the <video>', () => {
    const { container } = setup(
      <SmartDetailVideo
        options={options({ id: 'xyz' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('video')).toHaveClass(
      'my-custom-class',
      'smart:w-full',
    );
  });
});

describe('@smartsoft001/react: SmartDetailVideoPreset', () => {
  it('should apply the framed preset classes', () => {
    const { container } = setup(
      <SmartDetailVideoPreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('video[data-role="video"]')).toHaveClass(
      'smart:rounded-xl',
      'smart:border',
      'smart:shadow-2xs',
    );
  });

  it('should append className to the <video>', () => {
    const { container } = setup(
      <SmartDetailVideoPreset
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('video[data-role="video"]')).toHaveClass(
      'my-custom-class',
      'smart:rounded-xl',
    );
  });
});
