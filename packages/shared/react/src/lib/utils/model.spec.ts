import { Field, FieldType, Model } from '@smartsoft001/models';

import { getListCell, getListHeader, getModelLabel } from './model';

@Model({})
class Product {
  @Field({ type: FieldType.text, list: true })
  name!: string;

  @Field({ type: FieldType.enum, list: true })
  tags!: string[];
}

const translate = (key: string) =>
  ({ 'MODEL.name': 'Name', red: 'Red', ok: 'OK' })[key] ?? key;

describe('@smartsoft001/react: model helpers', () => {
  it('should translate the label as MODEL.<key>', () => {
    expect(getModelLabel({}, 'name', Product, { translate })).toBe('Name');
  });

  it('should prefer the label provider', () => {
    const labelProvider = { get: () => 'Custom' };

    expect(
      getModelLabel({}, 'name', Product, { translate, labelProvider }),
    ).toBe('Custom');
  });

  it('should read the header of a dynamic array column', () => {
    const data = [{ prices: [{ label: 'Retail', value: 5 }] }];

    expect(
      getListHeader(data, '__array.prices.0.label.value', Product, {
        translate,
      }),
    ).toBe('Retail');
  });

  it('should translate a string cell and report the field type', () => {
    expect(
      getListCell({ name: 'ok' }, 'name', null, Product, translate),
    ).toEqual({
      value: 'OK',
      type: FieldType.text,
    });
  });

  it('should translate every value of an enum cell', () => {
    expect(
      getListCell({ tags: ['red'] }, 'tags', null, Product, translate).value,
    ).toEqual(['Red']);
  });

  it('should run the cell pipe', () => {
    const pipe = {
      transform: (item: { name: string }) => item.name.toUpperCase(),
    };

    expect(
      getListCell({ name: 'abc' }, 'name', pipe, Product, translate).value,
    ).toBe('ABC');
  });

  it('should read a dynamic array cell', () => {
    const row = { prices: [{ label: 'Retail', value: 5 }] };

    expect(
      getListCell(row, '__array.prices.0.label.value', null, null, translate)
        .value,
    ).toBe(5);
  });
});
