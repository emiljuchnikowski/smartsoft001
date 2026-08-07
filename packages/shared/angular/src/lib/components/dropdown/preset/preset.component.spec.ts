import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPresetComponent } from './preset.component';
import { IDropdownItem } from '../../../models';

describe('@smartsoft001/shared-angular: DropdownPresetComponent', () => {
  let fixture: ComponentFixture<DropdownPresetComponent>;
  let component: DropdownPresetComponent;

  const items: IDropdownItem[] = [
    { id: 'a', label: 'Newsletter', icon: 'N' },
    { id: 'b', label: 'Purchases', icon: 'P' },
    { id: 'sep', label: '', divider: true },
    { id: 'c', label: 'Downloads', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownPresetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('triggerLabel', 'Actions');
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function trigger(): HTMLButtonElement {
    return host().querySelector('button') as HTMLButtonElement;
  }

  function menu(): HTMLElement | null {
    return host().querySelector('[role="menu"]');
  }

  it('should create an instance', () => {
    expect(component).toBeInstanceOf(DropdownPresetComponent);
  });

  it('should render the trigger label', () => {
    expect(trigger().textContent?.trim()).toContain('Actions');
  });

  it('should be closed by default with aria-expanded false', () => {
    expect(menu()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should open the menu on trigger click', () => {
    trigger().click();
    fixture.detectChanges();

    expect(menu()).toBeTruthy();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should toggle the menu closed on a second trigger click', () => {
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(menu()).toBeNull();
  });

  it('should render visible (non-divider) items as menuitems', () => {
    trigger().click();
    fixture.detectChanges();

    const menuItems = host().querySelectorAll('[role="menuitem"]');

    expect(menuItems.length).toBe(3);
  });

  it('should emit selectedItem and close when an item is clicked', () => {
    trigger().click();
    fixture.detectChanges();

    let emitted: { itemId: string } | undefined;
    component.selectedItem.subscribe((event) => (emitted = event));

    const first = host().querySelector(
      '[role="menuitem"]',
    ) as HTMLButtonElement;
    first.click();
    fixture.detectChanges();

    expect(emitted).toEqual({ itemId: 'a' });
    expect(menu()).toBeNull();
  });

  it('should disable items flagged as disabled', () => {
    trigger().click();
    fixture.detectChanges();

    const menuItems = host().querySelectorAll('[role="menuitem"]');
    const last = menuItems[menuItems.length - 1] as HTMLButtonElement;

    expect(last.disabled).toBe(true);
  });

  it('should default to the simple variant trigger (solid surface)', () => {
    expect(trigger().className).toContain('smart:bg-white');
    expect(trigger().className).toContain('smart:border');
  });

  it('should render a borderless trigger for the minimal variant', () => {
    fixture.componentRef.setInput('options', { variant: 'minimal' });
    fixture.detectChanges();

    expect(trigger().className).not.toContain('smart:bg-white');
  });

  it('should apply divide classes on the menu for the with-dividers variant', () => {
    fixture.componentRef.setInput('options', { variant: 'with-dividers' });
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(menu()?.className).toContain('smart:divide-y');
  });

  it('should split items into groups at dividers for with-dividers', () => {
    fixture.componentRef.setInput('options', { variant: 'with-dividers' });
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    const groups = menu()?.querySelectorAll('[data-role="group"]');

    expect(groups?.length).toBe(2);
  });

  it('should render item icons for the with-icons variant', () => {
    fixture.componentRef.setInput('options', { variant: 'with-icons' });
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    const firstItem = host().querySelector('[role="menuitem"]') as HTMLElement;

    expect(firstItem.querySelector('span')?.textContent?.trim()).toBe('N');
  });

  it('should render a header block for the with-header variant', () => {
    fixture.componentRef.setInput('options', {
      variant: 'with-header',
      headerLabel: 'james@site.com',
    });
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(menu()?.textContent).toContain('james@site.com');
  });

  it('should apply cssClass on the host container (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    const container = host().querySelector('div') as HTMLElement;

    expect(container.className).toContain('my-extra-class');
  });
});
