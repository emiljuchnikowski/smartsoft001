import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownBaseComponent } from './base.component';
import { IDropdownItem, IDropdownOptions } from '../../../models';

@Component({
  selector: 'smart-test-dropdown',
  template: '',
})
class TestDropdownComponent extends DropdownBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-dropdown
    [items]="items"
    [triggerLabel]="triggerLabel"
    [(open)]="open"
    [options]="options"
    [class]="cssClass"
    (selectedItem)="onSelected($event)"
  />`,
  imports: [TestDropdownComponent],
})
class TestHostComponent {
  items: IDropdownItem[] = [];
  triggerLabel: string | undefined = undefined;
  open = false;
  options: IDropdownOptions | undefined = undefined;
  cssClass = '';
  selected: { itemId: string } | null = null;

  onSelected(event: { itemId: string }): void {
    this.selected = event;
  }
}

describe('@smartsoft001/shared-angular: DropdownBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestDropdownComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(DropdownBaseComponent);
  });

  it('should have smartType static equal to "dropdown"', () => {
    expect(DropdownBaseComponent.smartType).toBe('dropdown');
  });

  it('should default items to []', () => {
    expect(directive.items()).toEqual([]);
  });

  it('should default open to false', () => {
    expect(directive.open()).toBe(false);
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IDropdownOptions via options input', async () => {
    host.options = { variant: 'with-header', headerLabel: 'Menu' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      variant: 'with-header',
      headerLabel: 'Menu',
    });
  });

  it('should flip open from false to true on toggle()', () => {
    directive.open.set(false);

    directive.toggle();

    expect(directive.open()).toBe(true);
  });

  it('should flip open from true to false on toggle()', () => {
    directive.open.set(true);

    directive.toggle();

    expect(directive.open()).toBe(false);
  });

  it('should set open to false on close()', () => {
    directive.open.set(true);

    directive.close();

    expect(directive.open()).toBe(false);
  });

  it('should emit selectedItem and close on selectItem()', () => {
    directive.open.set(true);

    directive.selectItem('item-1');

    expect(host.selected).toEqual({ itemId: 'item-1' });
    expect(directive.open()).toBe(false);
  });
});
