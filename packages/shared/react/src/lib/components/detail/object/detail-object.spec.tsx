import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailObject } from './detail-object';
import { SmartDetailObjectPreset } from './preset/detail-object-preset';
import { IDetailOptions, IDetailsOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';

@Model({})
class Headquarters implements IEntity<string> {
  id = 'hq-1';

  @Field({ type: FieldType.text, details: true })
  city = 'Warszawa';
}

@Model({})
class Company implements IEntity<string> {
  id = 'company-1';

  @Field({ type: FieldType.object, classType: Headquarters, details: true })
  headquarters: Headquarters | null = new Headquarters();
}

function options(item?: Company): IDetailOptions<Company> {
  return { key: 'headquarters', item, options: { type: FieldType.object } };
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

beforeEach(() => {
  received.length = 0;
});

describe('@smartsoft001/react: SmartDetailObject', () => {
  it('should render the details of the nested object in a wrapper', () => {
    const { container } = render(
      withMockDetails(<SmartDetailObject options={options(new Company())} />),
    );
    const wrapper = container.querySelector('div');

    expect(wrapper).toHaveClass('smart:mt-2', 'smart:block');
    expect(wrapper?.querySelector('.mock-details')).toBeInTheDocument();
  });

  it('should pass the nested object and its class to the details', () => {
    const company = new Company();

    render(withMockDetails(<SmartDetailObject options={options(company)} />));

    expect(received.at(-1)).toEqual({
      type: Headquarters,
      item: company.headquarters,
    });
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      withMockDetails(<SmartDetailObject options={options()} />),
    );

    expect(container.querySelector('div')).toBeNull();
  });

  it('should append className to the wrapper', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailObject
          options={options(new Company())}
          className="my-custom-class"
        />,
      ),
    );

    expect(container.querySelector('div')).toHaveClass(
      'my-custom-class',
      'smart:mt-2',
    );
  });

  it('should render the fields of the nested model with the default details', () => {
    render(
      <SmartProvider translations={{ MODEL: { city: 'City' } }}>
        <SmartDetailObject options={options(new Company())} />
      </SmartProvider>,
    );

    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Warszawa')).toBeInTheDocument();
  });
});

describe('@smartsoft001/react: SmartDetailObjectPreset', () => {
  it('should render the nested details inside a card', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailObjectPreset options={options(new Company())} />,
      ),
    );
    const card = container.querySelector('[data-role="object"]');

    expect(card?.querySelector('.mock-details')).toBeInTheDocument();
  });

  it('should apply the card classes with their dark mode twins', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailObjectPreset options={options(new Company())} />,
      ),
    );

    expect(container.querySelector('[data-role="object"]')).toHaveClass(
      'smart:rounded-lg',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
    );
  });

  it('should render a placeholder when there is no item', () => {
    const { container } = render(
      withMockDetails(<SmartDetailObjectPreset options={options()} />),
    );

    expect([
      container.querySelector('[data-role="object"]'),
      container.querySelector('[data-role="empty"]')?.textContent,
    ]).toEqual([null, '—']);
  });

  it('should render a placeholder when the nested object is empty', () => {
    const company = Object.assign(new Company(), { headquarters: null });

    const { container } = render(
      withMockDetails(<SmartDetailObjectPreset options={options(company)} />),
    );

    expect(container.querySelector('[data-role="empty"]')).toBeInTheDocument();
  });

  it('should append className to the card', () => {
    const { container } = render(
      withMockDetails(
        <SmartDetailObjectPreset
          options={options(new Company())}
          className="my-custom-class"
        />,
      ),
    );

    expect(container.querySelector('[data-role="object"]')).toHaveClass(
      'my-custom-class',
      'smart:rounded-lg',
    );
  });
});
