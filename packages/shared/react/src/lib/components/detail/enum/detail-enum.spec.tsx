import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailEnum } from './detail-enum';
import { SmartDetailEnumPreset } from './preset/detail-enum-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';

@Model({})
class Account {
  @Field({ type: FieldType.enum, details: true })
  status: string | null = null;

  @Field({ type: FieldType.enum, details: true })
  roles: string[] = [];
}

function options(
  key: 'status' | 'roles',
  values?: Partial<Account>,
): IDetailOptions<Account> {
  return {
    key,
    item: values && Object.assign(new Account(), values),
    options: { type: FieldType.enum },
  };
}

describe('@smartsoft001/react: SmartDetailEnum', () => {
  it('should render a <p> with the value', () => {
    const { container } = render(
      <SmartDetailEnum options={options('status', { status: 'active' })} />,
    );

    expect(container.querySelector('p')).toHaveTextContent('active');
  });

  it('should join several values with a comma', () => {
    const { container } = render(
      <SmartDetailEnum
        options={options('roles', { roles: ['alpha', 'beta'] })}
      />,
    );

    expect(container.querySelector('p')?.textContent).toBe('alpha,\u00a0beta');
  });

  it('should translate the values', () => {
    const { container } = render(
      <SmartProvider translations={{ active: 'Aktywny' }}>
        <SmartDetailEnum options={options('status', { status: 'active' })} />
      </SmartProvider>,
    );

    expect(container.querySelector('p')).toHaveTextContent('Aktywny');
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailEnum options={options('status')} />,
    );

    expect(container.querySelector('p')).toBeNull();
  });

  it('should append className to the <p>', () => {
    const { container } = render(
      <SmartDetailEnum
        options={options('status', { status: 'active' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('p')).toHaveClass(
      'my-custom-class',
      'smart:text-sm',
    );
  });
});

describe('@smartsoft001/react: SmartDetailEnumPreset', () => {
  it('should render one badge for a single value', () => {
    const { container } = render(
      <SmartDetailEnumPreset
        options={options('status', { status: 'active' })}
      />,
    );
    const badges = container.querySelectorAll('[data-role="badge"]');

    expect([badges.length, badges[0]?.textContent]).toEqual([1, 'active']);
  });

  it('should render a badge per value of an array', () => {
    const { container } = render(
      <SmartDetailEnumPreset
        options={options('roles', { roles: ['alpha', 'beta', 'gamma'] })}
      />,
    );

    expect(container.querySelectorAll('[data-role="badge"]')).toHaveLength(3);
  });

  it('should apply the soft blue badge classes', () => {
    const { container } = render(
      <SmartDetailEnumPreset
        options={options('status', { status: 'active' })}
      />,
    );

    expect(container.querySelector('[data-role="badge"]')).toHaveClass(
      'smart:bg-blue-100',
      'smart:text-blue-800',
    );
  });

  it('should translate the values', () => {
    const { container } = render(
      <SmartProvider translations={{ active: 'Aktywny' }}>
        <SmartDetailEnumPreset
          options={options('status', { status: 'active' })}
        />
      </SmartProvider>,
    );

    expect(container.querySelector('[data-role="badge"]')).toHaveTextContent(
      'Aktywny',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailEnumPreset options={options('status')} />,
    );

    expect(container.querySelector('[data-role="badges"]')).toBeNull();
  });

  it('should append className to the badges container', () => {
    const { container } = render(
      <SmartDetailEnumPreset
        options={options('status', { status: 'active' })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="badges"]')).toHaveClass(
      'my-custom-class',
      'smart:flex',
    );
  });
});
