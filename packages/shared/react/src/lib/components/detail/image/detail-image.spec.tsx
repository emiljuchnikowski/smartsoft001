import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailImage } from './detail-image';
import { SmartDetailImagePreset } from './preset/detail-image-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { FileService } from '../../../services/file/file.service';

@Model({})
class Profile {
  @Field({ type: FieldType.image, details: true })
  avatar: { id: string } | null = null;
}

function options(avatar?: { id: string } | null): IDetailOptions<Profile> {
  return {
    key: 'avatar',
    item:
      avatar === undefined
        ? undefined
        : Object.assign(new Profile(), { avatar }),
    options: { type: FieldType.image },
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

describe('@smartsoft001/react: SmartDetailImage', () => {
  it('should render an <img> with the URL of the file', () => {
    const { container, fileService } = setup(
      <SmartDetailImage options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', '/files/abc');
    expect(fileService.getUrl).toHaveBeenCalledWith('abc');
  });

  it('should render nothing when there is no item', () => {
    const { container } = setup(<SmartDetailImage options={options()} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should render nothing when there is no file', () => {
    const { container } = setup(<SmartDetailImage options={options(null)} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should append className to the <img>', () => {
    const { container } = setup(
      <SmartDetailImage
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('img')).toHaveClass(
      'my-custom-class',
      'smart:h-[150px]',
    );
  });
});

describe('@smartsoft001/react: SmartDetailImagePreset', () => {
  it('should render an <img> with the URL of the file', () => {
    const { container } = setup(
      <SmartDetailImagePreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('img[data-role="image"]')).toHaveAttribute(
      'src',
      '/files/abc',
    );
  });

  it('should apply the preset classes', () => {
    const { container } = setup(
      <SmartDetailImagePreset options={options({ id: 'abc' })} />,
    );

    expect(container.querySelector('img[data-role="image"]')).toHaveClass(
      'smart:rounded-xl',
      'smart:border',
      'smart:object-cover',
      'smart:shadow-2xs',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = setup(<SmartDetailImagePreset options={options()} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should append className to the <img>', () => {
    const { container } = setup(
      <SmartDetailImagePreset
        options={options({ id: 'abc' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('img[data-role="image"]')).toHaveClass(
      'my-custom-class',
      'smart:rounded-xl',
    );
  });
});
