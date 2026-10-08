import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailDateRange } from './detail-date-range';
import { SmartDetailDateRangePreset } from './preset/detail-date-range-preset';
import { IDetailOptions } from '../../../models';

interface Range {
  start: string;
  end: string;
}

@Model({})
class Campaign {
  @Field({ type: FieldType.dateRange, details: true })
  period: Range | undefined = undefined;
}

const RANGE: Range = { start: '2026-01-01', end: '2026-01-31' };

function options(values?: Partial<Campaign>): IDetailOptions<Campaign> {
  return {
    key: 'period',
    item: values && Object.assign(new Campaign(), values),
    options: { type: FieldType.dateRange },
  };
}

describe('@smartsoft001/react: SmartDetailDateRange', () => {
  it('should render the start and the end of the range', () => {
    const { container } = render(
      <SmartDetailDateRange options={options({ period: RANGE })} />,
    );

    expect(container.querySelector('p')).toHaveTextContent(
      '2026-01-01 – 2026-01-31',
    );
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(<SmartDetailDateRange options={options()} />);

    expect(container.querySelector('p')).toBeNull();
  });

  it('should render nothing when the range is empty', () => {
    const { container } = render(
      <SmartDetailDateRange options={options({ period: undefined })} />,
    );

    expect(container.querySelector('p')).toBeNull();
  });

  it('should append className to the <p>', () => {
    const { container } = render(
      <SmartDetailDateRange
        options={options({ period: RANGE })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('p')).toHaveClass(
      'my-custom-class',
      'smart:text-sm',
    );
  });
});

describe('@smartsoft001/react: SmartDetailDateRangePreset', () => {
  it('should render the start and the end as two chips', () => {
    const { container } = render(
      <SmartDetailDateRangePreset options={options({ period: RANGE })} />,
    );
    const start = container.querySelector('[data-role="start"]');
    const end = container.querySelector('[data-role="end"]');

    expect([start?.textContent, end?.textContent]).toEqual([
      '2026-01-01',
      '2026-01-31',
    ]);
    expect(start).toHaveClass('smart:bg-gray-100');
    expect(end).toHaveClass('smart:bg-gray-100');
  });

  it('should render nothing when the range is empty', () => {
    const { container } = render(
      <SmartDetailDateRangePreset options={options({ period: undefined })} />,
    );

    expect(container.querySelector('[data-role="range"]')).toBeNull();
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailDateRangePreset options={options()} />,
    );

    expect(container.querySelector('[data-role="range"]')).toBeNull();
  });

  it('should append className to the container', () => {
    const { container } = render(
      <SmartDetailDateRangePreset
        options={options({ period: RANGE })}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="range"]')).toHaveClass(
      'my-custom-class',
      'smart:inline-flex',
    );
  });
});
