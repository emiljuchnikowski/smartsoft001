import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPresetComponent } from './preset.component';
import { ITabItem } from '../../../models';

describe('@smartsoft001/shared-angular: TabsPresetComponent', () => {
  let fixture: ComponentFixture<TabsPresetComponent>;
  let component: TabsPresetComponent;

  const items: ITabItem[] = [
    { id: 'a', label: 'Tab A' },
    { id: 'b', label: 'Tab B' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', { items });
    fixture.detectChanges();
  });

  function tabs(): HTMLButtonElement[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        'nav [role="tab"]',
      ),
    ) as HTMLButtonElement[];
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(TabsPresetComponent);
  });

  it('should render a tablist nav', () => {
    const nav = (fixture.nativeElement as HTMLElement).querySelector(
      'nav[role="tablist"]',
    );

    expect(nav).toBeTruthy();
  });

  it('should render a tab trigger per item with its label', () => {
    const rendered = tabs();

    expect(rendered.length).toBe(2);
    expect(rendered[0].textContent?.trim()).toContain('Tab A');
    expect(rendered[1].textContent?.trim()).toContain('Tab B');
  });

  it('should select the first tab by default', () => {
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
  });

  it('should apply underline active classes to the current tab', () => {
    const cls = tabs()[0].className;

    expect(cls).toContain('smart:text-blue-600');
    expect(cls).toContain('smart:after:bg-blue-600');
  });

  it('should select a tab on click and emit tabChange', () => {
    let emitted: string | undefined;
    component.tabChange.subscribe((e) => (emitted = e.tabId));

    tabs()[1].click();
    fixture.detectChanges();

    expect(emitted).toBe('b');
    expect(component.selectedId()).toBe('b');
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should apply brand pill active classes for the pills-with-brand-color layout', () => {
    fixture.componentRef.setInput('options', {
      items,
      layout: 'pills-with-brand-color',
    });
    fixture.componentRef.setInput('selectedId', 'a');
    fixture.detectChanges();

    const cls = tabs()[0].className;

    expect(cls).toContain('smart:bg-blue-600');
    expect(cls).toContain('smart:text-white');
    expect(cls).toContain('smart:rounded-lg');
  });

  it('should render a count badge for items with a badge', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Tab A', badge: '99+' }],
      layout: 'underline-with-badges',
    });
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      'nav [role="tab"] span',
    );

    expect(badge?.textContent?.trim()).toBe('99+');
  });

  it('should render an anchor when the item has an href', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Tab A', href: '#a' }],
    });
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'nav a[role="tab"]',
    );

    expect(link).toBeTruthy();
    expect((link as HTMLAnchorElement).getAttribute('href')).toBe('#a');
  });

  it('should apply cssClass on the host root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const root = (fixture.nativeElement as HTMLElement).querySelector('div');

    expect(root?.className).toContain('my-extra-class');
  });
});
