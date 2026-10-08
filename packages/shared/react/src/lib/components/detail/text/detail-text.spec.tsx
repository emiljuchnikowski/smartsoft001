import { render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailText } from './detail-text';
import { SmartDetailTextPreset } from './preset/detail-text-preset';
import { IDetailOptions } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { trustHtml } from '../../../utils/html';

@Model({})
class Product {
  @Field({ type: FieldType.text, details: true })
  name = '';
}

function product(name: string): Product {
  return Object.assign(new Product(), { name });
}

function options(
  item: Product | undefined,
  extra: Partial<IDetailOptions<Product>> = {},
): IDetailOptions<Product> {
  return { key: 'name', item, options: { type: FieldType.text }, ...extra };
}

describe('@smartsoft001/react: SmartDetailText', () => {
  it('should render a <p> with the value of the item', () => {
    const { container } = render(
      <SmartDetailText options={options(product('Hello World'))} />,
    );

    expect(container.querySelector('p')).toHaveTextContent('Hello World');
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailText options={options(undefined)} />,
    );

    expect(container.querySelector('p')).toBeNull();
  });

  it('should append className to the <p>', () => {
    const { container } = render(
      <SmartDetailText
        options={options(product('Hello'))}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('p')).toHaveClass(
      'my-custom-class',
      'smart:text-sm',
    );
  });

  it('should render the value of the cell pipe', () => {
    const cellPipe = { transform: () => 'Formatted' };

    const { container } = render(
      <SmartDetailText options={options(product('Raw'), { cellPipe })} />,
    );

    expect(container.querySelector('p')).toHaveTextContent('Formatted');
  });

  it('should translate a string value', () => {
    const { container } = render(
      <SmartProvider translations={{ draft: 'Szkic' }}>
        <SmartDetailText options={options(product('draft'))} />
      </SmartProvider>,
    );

    expect(container.querySelector('p')).toHaveTextContent('Szkic');
  });
});

describe('@smartsoft001/react: SmartDetailTextPreset', () => {
  it('should render the plain text value', () => {
    const { container } = render(
      <SmartDetailTextPreset options={options(product('Hello World'))} />,
    );

    expect(container.querySelector('[data-role="text"]')).toHaveTextContent(
      'Hello World',
    );
  });

  it('should render the html markup of the value', () => {
    const { container } = render(
      <SmartDetailTextPreset options={options(product('<b>Bold</b> text'))} />,
    );
    const text = container.querySelector('[data-role="text"]');

    expect([text?.querySelector('b')?.textContent, text?.textContent]).toEqual([
      'Bold',
      'Bold text',
    ]);
  });

  it('should strip event handlers and scripts from the value', () => {
    const { container } = render(
      <SmartDetailTextPreset
        options={options(
          product(
            '<img src="x" onerror="void(0)"><script>void(0)</script><b>Product</b>',
          ),
        )}
      />,
    );
    const text = container.querySelector('[data-role="text"]');

    expect([
      text?.querySelector('[onerror]'),
      text?.querySelector('script'),
      text?.querySelector('b')?.textContent,
    ]).toEqual([null, null, 'Product']);
  });

  it('should sanitise the html returned by a cell pipe', () => {
    const cellPipe = {
      transform: () => '<a href="javascript:void(0)">Product</a>',
    };

    const { container } = render(
      <SmartDetailTextPreset options={options(product('Raw'), { cellPipe })} />,
    );
    const link = container.querySelector('[data-role="text"] a');

    expect([link?.textContent, link?.getAttribute('href') ?? '']).toEqual([
      'Product',
      expect.not.stringMatching(/^\s*javascript:/i),
    ]);
  });

  it('should render trusted html from a cell pipe as is', () => {
    const cellPipe = {
      transform: () =>
        trustHtml(
          '<span style="color: red">Trusted</span>',
        ) as unknown as string,
    };

    const { container } = render(
      <SmartDetailTextPreset options={options(product('Raw'), { cellPipe })} />,
    );

    expect(
      container.querySelector('[data-role="text"] span[style]'),
    ).toHaveTextContent('Trusted');
  });

  it('should render an em dash placeholder for an empty value', () => {
    const { container } = render(
      <SmartDetailTextPreset options={options(product(''))} />,
    );
    const empty = container.querySelector('[data-role="empty"]');

    expect(empty).toHaveTextContent('—');
    expect(empty).toHaveClass('smart:text-gray-400');
  });

  it('should render nothing when there is no item', () => {
    const { container } = render(
      <SmartDetailTextPreset options={options(undefined)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should apply the preset typography classes', () => {
    const { container } = render(
      <SmartDetailTextPreset options={options(product('Hello World'))} />,
    );

    expect(container.querySelector('[data-role="text"]')).toHaveClass(
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:text-pretty',
    );
  });

  it('should append className to the text element', () => {
    const { container } = render(
      <SmartDetailTextPreset
        options={options(product('Hello World'))}
        className="my-custom-class"
      />,
    );

    expect(container.querySelector('[data-role="text"]')).toHaveClass(
      'my-custom-class',
      'smart:text-sm',
    );
  });
});
