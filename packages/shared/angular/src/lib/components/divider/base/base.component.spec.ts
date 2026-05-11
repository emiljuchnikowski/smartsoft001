import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerBaseComponent } from './base.component';
import { IDividerOptions } from '../../../models';

@Component({
  selector: 'smart-test-divider',
  template: '',
})
class TestDividerComponent extends DividerBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-divider
    [label]="label"
    [iconName]="iconName"
    [title]="title"
    [actionLabel]="actionLabel"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestDividerComponent],
})
class TestHostComponent {
  label: string | undefined = undefined;
  iconName: string | undefined = undefined;
  title: string | undefined = undefined;
  actionLabel: string | undefined = undefined;
  options: IDividerOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: DividerBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestDividerComponent;

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
    expect(directive).toBeInstanceOf(DividerBaseComponent);
  });

  it('should have smartType static equal to "divider"', () => {
    expect(DividerBaseComponent.smartType).toBe('divider');
  });

  it('should default label to undefined', () => {
    expect(directive.label()).toBeUndefined();
  });

  it('should default iconName to undefined', () => {
    expect(directive.iconName()).toBeUndefined();
  });

  it('should default title to undefined', () => {
    expect(directive.title()).toBeUndefined();
  });

  it('should default actionLabel to undefined', () => {
    expect(directive.actionLabel()).toBeUndefined();
  });

  it('should default options to undefined', () => {
    expect(directive.options()).toBeUndefined();
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

  it('should accept IDividerOptions via options input', async () => {
    host.options = { variant: 'with-label', position: 'left' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      variant: 'with-label',
      position: 'left',
    });
  });

  it('should expose actionClick as an output', () => {
    expect(directive.actionClick).toBeDefined();
    expect(typeof directive.actionClick.emit).toBe('function');
  });
});
