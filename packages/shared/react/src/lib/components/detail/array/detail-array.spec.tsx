import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailArray } from './detail-array';
import { SmartDetailArrayPreset } from './preset/detail-array-preset';
import { IDetailOptions, IDetailsOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';

@Model({})
class OrderLine implements IEntity<string> {
  id = '';

  @Field({ type: FieldType.text, details: true })
  product = '';
}

@Model({})
class Order implements IEntity<string> {
  id = 'order-1';

  @Field({ type: FieldType.array, classType: OrderLine, details: true })
  lines: OrderLine[] = [];
}

function line(id: string, product: string): OrderLine {
  return Object.assign(new OrderLine(), { id, product });
}

function order(lines: OrderLine[]): Order {
  return Object.assign(new Order(), { lines });
}

function options(item?: Order): IDetailOptions<Order> {
  return { key: 'lines', item, options: { type: FieldType.array } };
}

const received: Array<IDetailsOptions<any> | undefined> = [];

function MockDetails({ options }: { options?: IDetailsOptions<any> }) {
  received.push(options);

  return <div className="mock-details">mock</div>;
}

const COMPONENTS = { details: MockDetails };

function withMockDetails(children: ReactNode) {
  return <SmartProvider components={COMPONENTS}>{children}</SmartProvider>;
}

const LINES = [line('a', 'Pen'), line('b', 'Ink')];

beforeEach(() => {
  received.length = 0;
});

describe('@smartsoft001/react: SmartDetailArray', () => {
  it('should render the details of every element in a wrapper', () => {
    const { container } = render(
      withMockDetails(<SmartDetailArray options={options(order(LINES))} />),
    );
    const wrapper = container.querySelector('div');

    expect(wrapper).toHaveClass('smart:mt-2', 'smart:space-y-2');
    expect(container.querySelectorAll('.mock-details')).toHaveLength(2);
  });

  it('should pass each element and its class to the details', () => {
    render(
      withMockDetails(<SmartDetailArray options={options(order(LINES))} />),
    );

    expect(received.slice(-2)).toEqual([
      { type: OrderLine, item: LINES[0] },
      { type: OrderLine, item: LINES[1] },
    ]);
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      withMockDetails(<SmartDetailArray options={options()} />),
    );

    expect(container.querySelector('div')).toBeNull();
  });

  it('should render nothing for an empty array', () => {
    const { container } = render(
      withMockDetails(<SmartDetailArray options={options(order([]))} />),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should append className to the wrapper', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailArray
          options={options(order(LINES))}
          className="my-custom-class"
        />,
      ),
    );

    expect(container.querySelector('div')).toHaveClass(
      'my-custom-class',
      'smart:mt-2',
    );
  });

  it('should render the fields of every element with the default details', () => {
    render(<SmartDetailArray options={options(order(LINES))} />);

    expect([
      screen.getByText('Pen').tagName,
      screen.getByText('Ink').tagName,
    ]).toEqual(['P', 'P']);
  });
});

describe('@smartsoft001/react: SmartDetailArrayPreset', () => {
  it('should render a card per element', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailArrayPreset options={options(order(LINES))} />,
      ),
    );

    expect([
      container.querySelectorAll('[data-role="item"]').length,
      container.querySelectorAll('[data-role="item"] .mock-details').length,
    ]).toEqual([2, 2]);
  });

  it('should render the placeholder for an empty array', () => {
    const { container } = render(
      withMockDetails(<SmartDetailArrayPreset options={options(order([]))} />),
    );
    const empty = container.querySelector('[data-role="empty"]');

    expect(empty).toHaveTextContent('—');
    expect(empty).toHaveClass('smart:text-gray-400');
    expect(container.querySelector('[data-role="item"]')).toBeNull();
  });

  it('should render the placeholder when there is no item', () => {
    const { container } = render(
      withMockDetails(<SmartDetailArrayPreset options={options()} />),
    );

    expect(container.querySelector('[data-role="empty"]')).toBeInTheDocument();
  });

  it('should apply the card stack classes with their dark mode twins', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailArrayPreset options={options(order(LINES))} />,
      ),
    );

    expect(container.querySelector('[data-role="array"]')).toHaveClass(
      'smart:space-y-2',
    );
    expect(container.querySelector('[data-role="item"]')).toHaveClass(
      'smart:rounded-lg',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
    );
  });

  it('should append className to the stack', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailArrayPreset
          options={options(order(LINES))}
          className="my-custom-class"
        />,
      ),
    );

    expect(container.querySelector('[data-role="array"]')).toHaveClass(
      'my-custom-class',
      'smart:space-y-2',
    );
  });
});
