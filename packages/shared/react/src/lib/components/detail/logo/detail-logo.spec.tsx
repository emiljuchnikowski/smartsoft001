import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailLogo } from './detail-logo';
import { SmartDetailLogoPreset } from './preset/detail-logo-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Brand {
  @Field({ type: FieldType.logo, details: true })
  logo = '';
}

const URL = 'https://example.com/logo.png';

function options(logo?: string): IDetailOptions<Brand> {
  return {
    key: 'logo',
    item: logo === undefined ? undefined : Object.assign(new Brand(), { logo }),
    options: { type: FieldType.logo },
  };
}

describe('@smartsoft001/react: SmartDetailLogo', () => {
  it('should render an <img> with the value as src', () => {
    const { container } = render(<SmartDetailLogo options={options(URL)} />);

    expect(container.querySelector('img')).toHaveAttribute('src', URL);
  });

  it('should render a decorative image', () => {
    const { container } = render(<SmartDetailLogo options={options(URL)} />);

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailLogo options={options()} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should render nothing when the value is empty', () => {
    const { container } = render(<SmartDetailLogo options={options('')} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should append className to the <img>', () => {
    const { container } = render(
      <SmartDetailLogo options={options(URL)} className="my-custom-class" />,
    );

    expect(container.querySelector('img')).toHaveClass(
      'my-custom-class',
      'smart:h-[150px]',
    );
  });
});

describe('@smartsoft001/react: SmartDetailLogoPreset', () => {
  it('should render an <img> with the value as src', () => {
    const { container } = render(
      <SmartDetailLogoPreset options={options(URL)} />,
    );

    expect(container.querySelector('img[data-role="logo"]')).toHaveAttribute(
      'src',
      URL,
    );
  });

  it('should apply the compact contained logo classes', () => {
    const { container } = render(
      <SmartDetailLogoPreset options={options(URL)} />,
    );

    expect(container.querySelector('img[data-role="logo"]')).toHaveClass(
      'smart:max-h-10',
      'smart:object-contain',
    );
  });

  it('should render nothing when the value is empty', () => {
    const { container } = render(
      <SmartDetailLogoPreset options={options('')} />,
    );

    expect(container.querySelector('img')).toBeNull();
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailLogoPreset options={options()} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('should append className to the <img>', () => {
    const { container } = render(
      <SmartDetailLogoPreset
        options={options(URL)}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('img[data-role="logo"]')).toHaveClass(
      'my-custom-class',
      'smart:max-h-10',
    );
  });
});
