import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FieldType } from '@smartsoft001/models';

import { DetailTextComponent } from './text.component';

describe('@smartsoft001/shared-angular: DetailTextComponent HTML safety', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTextComponent, TranslateModule.forRoot()],
    }).compileComponents();
  });

  function render(value: string, formatted = false) {
    const fixture = TestBed.createComponent(DetailTextComponent);
    const item = signal({ name: formatted ? 'Raw value' : value });
    fixture.componentRef.setInput('options', {
      key: 'name',
      item,
      options: { type: FieldType.text },
      ...(formatted ? { cellPipe: { transform: () => value } } : {}),
    });
    fixture.detectChanges();
    return { fixture, item, root: fixture.nativeElement as HTMLElement };
  }

  it.each([false, true])(
    'removes event handlers (custom formatter: %s)',
    (formatted) => {
      const { root } = render(
        '<img src="x" onerror="void(0)"><b>Product</b>',
        formatted,
      );

      expect(root.querySelector('[onerror]')).toBeNull();
      expect(root.querySelector('b')?.textContent).toBe('Product');
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
  ])('removes active %s content', (_label, value, selector) => {
    const { root } = render(value);

    expect(root.querySelector(selector)).toBeNull();
  });

  it('neutralizes javascript links while preserving their text', () => {
    const { root } = render('<a href="javascript:void(0)">Product</a>');
    const link = root.querySelector('a');

    expect(link?.textContent).toBe('Product');
    expect(link?.getAttribute('href')).not.toMatch(/^\s*javascript:/i);
  });

  it('keeps supported formatting and HTTPS links', () => {
    const { root } = render(
      '<b>Bold</b> <em>Emphasis</em> <a href="https://example.com/product">Product</a>',
    );

    expect(root.querySelector('b')?.textContent).toBe('Bold');
    expect(root.querySelector('em')?.textContent).toBe('Emphasis');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      'https://example.com/product',
    );
  });

  it('sanitizes subsequent signal updates too', () => {
    const { fixture, item, root } = render('Initial value');
    item.set({ name: '<img src="x" onerror="void(0)"><b>Updated</b>' });
    fixture.detectChanges();

    expect(root.querySelector('[onerror]')).toBeNull();
    expect(root.querySelector('b')?.textContent).toBe('Updated');
  });
});
