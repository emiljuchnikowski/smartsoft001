import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: ButtonGroupUsageExampleComponent', () => {
  let fixture: ComponentFixture<ButtonGroupUsageExampleComponent>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="group"] button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the buttons and mark the selected one as pressed', () => {
    // Act
    const labels = buttons().map((button) => button.textContent?.trim());

    // Assert
    expect(labels).toEqual(['Day', 'Week', 'Month']);
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Showing: week');
  });

  it('should select the clicked button and show it under the group', () => {
    // Act
    buttons()[2].click();
    fixture.detectChanges();

    // Assert
    expect(buttons()[2].getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('false');
    expect(fixture.nativeElement.textContent).toContain('Showing: month');
  });
});
