import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationPresetComponent } from './preset.component';
import { IVerticalNavOptions } from '../../../models';

describe('@smartsoft001/shared-angular: VerticalNavigationPresetComponent', () => {
  let fixture: ComponentFixture<VerticalNavigationPresetComponent>;
  let component: VerticalNavigationPresetComponent;

  const options: IVerticalNavOptions = {
    items: [
      { id: 'a', label: 'Tab 1', href: '#a' },
      { id: 'b', label: 'Tab 2', href: '#b', current: true },
      { id: 'c', label: 'Tab 3' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavigationPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavigationPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  });

  function links(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a'));
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(VerticalNavigationPresetComponent);
  });

  it('should render an item per entry', () => {
    expect(links().length).toBe(2);
    expect(links()[0].textContent?.trim()).toContain('Tab 1');
  });

  it('should render a nav with the default aria-label', () => {
    const nav = fixture.nativeElement.querySelector('nav');

    expect(nav.getAttribute('aria-label')).toBe('Sidebar');
  });

  it('should apply active classes to the current item', () => {
    const active = links().find(
      (a) => a.getAttribute('aria-current') === 'page',
    );

    expect(active).toBeTruthy();
    expect(active?.className).toContain('smart:border-blue-600');
    expect(active?.className).toContain('smart:text-blue-600');
    expect(active?.className).toContain('smart:font-medium');
  });

  it('should apply inactive classes to non-current items', () => {
    const inactive = links().find(
      (a) => a.getAttribute('aria-current') !== 'page',
    );

    expect(inactive?.className).toContain('smart:border-transparent');
    expect(inactive?.className).toContain('smart:text-gray-500');
  });

  it('should render a button when the item has no href', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toContain('Tab 3');
  });

  it('should emit itemClick when a button item is clicked', () => {
    let emitted: { itemId: string } | undefined;
    component.itemClick.subscribe((e) => (emitted = e));

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual({ itemId: 'c' });
  });

  it('should render a badge when the item has one', () => {
    fixture.componentRef.setInput('options', {
      items: [{ id: 'a', label: 'Tab 1', href: '#a', badge: 5 }],
    });
    fixture.detectChanges();

    expect(links()[0].textContent).toContain('5');
  });

  it('should render a group title', () => {
    fixture.componentRef.setInput('options', {
      groups: [{ title: 'Section', items: [{ id: 'a', label: 'Tab 1' }] }],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Section');
  });

  it('should apply cssClass on the container (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');

    expect(container.className).toContain('my-extra-class');
  });
});
