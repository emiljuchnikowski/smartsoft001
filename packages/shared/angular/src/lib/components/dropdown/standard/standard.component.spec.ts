import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownStandardComponent } from './standard.component';
import { IDropdownItem } from '../../../models';

describe('@smartsoft001/shared-angular: DropdownStandardComponent', () => {
  let fixture: ComponentFixture<DropdownStandardComponent>;
  let component: DropdownStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a trigger button with triggerLabel text', () => {
    fixture.componentRef.setInput('triggerLabel', 'Open menu');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      'button.smart-dropdown-trigger',
    );

    expect(trigger).toBeTruthy();
    expect(trigger.textContent.trim()).toBe('Open menu');
  });

  it('should not render the menu list when open is false', () => {
    const ul = fixture.nativeElement.querySelector('ul[role="menu"]');

    expect(ul).toBeNull();
  });

  it('should render the menu list when open is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const ul = fixture.nativeElement.querySelector('ul[role="menu"]');

    expect(ul).toBeTruthy();
  });

  it('should toggle open when the trigger is clicked', () => {
    const trigger = fixture.nativeElement.querySelector(
      'button.smart-dropdown-trigger',
    );

    trigger.click();
    fixture.detectChanges();

    expect(component.open()).toBe(true);

    trigger.click();
    fixture.detectChanges();

    expect(component.open()).toBe(false);
  });

  it('should reflect open() in aria-expanded on the trigger', () => {
    const trigger = fixture.nativeElement.querySelector(
      'button.smart-dropdown-trigger',
    );

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should render items as menuitem buttons when open', () => {
    const items: IDropdownItem[] = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const menuitems = fixture.nativeElement.querySelectorAll(
      'li[role="menuitem"] button',
    );

    expect(menuitems.length).toBe(2);
    expect(menuitems[0].textContent.trim()).toBe('Alpha');
    expect(menuitems[1].textContent.trim()).toBe('Beta');
  });

  it('should render divider items as li[role=separator]', () => {
    const items: IDropdownItem[] = [
      { id: 'a', label: 'Alpha' },
      { id: 'sep', label: '', divider: true },
      { id: 'b', label: 'Beta' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const separators = fixture.nativeElement.querySelectorAll(
      'li[role="separator"]',
    );

    expect(separators.length).toBe(1);
  });

  it('should emit selectedItem and close when an item is clicked', () => {
    const items: IDropdownItem[] = [{ id: 'a', label: 'Alpha' }];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let emitted: { itemId: string } | null = null;
    component.selectedItem.subscribe((event) => (emitted = event));

    const button = fixture.nativeElement.querySelector(
      'li[role="menuitem"] button',
    );
    button.click();
    fixture.detectChanges();

    expect(emitted).toEqual({ itemId: 'a' });
    expect(component.open()).toBe(false);
  });

  it('should render headerLabel when variant is with-header', () => {
    fixture.componentRef.setInput('options', {
      variant: 'with-header',
      headerLabel: 'My Menu',
    });
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector(
      'li.smart-dropdown-header',
    );

    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('My Menu');
  });

  it('should set disabled attribute on disabled items', () => {
    const items: IDropdownItem[] = [
      { id: 'a', label: 'Alpha', disabled: true },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'li[role="menuitem"] button',
    );

    expect(button.disabled).toBe(true);
  });

  it('should apply cssClass to the host wrapper div', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('div');

    expect(wrapper.className).toContain('my-extra-class');
  });
});
