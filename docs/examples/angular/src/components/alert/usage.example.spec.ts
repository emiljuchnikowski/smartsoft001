import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: AlertUsageExampleComponent', () => {
  let fixture: ComponentFixture<AlertUsageExampleComponent>;
  let element: HTMLElement;

  const openAlert = (): void => {
    const trigger = element.querySelector(
      'smart-button button',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should not render the alert until it is opened', () => {
    // Act
    const dialog = element.querySelector('[role="alertdialog"]');

    // Assert
    expect(dialog).toBeNull();
    expect(element.textContent).toContain('Delete file');
  });

  it('should render the alert from the options once it is opened', () => {
    // Act
    openAlert();

    // Assert
    const dialog = element.querySelector('[role="alertdialog"]');
    expect(dialog?.textContent).toContain('Delete file?');
    expect(dialog?.textContent).toContain('This cannot be undone.');
  });

  it('should show the chosen button and close the alert', () => {
    // Arrange
    openAlert();
    const destructive = element.querySelector(
      '[data-role="destructive"]',
    ) as HTMLButtonElement;

    // Act
    destructive.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last choice: destructive');
    expect(element.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it('should close with the cancel button on Escape', () => {
    // Arrange
    openAlert();

    // Act
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last choice: cancel');
    expect(element.querySelector('[role="alertdialog"]')).toBeNull();
  });
});
