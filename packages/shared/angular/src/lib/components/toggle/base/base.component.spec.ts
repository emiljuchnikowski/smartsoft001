import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleBaseComponent } from './base.component';
import { IToggleOptions } from '../../../models';

@Component({
  selector: 'smart-test-toggle',
  template: '',
})
class TestToggleComponent extends ToggleBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-toggle
    [(value)]="value"
    [disabled]="disabled"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestToggleComponent],
})
class TestHostComponent {
  value = false;
  disabled = false;
  options: IToggleOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ToggleBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestToggleComponent;

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
    expect(directive).toBeInstanceOf(ToggleBaseComponent);
  });

  it('should have smartType static equal to "toggle"', () => {
    expect(ToggleBaseComponent.smartType).toBe('toggle');
  });

  it('should default value to false', () => {
    expect(directive.value()).toBe(false);
  });

  it('should default disabled to false', () => {
    expect(directive.disabled()).toBe(false);
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

  it('should accept IToggleOptions via options input', async () => {
    host.options = { ariaLabel: 'my-toggle' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({ ariaLabel: 'my-toggle' });
  });

  it('should flip value from false to true on toggle()', () => {
    directive.value.set(false);

    directive.toggle();

    expect(directive.value()).toBe(true);
  });

  it('should flip value from true to false on toggle()', () => {
    directive.value.set(true);

    directive.toggle();

    expect(directive.value()).toBe(false);
  });

  it('should NOT change value on toggle() when disabled is true', async () => {
    host.disabled = true;
    host.value = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    directive.toggle();

    expect(directive.value()).toBe(false);
  });
});
