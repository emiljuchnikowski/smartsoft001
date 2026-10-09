import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: NotificationUsageExampleComponent', () => {
  let fixture: ComponentFixture<NotificationUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render the notification from the inputs and options', () => {
    const status = element.querySelector('[role="status"]');

    expect(status?.textContent).toContain('Successfully saved!');
    expect(status?.textContent).toContain('Anyone with a link can now view');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('should show the clicked action', () => {
    // Arrange
    const undo = Array.from(
      element.querySelectorAll<HTMLButtonElement>('button[data-variant]'),
    ).find((button) => button.textContent?.includes('Undo'));

    // Act
    undo?.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Last action: undo');
  });

  it('should hide the notification when it is dismissed', () => {
    // Act
    element.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.click();
    fixture.detectChanges();

    // Assert
    expect(element.querySelector('[role="status"]')).toBeNull();
  });
});
