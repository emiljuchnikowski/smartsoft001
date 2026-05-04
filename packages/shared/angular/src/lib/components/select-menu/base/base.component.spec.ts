import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuBaseComponent, SelectMenuValue } from './base.component';
import { ISelectMenuOptions } from '../../../models';

@Component({
  selector: 'smart-test-select-menu',
  template: '',
})
class TestSelectMenuComponent extends SelectMenuBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-select-menu
    [(value)]="value"
    [disabled]="disabled"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestSelectMenuComponent],
})
class TestHostComponent {
  value: SelectMenuValue = null;
  disabled = false;
  options: ISelectMenuOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: SelectMenuBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestSelectMenuComponent;

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
    expect(directive).toBeInstanceOf(SelectMenuBaseComponent);
  });

  it('should have smartType static equal to "select-menu"', () => {
    expect(SelectMenuBaseComponent.smartType).toBe('select-menu');
  });

  it('should default value to null', () => {
    expect(directive.value()).toBeNull();
  });

  it('should default disabled to false', () => {
    expect(directive.disabled()).toBe(false);
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should set value via select() when not disabled', () => {
    directive.select('apple');

    expect(directive.value()).toBe('apple');
  });

  it('should NOT set value via select() when disabled', async () => {
    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    directive.select('apple');

    expect(directive.value()).toBeNull();
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept ISelectMenuOptions via options input', async () => {
    host.options = {
      placeholder: 'Pick one',
      items: [{ value: 'a', label: 'A' }],
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      placeholder: 'Pick one',
      items: [{ value: 'a', label: 'A' }],
    });
  });
});
