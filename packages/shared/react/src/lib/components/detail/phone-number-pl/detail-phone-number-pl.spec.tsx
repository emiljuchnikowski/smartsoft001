import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailPhoneNumberPl } from './detail-phone-number-pl';
import { SmartDetailPhoneNumberPlPreset } from './preset/detail-phone-number-pl-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Contact {
  @Field({ type: FieldType.phoneNumberPl, details: true })
  phone = '';
}

function options(phone?: string): IDetailOptions<Contact> {
  return {
    key: 'phone',
    item:
      phone === undefined ? undefined : Object.assign(new Contact(), { phone }),
    options: { type: FieldType.phoneNumberPl },
  };
}

const variants = [
  ['standard', SmartDetailPhoneNumberPl],
  ['preset', SmartDetailPhoneNumberPlPreset],
] as const;

describe('@smartsoft001/react: SmartDetailPhoneNumberPl', () => {
  it.each(variants)(
    '%s: should render a tel: link with the Polish prefix',
    (_name, Detail) => {
      const { container } = render(<Detail options={options('500600700')} />);
      const link = container.querySelector('a');

      expect([link?.getAttribute('href'), link?.innerHTML]).toEqual([
        'tel:48500600700',
        '500600700',
      ]);
    },
  );

  it.each(variants)(
    '%s: should render the value of the cell pipe',
    (_name, Detail) => {
      const cellPipe = { transform: () => '500 600 700' };

      const { container } = render(
        <Detail options={{ ...options('500600700'), cellPipe }} />,
      );

      expect(container.querySelector('a')).toHaveTextContent('500 600 700');
    },
  );

  it.each(variants)(
    '%s: should render nothing when there is no item',
    (_name, Detail) => {
      const { container } = render(<Detail options={options()} />);

      expect(container.querySelector('a')).toBeNull();
    },
  );

  it.each(variants)(
    '%s: should render nothing when the value is empty',
    (_name, Detail) => {
      const { container } = render(<Detail options={options('')} />);

      expect(container.querySelector('a')).toBeNull();
    },
  );

  it('should append className to the link', () => {
    const { container } = render(
      <SmartDetailPhoneNumberPl
        options={options('500600700')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('a')).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});

describe('@smartsoft001/react: SmartDetailPhoneNumberPlPreset', () => {
  it('should render the link as a soft blue badge', () => {
    const { container } = render(
      <SmartDetailPhoneNumberPlPreset options={options('500600700')} />,
    );

    expect(container.querySelector('[data-role="link"]')).toHaveClass(
      'smart:bg-blue-100',
    );
  });

  it('should append className to the link', () => {
    const { container } = render(
      <SmartDetailPhoneNumberPlPreset
        options={options('500600700')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="link"]')).toHaveClass(
      'my-custom-class',
      'smart:bg-blue-100',
    );
  });
});
