import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormUsageExampleComponent } from './usage.example';

// A placeholder for the password field, not a real credential.
const EXAMPLE_PASSWORD_VALUE = 'placeholder-value';

describe('docs-examples-angular: SignInFormUsageExampleComponent', () => {
  let fixture: ComponentFixture<SignInFormUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInFormUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function type(selector: string, value: string): void {
    const input = element.querySelector(selector) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should render the form from the options', () => {
    // Act
    const submit = element.querySelector('button[type="submit"]');

    // Assert
    expect(submit?.textContent).toContain('Sign in to your account');
    expect(element.textContent).toContain('Continue with Google');
    expect(
      element.querySelector<HTMLInputElement>('input[type="email"]')
        ?.placeholder,
    ).toBe('you@example.com');
  });

  it('should render the links of the sign-in mode', () => {
    // Act
    const links = Array.from(element.querySelectorAll('a'), (link) => [
      link.textContent?.trim(),
      link.getAttribute('href'),
    ]);

    // Assert
    expect(links).toEqual([
      ['Forgot password?', '/forgot-password'],
      ['Create an account', '/sign-up'],
    ]);
  });

  it('should show the typed email once the form is submitted', () => {
    // Arrange
    type('input[type="email"]', 'anna@example.com');
    type('input[type="password"]', EXAMPLE_PASSWORD_VALUE);

    // Act
    (
      element.querySelector('button[type="submit"]') as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Signed in as anna@example.com');
  });

  it('should hand the credentials to the submit handler once', () => {
    // Arrange
    const onSubmit = jest.spyOn(fixture.componentInstance, 'onSubmit');
    type('input[type="email"]', 'anna@example.com');
    type('input[type="password"]', EXAMPLE_PASSWORD_VALUE);

    // Act
    (
      element.querySelector('button[type="submit"]') as HTMLButtonElement
    ).click();

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'anna@example.com',
      password: EXAMPLE_PASSWORD_VALUE,
      mode: 'sign-in',
    });
  });

  it('should show the provider of the clicked social button', () => {
    // Arrange
    const social = element.querySelector('button.social') as HTMLButtonElement;

    // Act
    social.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Continue with provider: google');
  });
});
