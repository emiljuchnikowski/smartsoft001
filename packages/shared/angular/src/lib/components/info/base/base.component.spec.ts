import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBaseComponent } from './base.component';
import { IInfoOptions } from '../../../models';

@Component({
  selector: 'smart-test-info',
  template: '',
})
class TestInfoComponent extends InfoBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-info [options]="options" [class]="cssClass" />`,
  imports: [TestInfoComponent],
})
class TestHostComponent {
  options: IInfoOptions = { text: 'some info text' };
  cssClass = '';
}

describe('@smartsoft001/shared-angular: InfoBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let info: TestInfoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    info = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(info).toBeInstanceOf(InfoBaseComponent);
  });

  it('should have smartType static equal to "info"', () => {
    expect(InfoBaseComponent.smartType).toBe('info');
  });

  it('should have options input with required value', () => {
    expect(info.options()).toEqual({ text: 'some info text' });
  });

  it('should update options input when host changes value', async () => {
    fixture.componentInstance.options = { text: 'updated text' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(info.options().text).toBe('updated text');
  });

  it('should default cssClass to empty string', () => {
    expect(info.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(info.cssClass()).toBe('custom-class');
  });

  it('should default isOpen to false', () => {
    expect(info.isOpen()).toBe(false);
  });

  it('should toggle isOpen from false to true', () => {
    info.toggle();

    expect(info.isOpen()).toBe(true);
  });

  it('should toggle isOpen from true to false', () => {
    info.open();

    info.toggle();

    expect(info.isOpen()).toBe(false);
  });

  it('should set isOpen to true when open is called', () => {
    info.open();

    expect(info.isOpen()).toBe(true);
  });

  it('should set isOpen to false when close is called', () => {
    info.open();

    info.close();

    expect(info.isOpen()).toBe(false);
  });

  it('should remain false when close is called on already closed', () => {
    info.close();

    expect(info.isOpen()).toBe(false);
  });
});
