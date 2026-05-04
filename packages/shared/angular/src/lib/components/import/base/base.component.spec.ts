import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBaseComponent } from './base.component';

@Component({
  selector: 'smart-test-import',
  template: `<input
    type="file"
    [accept]="accept() ? accept() : 'application/json'"
    [hidden]="true"
    #fileInput
    (change)="onFileSelected($event)"
  />`,
})
class TestImportComponent extends ImportBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-import [accept]="accept" [class]="cssClass" />`,
  imports: [TestImportComponent],
})
class TestHostComponent {
  accept: string | undefined = 'application/json';
  cssClass = '';
}

describe('ImportBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let importComp: TestImportComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    importComp = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(importComp).toBeInstanceOf(ImportBaseComponent);
  });

  it('should default accept to application/json', () => {
    expect(importComp.accept()).toBe('application/json');
  });

  it('should default cssClass to empty string', () => {
    expect(importComp.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    fixture.componentInstance.cssClass = 'custom-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(importComp.cssClass()).toBe('custom-class');
  });

  describe('onFileSelected', () => {
    it('should emit file via set output when file is selected', () => {
      const mockFile = new File(['content'], 'test.json', {
        type: 'application/json',
      });
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      Object.defineProperty(inputEl, 'files', {
        value: [mockFile],
      });
      const event = { target: inputEl } as unknown as Event;
      const emitSpy = jest.spyOn(importComp.set, 'emit');

      importComp.onFileSelected(event);

      expect(emitSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should reset input value after file selection', () => {
      const mockFile = new File(['content'], 'test.json', {
        type: 'application/json',
      });
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      Object.defineProperty(inputEl, 'files', {
        value: [mockFile],
      });
      const event = { target: inputEl } as unknown as Event;

      importComp.onFileSelected(event);

      expect(inputEl.value).toBe('');
    });

    it('should throw error when no file is selected', () => {
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      Object.defineProperty(inputEl, 'files', {
        value: [],
      });
      const event = { target: inputEl } as unknown as Event;

      expect(() => importComp.onFileSelected(event)).toThrow(
        'ImportBaseComponent: File not found',
      );
    });
  });

  describe('triggerFileInput', () => {
    it('should call click on the provided input element', () => {
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      const clickSpy = jest.spyOn(inputEl, 'click');

      importComp.triggerFileInput(inputEl);

      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
