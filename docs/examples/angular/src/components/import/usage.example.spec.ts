import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ImportUsageExampleComponent', () => {
  let fixture: ComponentFixture<ImportUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should restrict the file picker to the accepted type', () => {
    const fileInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');

    expect(fileInput.accept).toBe('text/csv');
  });

  it('should hand the selected file to the handler', () => {
    const fileInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="file"]');
    const file = new File(['name,email'], 'contacts.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', { value: [file] });

    fileInput.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.importedFile()).toBe('contacts.csv');
  });
});
