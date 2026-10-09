import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ExportUsageExampleComponent', () => {
  let fixture: ComponentFixture<ExportUsageExampleComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportUsageExampleComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('should give the icon-only button an accessible name', () => {
    // Assert
    expect(button.textContent?.trim()).toBe('Export');
  });

  it('should enable the export button when there is a value', () => {
    // Assert
    expect(button.disabled).toBe(false);
  });

  it('should hand the value and the file name to the handler when clicked', () => {
    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Exported 2 orders as orders.csv',
    );
  });
});
