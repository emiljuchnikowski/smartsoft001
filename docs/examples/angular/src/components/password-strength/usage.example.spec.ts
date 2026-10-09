import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { PasswordStrengthUsageExampleComponent } from './usage.example';

// Lower and upper letters, a symbol and more than 6 characters.
const STRONG_EXAMPLE_VALUE = 'Placeholder-Value';

describe('docs-examples-angular: PasswordStrengthUsageExampleComponent', () => {
  let fixture: ComponentFixture<PasswordStrengthUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthUsageExampleComponent],
      // The app provides translations once, in app.config.ts.
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should rate the initial password and list the missing requirements', () => {
    // Act
    const text = element.textContent;

    // Assert
    expect(text).toContain('INPUT.PASSWORD-STRENGTH.poor');
    expect(text).toContain('INPUT.ERRORS.upperLetters');
  });

  it('should not report the initial password as strong', () => {
    // Act
    const text = element.textContent;

    // Assert
    expect(text).not.toContain('The password is strong.');
  });

  it('should report a strong password to the handler', () => {
    // Arrange
    const input = element.querySelector<HTMLInputElement>(
      'input[aria-label="Password"]',
    );

    // Act
    if (input) {
      input.value = STRONG_EXAMPLE_VALUE;
      input.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('The password is strong.');
    expect(element.textContent).not.toContain('INPUT.ERRORS.upperLetters');
  });
});
