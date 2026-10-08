import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailColor } from './detail-color';
import { SmartDetailColorPreset } from './preset/detail-color-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Brand {
  @Field({ type: FieldType.color, details: true })
  color = '';
}

function options(color?: string): IDetailOptions<Brand> {
  return {
    key: 'color',
    item:
      color === undefined ? undefined : Object.assign(new Brand(), { color }),
    options: { type: FieldType.color },
  };
}

describe('@smartsoft001/react: SmartDetailColor', () => {
  it('should render a <div> with the colour as background', () => {
    const { container } = render(
      <SmartDetailColor options={options('#ff0000')} />,
    );

    expect(container.querySelector('div')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailColor options={options()} />);

    expect(container.querySelector('div')).toBeNull();
  });

  it('should append className to the <div>', () => {
    const { container } = render(
      <SmartDetailColor
        options={options('#00ff00')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('div')).toHaveClass(
      'my-custom-class',
      'smart:rounded',
    );
  });
});

describe('@smartsoft001/react: SmartDetailColorPreset', () => {
  it('should render a swatch with the colour as background', () => {
    const { container } = render(
      <SmartDetailColorPreset options={options('#4f46e5')} />,
    );
    const swatch = container.querySelector('[data-role="swatch"]');

    expect(swatch).toHaveStyle({ backgroundColor: 'rgb(79, 70, 229)' });
    expect(swatch).toHaveClass(
      'smart:size-6',
      'smart:rounded-md',
      'smart:border',
    );
  });

  it('should render the hex code', () => {
    const { container } = render(
      <SmartDetailColorPreset options={options('#4f46e5')} />,
    );

    expect(container.querySelector('[data-role="value"]')?.textContent).toBe(
      '#4f46e5',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailColorPreset options={options()} />,
    );

    expect(container.querySelector('[data-role="swatch"]')).toBeNull();
  });

  it('should append className to the container', () => {
    const { container } = render(
      <SmartDetailColorPreset
        options={options('#4f46e5')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="color"]')).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});
