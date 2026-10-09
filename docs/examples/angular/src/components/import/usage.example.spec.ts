import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ImportUsageExampleComponent', () => {
  let fixture: ComponentFixture<ImportUsageExampleComponent>;
  let fileInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportUsageExampleComponent);
    fixture.detectChanges();
    fileInput = fixture.nativeElement.querySelector('input[type="file"]');
  });

  it('should restrict the file picker to the accepted type', () => {
    // Assert
    expect(fileInput.accept).toBe('text/csv');
  });

  it('should open the file picker when the button is clicked', () => {
    // Arrange
    const openPicker = jest.spyOn(fileInput, 'click');

    // Act
    fixture.nativeElement.querySelector('button').click();

    // Assert
    expect(openPicker).toHaveBeenCalled();
  });

  it('should show the name of the selected file', () => {
    // Arrange
    const file = new File(['name,email'], 'contacts.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', { value: [file] });

    // Act
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Imported: contacts.csv',
    );
  });
});
