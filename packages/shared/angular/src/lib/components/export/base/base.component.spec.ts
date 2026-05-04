import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-export',
  template: '',
})
class TestExportComponent extends ExportBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-export
    [value]="value"
    [fileName]="fileName"
    [handler]="handler"
    [class]="cssClass"
  />`,
  imports: [TestExportComponent],
})
class TestHostComponent {
  value: any = undefined;
  fileName: string | undefined = undefined;
  handler: (value: any) => void = jest.fn();
  cssClass = '';
}

describe('ExportBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let exportComp: TestExportComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    exportComp = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(exportComp).toBeInstanceOf(ExportBaseComponent);
  });

  it('should default value to undefined', () => {
    expect(exportComp.value()).toBeUndefined();
  });

  it('should default fileName to undefined', () => {
    expect(exportComp.fileName()).toBeUndefined();
  });

  it('should default cssClass to empty string', () => {
    expect(exportComp.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(exportComp.cssClass()).toBe('custom-class');
  });

  it('should call handler with value when onClick is called and value exists', async () => {
    const handlerFn = jest.fn();
    fixture.componentInstance.handler = handlerFn;
    fixture.componentInstance.value = { data: 'test' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    await exportComp.onClick();

    expect(handlerFn).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should not call handler when onClick is called and value is undefined', async () => {
    const handlerFn = jest.fn();
    fixture.componentInstance.handler = handlerFn;
    fixture.componentInstance.value = undefined;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    await exportComp.onClick();

    expect(handlerFn).not.toHaveBeenCalled();
  });

  it('should update value input when host changes value', async () => {
    fixture.componentInstance.value = 'new-value';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(exportComp.value()).toBe('new-value');
  });

  it('should update fileName input when host changes value', async () => {
    fixture.componentInstance.fileName = 'report.csv';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(exportComp.fileName()).toBe('report.csv');
  });
});
