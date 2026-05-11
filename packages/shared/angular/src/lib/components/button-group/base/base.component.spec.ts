import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupBaseComponent } from './base.component';
import { IButtonGroupButton, IButtonGroupOptions } from '../../../models';

@Component({
  selector: 'smart-test-button-group',
  template: '',
})
class TestButtonGroupComponent extends ButtonGroupBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-button-group
    [buttons]="buttons"
    [options]="options"
    [(selected)]="selected"
    [class]="cssClass"
  />`,
  imports: [TestButtonGroupComponent],
})
class TestHostComponent {
  buttons: IButtonGroupButton[] = [];
  options: IButtonGroupOptions | undefined = undefined;
  selected: string | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ButtonGroupBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestButtonGroupComponent;

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
    expect(directive).toBeInstanceOf(ButtonGroupBaseComponent);
  });

  it('should have smartType static equal to "button-group"', () => {
    expect(ButtonGroupBaseComponent.smartType).toBe('button-group');
  });

  it('should default buttons to an empty array', () => {
    expect(directive.buttons()).toEqual([]);
  });

  it('should default selected to undefined', () => {
    expect(directive.selected()).toBeUndefined();
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

  it('should accept IButtonGroupOptions via options input', async () => {
    host.options = { variant: 'basic' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ variant: 'basic' });
  });

  it('should update selected when select(id) is called', () => {
    directive.select('btn-1');

    expect(directive.selected()).toBe('btn-1');
  });

  it('should emit buttonClick with buttonId when select(id) is called', () => {
    const spy = jest.fn();
    directive.buttonClick.subscribe(spy);

    directive.select('btn-2');

    expect(spy).toHaveBeenCalledWith({ buttonId: 'btn-2' });
  });
});
