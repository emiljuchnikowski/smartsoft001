import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DateEditUsageExampleComponent', () => {
  let fixture: ComponentFixture<DateEditUsageExampleComponent>;

  const digitInputs = (): HTMLInputElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('input[type="number"]'));

  const typeDigit = async (index: number, digit: string): Promise<void> => {
    const input = digitInputs()[index];
    input.value = digit;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateEditUsageExampleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the bound date digit by digit', () => {
    // Act
    const digits = digitInputs().map((input) => input.value);

    // Assert
    expect(digits).toEqual(['0', '7', '0', '4', '1', '9', '9', '0']);
    expect(fixture.nativeElement.textContent).not.toContain(
      'Enter a valid date of birth.',
    );
  });

  it('should write the edited date back and keep it valid', async () => {
    // Act
    await typeDigit(0, '1');

    // Assert
    expect(digitInputs().map((input) => input.value)).toEqual([
      '1',
      '7',
      '0',
      '4',
      '1',
      '9',
      '9',
      '0',
    ]);
    expect(fixture.componentInstance.birthDate()).toBe('1990-04-17');
    expect(fixture.nativeElement.textContent).not.toContain(
      'Enter a valid date of birth.',
    );
  });

  it('should show the message when the edited date is not valid', async () => {
    // Act
    await typeDigit(2, '9');

    // Assert
    expect(fixture.nativeElement.textContent).toContain(
      'Enter a valid date of birth.',
    );
  });
});
