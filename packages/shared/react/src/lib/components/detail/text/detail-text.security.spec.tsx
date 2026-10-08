import { act, render } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetailText } from './detail-text';
import { IDetailOptions } from '../../../models';

@Model({})
class Product {
  @Field({ type: FieldType.text, details: true })
  name = '';
}

function options(value: string, formatted: boolean): IDetailOptions<Product> {
  return {
    key: 'name',
    item: Object.assign(new Product(), {
      name: formatted ? 'Raw value' : value,
    }),
    options: { type: FieldType.text },
    ...(formatted ? { cellPipe: { transform: () => value } } : {}),
  };
}

function setup(value: string, formatted = false) {
  const view = render(<SmartDetailText options={options(value, formatted)} />);

  return { ...view, root: view.container };
}

describe('@smartsoft001/react: SmartDetailText HTML safety', () => {
  it.each([false, true])(
    'should remove event handlers (custom formatter: %s)',
    (formatted) => {
      const { root } = setup(
        '<img src="x" onerror="void(0)"><b>Product</b>',
        formatted,
      );

      expect([
        root.querySelector('[onerror]'),
        root.querySelector('b')?.textContent,
      ]).toEqual([null, 'Product']);
    },
  );

  it.each([
    [
      'SVG',
      '<svg onload="void(0)"><text>Product</text></svg>',
      'svg, [onload]',
    ],
    ['iframe', '<iframe srcdoc="<p>Untrusted</p>"></iframe>', 'iframe'],
    ['script', '<script>void(0)</script><b>Product</b>', 'script'],
  ])('should remove active %s content', (_label, value, selector) => {
    const { root } = setup(value);

    expect(root.querySelector(selector)).toBeNull();
  });

  it('should neutralise javascript links and keep their text', () => {
    const { root } = setup('<a href="javascript:void(0)">Product</a>');
    const link = root.querySelector('a');

    expect([link?.textContent, link?.getAttribute('href') ?? '']).toEqual([
      'Product',
      expect.not.stringMatching(/^\s*javascript:/i),
    ]);
  });

  it('should keep the supported formatting and HTTPS links', () => {
    const { root } = setup(
      '<b>Bold</b> <em>Emphasis</em> <a href="https://example.com/product">Product</a>',
    );

    expect([
      root.querySelector('b')?.textContent,
      root.querySelector('em')?.textContent,
      root.querySelector('a')?.getAttribute('href'),
    ]).toEqual(['Bold', 'Emphasis', 'https://example.com/product']);
  });

  it('should sanitise a changed item too', () => {
    const { root, rerender } = setup('Initial value');

    act(() => {
      rerender(
        <SmartDetailText
          options={options(
            '<img src="x" onerror="void(0)"><b>Updated</b>',
            false,
          )}
        />,
      );
    });

    expect([
      root.querySelector('[onerror]'),
      root.querySelector('b')?.textContent,
    ]).toEqual([null, 'Updated']);
  });
});
