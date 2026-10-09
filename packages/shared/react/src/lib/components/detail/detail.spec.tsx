import { fireEvent, render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { getDefaultDetailFieldComponents } from './default-field-components';
import { SmartDetail } from './detail';
import { SmartDetailFieldProps } from './detail.types';
import { DETAIL_PRESET_FIELD_COMPONENTS } from './preset-fields';
import { IDetailOptions } from '../../models';
import { SmartDetailTextPreset } from './text/preset/detail-text-preset';
import { IModelLabelProvider } from '../../providers/model-label.provider';
import { SmartProvider } from '../../providers/smart-provider';

@Model({})
class Customer implements IEntity<string> {
  id = 'customer-1';

  @Field({ type: FieldType.text, details: true })
  name = 'Ada';

  @Field({ type: FieldType.email, details: true })
  email = 'ada@example.com';

  @Field({ type: FieldType.color, details: true })
  color = '#ff0000';
}

function options(
  partial: Partial<IDetailOptions<Customer>> = {},
): IDetailOptions<Customer> {
  return {
    key: 'name',
    item: new Customer(),
    options: { type: FieldType.text },
    ...partial,
  };
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return 'Mock Label';
  }
}

function Injected({ options, className }: SmartDetailFieldProps) {
  return (
    <div className={className} data-testid="injected">
      {options?.key}
    </div>
  );
}

describe('@smartsoft001/react: SmartDetail', () => {
  it('should render the text detail for FieldType.text', () => {
    const { container } = render(
      <SmartDetail options={options()} type={Customer} />,
    );

    expect(container.querySelector('p')).toHaveTextContent('Ada');
  });

  it('should render the email detail for FieldType.email', () => {
    const { container } = render(
      <SmartDetail
        options={options({ key: 'email', options: { type: FieldType.email } })}
        type={Customer}
      />,
    );

    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'mailto:ada@example.com',
    );
  });

  it('should render the color detail for FieldType.color', () => {
    const { container } = render(
      <SmartDetail
        options={options({ key: 'color', options: { type: FieldType.color } })}
        type={Customer}
      />,
    );

    expect(container.querySelector('.smart\\:h-8')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('should fall back to the text detail without a field type', () => {
    const { container } = render(
      <SmartDetail options={options({ options: {} })} type={Customer} />,
    );

    expect(container.querySelector('p')).toHaveTextContent('Ada');
  });

  it('should render a skeleton while there is no item', () => {
    const { container } = render(
      <SmartDetail options={options({ item: undefined })} type={Customer} />,
    );

    expect(container.querySelector('.smart\\:animate-pulse')?.tagName).toBe(
      'DIV',
    );
  });

  it('should render the label of the model label provider', () => {
    const { container } = render(
      <SmartProvider modelLabelProvider={new MockModelLabelProvider()}>
        <SmartDetail options={options()} type={Customer} />
      </SmartProvider>,
    );

    expect(
      container.querySelector('span.smart\\:text-gray-500'),
    ).toHaveTextContent('Mock Label');
  });

  it('should render the translated MODEL label of the key', () => {
    render(
      <SmartProvider translations={{ MODEL: { name: 'Name' } }}>
        <SmartDetail options={options()} type={Customer} />
      </SmartProvider>,
    );

    expect(screen.getByText('Name')).toHaveClass('smart:block');
  });

  it('should render the info of the field', () => {
    render(
      <SmartDetail
        options={options({
          options: { type: FieldType.text, info: 'name.info' },
        })}
        type={Customer}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('info-popover')).toHaveTextContent('name.info');
  });

  it('should render nothing without options', () => {
    const { container } = render(
      <SmartDetail options={undefined} type={Customer} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should forward className to the field component', () => {
    const { container } = render(
      <SmartDetail
        options={options()}
        type={Customer}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('p')).toHaveClass('my-custom-class');
  });

  it('should render the component registered for the field type', () => {
    const detailFieldComponents = { [FieldType.text]: Injected };

    const { container } = render(
      <SmartProvider detailFieldComponents={detailFieldComponents}>
        <SmartDetail options={options()} type={Customer} />
      </SmartProvider>,
    );

    expect([
      screen.getByTestId('injected').textContent,
      container.querySelector('p'),
    ]).toEqual(['name', null]);
  });

  it('should render the presets registered with DETAIL_PRESET_FIELD_COMPONENTS', () => {
    const { container } = render(
      <SmartProvider detailFieldComponents={DETAIL_PRESET_FIELD_COMPONENTS}>
        <SmartDetail options={options()} type={Customer} />
      </SmartProvider>,
    );

    expect(container.querySelector('[data-role="text"]')).toHaveTextContent(
      'Ada',
    );
  });
});

describe('@smartsoft001/react: getDefaultDetailFieldComponents', () => {
  const TYPES: FieldTypeDef[] = [
    FieldType.email,
    FieldType.flag,
    FieldType.enum,
    FieldType.address,
    FieldType.object,
    FieldType.color,
    FieldType.logo,
    FieldType.array,
    FieldType.pdf,
    FieldType.video,
    FieldType.attachment,
    FieldType.dateRange,
    FieldType.image,
    FieldType.phoneNumberPl,
    FieldType.text,
  ];

  it('should map every field type to a component', () => {
    const map = getDefaultDetailFieldComponents();

    expect(TYPES.filter((type) => typeof map[type] !== 'function')).toEqual([]);
  });

  it('should build the map once', () => {
    expect(getDefaultDetailFieldComponents()).toBe(
      getDefaultDetailFieldComponents(),
    );
  });

  it('should map the same field types in the preset map', () => {
    expect(Object.keys(DETAIL_PRESET_FIELD_COMPONENTS).sort()).toEqual(
      Object.keys(getDefaultDetailFieldComponents()).sort(),
    );
  });

  it('should map text to the text preset in the preset map', () => {
    expect(DETAIL_PRESET_FIELD_COMPONENTS[FieldType.text]).toBe(
      SmartDetailTextPreset,
    );
  });
});
