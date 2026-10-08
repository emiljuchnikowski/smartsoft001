import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailFlag } from './detail-flag';
import { SmartDetailFlagPreset } from './preset/detail-flag-preset';
import { IDetailOptions } from '../../../models';

@Model({})
class Account {
  @Field({ type: FieldType.flag, details: true })
  active = false;
}

function options(active?: boolean): IDetailOptions<Account> {
  return {
    key: 'active',
    item:
      active === undefined
        ? undefined
        : Object.assign(new Account(), { active }),
    options: { type: FieldType.flag },
  };
}

describe('@smartsoft001/react: SmartDetailFlag', () => {
  it('should render the green check icon when the flag is set', () => {
    const { container } = render(<SmartDetailFlag options={options(true)} />);

    expect(container.querySelector('span > svg')).toHaveClass(
      'smart:text-green-500',
    );
  });

  it('should render the gray x-mark icon when the flag is not set', () => {
    const { container } = render(<SmartDetailFlag options={options(false)} />);

    expect(container.querySelector('span > svg')).toHaveClass(
      'smart:text-gray-400',
    );
  });

  it('should hide the icon from assistive technology', () => {
    const { container } = render(<SmartDetailFlag options={options(true)} />);

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailFlag options={options()} />);

    expect(container.querySelector('span')).toBeNull();
  });

  it('should append className to the <span>', () => {
    const { container } = render(
      <SmartDetailFlag options={options(true)} className="my-custom-class" />,
    );

    expect(container.querySelector('span')).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});

describe('@smartsoft001/react: SmartDetailFlagPreset', () => {
  it('should render a soft green check badge when the flag is set', () => {
    const { container } = render(
      <SmartDetailFlagPreset options={options(true)} />,
    );
    const badge = container.querySelector('[data-role="badge"]');

    expect([badge?.textContent, badge?.className]).toEqual([
      '✓',
      expect.stringContaining('smart:bg-green-100'),
    ]);
  });

  it('should render a soft red x badge when the flag is not set', () => {
    const { container } = render(
      <SmartDetailFlagPreset options={options(false)} />,
    );
    const badge = container.querySelector('[data-role="badge"]');

    expect([badge?.textContent, badge?.className]).toEqual([
      '✗',
      expect.stringContaining('smart:bg-red-100'),
    ]);
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailFlagPreset options={options()} />);

    expect(container.querySelector('[data-role="badge"]')).toBeNull();
  });

  it('should append className to the badge', () => {
    const { container } = render(
      <SmartDetailFlagPreset
        options={options(true)}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="badge"]')).toHaveClass(
      'my-custom-class',
      'smart:bg-green-100',
    );
  });
});
