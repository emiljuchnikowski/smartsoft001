import { sanitizeHtml, toInnerHtml, trustHtml } from './html';

function parse(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

describe('@smartsoft001/react: sanitizeHtml', () => {
  it('should remove event handlers and keep the formatting', () => {
    const root = parse(
      sanitizeHtml('<img src="x" onerror="void(0)"><b>Product</b>'),
    );

    expect([
      root.querySelector('[onerror]'),
      root.querySelector('b')?.textContent,
    ]).toEqual([null, 'Product']);
  });

  it.each([
    [
      'SVG',
      '<svg onload="void(0)"><text>Product</text></svg>',
      'svg, [onload]',
    ],
    ['iframe', '<iframe srcdoc="<p>Untrusted</p>"></iframe>', 'iframe'],
    ['script', '<script>void(0)</script><b>Product</b>', 'script'],
    ['inline style', '<p style="color:red">Text</p>', '[style]'],
  ])('should remove %s', (_label, html, selector) => {
    const root = parse(sanitizeHtml(html));

    expect(root.querySelector(selector)).toBeNull();
  });

  it('should neutralise a javascript link and keep its text', () => {
    const root = parse(
      sanitizeHtml('<a href="javascript:void(0)">Product</a>'),
    );
    const link = root.querySelector('a');

    expect([link?.textContent, link?.getAttribute('href') ?? '']).toEqual([
      'Product',
      expect.not.stringMatching(/^\s*javascript:/i),
    ]);
  });

  it('should keep an HTTPS link', () => {
    const root = parse(sanitizeHtml('<a href="https://example.com/p">P</a>'));

    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      'https://example.com/p',
    );
  });

  it('should return an empty string for nothing', () => {
    expect(sanitizeHtml(null)).toBe('');
  });
});

describe('@smartsoft001/react: toInnerHtml', () => {
  it('should sanitise an untrusted value', () => {
    expect(toInnerHtml('<script>x</script>ok').__html).toBe('ok');
  });

  it('should pass trusted HTML through', () => {
    expect(toInnerHtml(trustHtml('<script>x</script>')).__html).toBe(
      '<script>x</script>',
    );
  });
});
