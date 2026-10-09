import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormCustomExampleComponent } from './custom.example';

// A placeholder for the password field, not a real credential.
const EXAMPLE_PASSWORD_VALUE = 'placeholder-value';

describe('docs-examples-angular: SignInFormCustomExampleComponent', () => {
  let fixture: ComponentFixture<SignInFormCustomExampleComponent>;
  let element: HTMLElement;

  const type = (selector: string, value: string): void => {
    const input = element.querySelector<HTMLInputElement>(selector);
    if (!input) throw new Error(`missing ${selector}`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFormCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInFormCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom form through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector('smart-sign-in-form docs-custom-sign-in-form'),
    ).toBeTruthy();
    expect(element.querySelector('smart-sign-in-form-standard')).toBeNull();
  });

  it('should label the submit button after the mode and render the social provider', () => {
    // Act
    const submit = element.querySelector('.docs-sign-in-form__submit');

    // Assert
    expect(submit?.textContent).toContain('Sign in');
    expect(
      element.querySelector('.docs-sign-in-form__social')?.textContent,
    ).toContain('Continue with Google');
    expect(
      element
        .querySelector<HTMLAnchorElement>('.docs-sign-in-form__forgot')
        ?.getAttribute('href'),
    ).toBe('/forgot');
  });

  it('should report the typed email through the wrapper submit output', () => {
    // Arrange
    type('.docs-sign-in-form__email', 'ada@example.com');
    type('.docs-sign-in-form__password', EXAMPLE_PASSWORD_VALUE);

    // Act
    element
      .querySelector<HTMLFormElement>('.docs-sign-in-form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Signed in as ada@example.com');
  });

  it('should report the clicked provider through the wrapper socialClick output', () => {
    // Act
    element
      .querySelector<HTMLButtonElement>('.docs-sign-in-form__social')
      ?.click();
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Continue with provider: google');
  });
});
