import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: PasswordStrengthCustomExampleComponent', () => {
  let fixture: ComponentFixture<PasswordStrengthCustomExampleComponent>;
  let component: PasswordStrengthCustomExampleComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthCustomExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom meter through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector(
        'smart-password-strength docs-custom-password-strength',
      ),
    ).toBeTruthy();
    expect(
      element.querySelector('smart-password-strength-standard'),
    ).toBeNull();
  });

  it('should render three bars and the verdict computed by the base class', () => {
    expect(
      element.querySelectorAll('.docs-password-strength__bar'),
    ).toHaveLength(3);
    expect(
      element.querySelector('.docs-password-strength__msg')?.textContent,
    ).toContain('Poor');
  });

  it('should list only the requirements the password does not meet yet', () => {
    const hints = element.querySelectorAll(
      '.docs-password-strength__hint-item',
    );

    expect(hints).toHaveLength(3);
  });

  // smart-password-strength subscribes to the outlet instance, so this output
  // does reach the caller once the custom component is rendered.
  it('should forward passwordStrength through the wrapper when the password gets strong', () => {
    component.password.set('Abcdefg1!');
    fixture.detectChanges();

    expect(component.strong()).toBe(true);
    expect(
      element.querySelector('.docs-password-strength__hint-item'),
    ).toBeNull();
  });
});
