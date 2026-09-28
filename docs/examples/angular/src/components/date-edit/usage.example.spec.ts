import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: DateEditUsageExampleComponent', () => {
  let fixture: ComponentFixture<DateEditUsageExampleComponent>;

  const digitInputs = (): HTMLInputElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('input[type="number"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateEditUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateEditUsageExampleComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the bound date digit by digit', () => {
    const digits = digitInputs().map((input) => input.value);

    expect(digits).toEqual(['0', '7', '0', '4', '1', '9', '9', '0']);
  });

  it('should write the edited date back and report it as valid', () => {
    const firstDayDigit = digitInputs()[0];

    firstDayDigit.value = '1';
    firstDayDigit.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.birthDate()).toBe('1990-04-17');
    expect(fixture.componentInstance.isValid()).toBe(true);
  });
});
