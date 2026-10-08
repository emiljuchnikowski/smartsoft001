import { render } from '@testing-library/react';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailAddress } from './detail-address';
import { SmartDetailAddressPreset } from './preset/detail-address-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Company {
  @Field({ type: FieldType.address, details: true })
  address: Partial<IAddress> | null = null;
}

const ADDRESS: Partial<IAddress> = {
  street: 'Marszałkowska',
  buildingNumber: '12',
  flatNumber: '3',
  zipCode: '00-001',
  city: 'Warszawa',
};

function options(address?: Partial<IAddress> | null): IDetailOptions<Company> {
  return {
    key: 'address',
    item:
      address === undefined
        ? undefined
        : Object.assign(new Company(), { address }),
    options: { type: FieldType.address },
  };
}

describe('@smartsoft001/react: SmartDetailAddress', () => {
  it('should render the street, building/flat, zip code and city', () => {
    const { container } = render(
      <SmartDetailAddress options={options(ADDRESS)} />,
    );
    const text = container.querySelector('p')?.textContent;

    expect([
      text?.includes('Marszałkowska'),
      text?.includes('12/3'),
      text?.includes('00-001'),
      text?.includes('Warszawa'),
    ]).toEqual([true, true, true, true]);
  });

  it('should render the building number alone without a flat number', () => {
    const { container } = render(
      <SmartDetailAddress
        options={options({ ...ADDRESS, flatNumber: undefined })}
      />,
    );

    const text = container.querySelector('p')?.textContent;

    expect([text?.includes('Marszałkowska 12'), text?.includes('/')]).toEqual([
      true,
      false,
    ]);
  });

  it('should break the line before the zip code', () => {
    const { container } = render(
      <SmartDetailAddress options={options(ADDRESS)} />,
    );

    expect(container.querySelector('p > br')).toBeInTheDocument();
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailAddress options={options()} />);

    expect(container.querySelector('p')).toBeNull();
  });

  it('should render nothing when the address is empty', () => {
    const { container } = render(
      <SmartDetailAddress options={options(null)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should append className to the <p>', () => {
    const { container } = render(
      <SmartDetailAddress
        options={options(ADDRESS)}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('p')).toHaveClass(
      'my-custom-class',
      'smart:text-sm',
    );
  });
});

describe('@smartsoft001/react: SmartDetailAddressPreset', () => {
  it('should render the address block with street, zip code and city', () => {
    const { container } = render(
      <SmartDetailAddressPreset options={options(ADDRESS)} />,
    );
    const text = container.querySelector('[data-role="address"]')?.textContent;

    expect([
      text?.includes('Marszałkowska'),
      text?.includes('00-001'),
      text?.includes('Warszawa'),
    ]).toEqual([true, true, true]);
  });

  it('should render the pin icon hidden from assistive technology', () => {
    const { container } = render(
      <SmartDetailAddressPreset options={options(ADDRESS)} />,
    );

    expect(container.querySelector('[data-role="icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailAddressPreset options={options()} />,
    );

    expect(container.querySelector('[data-role="address"]')).toBeNull();
  });

  it('should append className to the container', () => {
    const { container } = render(
      <SmartDetailAddressPreset
        options={options(ADDRESS)}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="address"]')).toHaveClass(
      'my-custom-class',
      'smart:flex',
    );
  });
});
