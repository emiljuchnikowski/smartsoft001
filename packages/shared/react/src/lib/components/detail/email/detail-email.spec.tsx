import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailEmail } from './detail-email';
import { SmartDetailEmailPreset } from './preset/detail-email-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Contact {
  @Field({ type: FieldType.email, details: true })
  email = '';
}

function options(email?: string): IDetailOptions<Contact> {
  return {
    key: 'email',
    item:
      email === undefined ? undefined : Object.assign(new Contact(), { email }),
    options: { type: FieldType.email },
  };
}

describe('@smartsoft001/react: SmartDetailEmail', () => {
  it('should render a mailto link with the value', () => {
    const { container } = render(
      <SmartDetailEmail options={options('a@b.c')} />,
    );
    const link = container.querySelector('a');

    expect([link?.getAttribute('href'), link?.textContent]).toEqual([
      'mailto:a@b.c',
      'a@b.c',
    ]);
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailEmail options={options()} />);

    expect(container.querySelector('a')).toBeNull();
  });

  it('should append className to the link', () => {
    const { container } = render(
      <SmartDetailEmail
        options={options('a@b.c')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('a')).toHaveClass(
      'my-custom-class',
      'smart:text-indigo-600',
    );
  });
});

describe('@smartsoft001/react: SmartDetailEmailPreset', () => {
  it('should render a mailto link with the value', () => {
    const { container } = render(
      <SmartDetailEmailPreset options={options('user@example.com')} />,
    );
    const link = container.querySelector('[data-role="link"]');

    expect([link?.getAttribute('href'), link?.textContent]).toEqual([
      'mailto:user@example.com',
      'user@example.com',
    ]);
  });

  it('should render the envelope icon hidden from assistive technology', () => {
    const { container } = render(
      <SmartDetailEmailPreset options={options('user@example.com')} />,
    );

    expect(container.querySelector('[data-role="icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should apply the blue link classes', () => {
    const { container } = render(
      <SmartDetailEmailPreset options={options('user@example.com')} />,
    );

    expect(container.querySelector('[data-role="link"]')).toHaveClass(
      'smart:text-blue-600',
      'smart:hover:underline',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailEmailPreset options={options()} />,
    );

    expect(container.querySelector('[data-role="link"]')).toBeNull();
  });

  it('should append className to the link', () => {
    const { container } = render(
      <SmartDetailEmailPreset
        options={options('user@example.com')}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="link"]')).toHaveClass(
      'my-custom-class',
      'smart:text-blue-600',
    );
  });
});
