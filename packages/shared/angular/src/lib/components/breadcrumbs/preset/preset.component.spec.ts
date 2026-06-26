import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsPresetComponent } from './preset.component';
import { IBreadcrumbsOptions } from '../../../models';

describe('@smartsoft001/shared-angular: BreadcrumbsPresetComponent', () => {
  let fixture: ComponentFixture<BreadcrumbsPresetComponent>;
  let component: BreadcrumbsPresetComponent;

  const items: IBreadcrumbsOptions['items'] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'center', label: 'App Center', href: '#' },
    { id: 'app', label: 'Application', current: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', { items });
    fixture.detectChanges();
  });

  function nav(): HTMLElement {
    return fixture.nativeElement.querySelector('nav');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(BreadcrumbsPresetComponent);
  });

  it('should render one list item per crumb', () => {
    expect(nav().querySelectorAll('li').length).toBe(items.length);
  });

  it('should render links for non-current crumbs with a href', () => {
    const links = nav().querySelectorAll('a');

    expect(links.length).toBe(2);
    expect(links[0].textContent?.trim()).toContain('Home');
  });

  it('should render the current crumb as a non-link span with aria-current', () => {
    const current = nav().querySelector('[aria-current="page"]');

    expect(current?.tagName.toLowerCase()).toBe('span');
    expect(current?.textContent?.trim()).toContain('Application');
    expect(current?.className).toContain('smart:font-semibold');
  });

  it('should default to chevron separators (n - 1 of them)', () => {
    const separators = nav().querySelectorAll('ol > li > svg');

    expect(separators.length).toBe(items.length - 1);
    expect(separators[0].getAttribute('class')).toContain('smart:size-4');
  });

  it('should render slash separators when options.separator is slash', () => {
    fixture.componentRef.setInput('options', { items, separator: 'slash' });
    fixture.detectChanges();

    const separator = nav().querySelector('ol > li > svg');

    expect(separator?.getAttribute('class')).toContain('smart:size-5');
    expect(separator?.querySelector('path')?.getAttribute('d')).toBe(
      'M6 13L10 3',
    );
  });

  it('should render arrow separators when options.separator is arrow', () => {
    fixture.componentRef.setInput('options', { items, separator: 'arrow' });
    fixture.detectChanges();

    const separator = nav().querySelector('ol > li > svg');
    const paths = separator?.querySelectorAll('path');

    expect(paths?.length).toBe(2);
    expect(paths?.[0].getAttribute('d')).toBe('M5 12h14');
  });

  it('should derive slash separators from the simple-with-slashes layout', () => {
    fixture.componentRef.setInput('options', {
      items,
      layout: 'simple-with-slashes',
    });
    fixture.detectChanges();

    const separator = nav().querySelector('ol > li > svg');

    expect(separator?.getAttribute('class')).toContain('smart:size-5');
  });

  it('should apply contained layout wrapper classes', () => {
    fixture.componentRef.setInput('options', { items, layout: 'contained' });
    fixture.detectChanges();

    const cls = nav().className;

    expect(cls).toContain('smart:bg-gray-100');
    expect(cls).toContain('smart:rounded-lg');
  });

  it('should render a button (not a link) for crumbs without href and emit on click', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'first', label: 'First' }],
    });
    fixture.detectChanges();

    let emitted: string | undefined;
    component.itemClick.subscribe((e) => (emitted = e.itemId));

    nav().querySelector<HTMLButtonElement>('button')?.click();

    expect(emitted).toBe('first');
  });

  it('should use the provided aria-label', () => {
    fixture.componentRef.setInput('options', { items, ariaLabel: 'Path' });
    fixture.detectChanges();

    expect(nav().getAttribute('aria-label')).toBe('Path');
  });

  it('should apply cssClass on the nav (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(nav().className).toContain('my-extra-class');
  });
});
