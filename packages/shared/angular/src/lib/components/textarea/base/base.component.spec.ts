import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaBaseComponent } from './base.component';
import { ITextareaOptions } from '../../../models';

@Component({
  selector: 'smart-test-textarea',
  template: '',
})
class TestTextareaComponent extends TextareaBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-textarea
    [(value)]="value"
    [placeholder]="placeholder"
    [disabled]="disabled"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestTextareaComponent],
})
class TestHostComponent {
  value = '';
  placeholder = '';
  disabled = false;
  options: ITextareaOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: TextareaBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestTextareaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create instance', () => {
    expect(directive).toBeInstanceOf(TextareaBaseComponent);
  });

  it('should have smartType = "textarea"', () => {
    expect(TextareaBaseComponent.smartType).toBe('textarea');
  });

  it('should default value to empty string', () => {
    expect(directive.value()).toBe('');
  });

  it('should default placeholder/disabled/options/class', () => {
    expect(directive.placeholder()).toBe('');
    expect(directive.disabled()).toBe(false);
    expect(directive.options()).toBeUndefined();
    expect(directive.cssClass()).toBe('');
  });

  it('should accept value via two-way model', async () => {
    host.value = 'Hello';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.value()).toBe('Hello');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should expose actionClick output', () => {
    expect(directive.actionClick).toBeTruthy();
  });
});
