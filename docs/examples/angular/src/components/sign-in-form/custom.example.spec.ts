import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomSignInFormComponent,
  SignInFormCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: SignInFormCustomExampleComponent', () => {
  let fixture: ComponentFixture<SignInFormCustomExampleComponent>;
  let element: HTMLElement;
  let custom: CustomSignInFormComponent;

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
    custom = fixture.debugElement.query(
      By.directive(CustomSignInFormComponent),
    ).componentInstance;
  });

  it('should render the custom form through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-sign-in-form docs-custom-sign-in-form'),
    ).toBeTruthy();
    expect(element.querySelector('smart-sign-in-form-standard')).toBeNull();
  });

  it('should label the submit button after the mode and render the social provider', () => {
    expect(
      element.querySelector('.docs-sign-in-form__submit')?.textContent,
    ).toContain('Sign in');
    expect(
      element.querySelector('.docs-sign-in-form__social')?.textContent,
    ).toContain('Continue with Google');
    expect(
      element
        .querySelector<HTMLAnchorElement>('.docs-sign-in-form__forgot')
        ?.getAttribute('href'),
    ).toBe('/forgot');
  });

  // NgComponentOutlet does not forward outputs, so submit never reaches the
  // wrapper; it is asserted on the custom component instance instead.
  it('should emit submit with the typed credentials and the current mode', () => {
    const submissions: unknown[] = [];
    // Placeholder credentials for the assertion, not a real password.
    const typedEmail = 'ada@example.com';
    const typedPassword = 'example-only';
    custom.submit.subscribe((event) => submissions.push(event));

    type('.docs-sign-in-form__email', typedEmail);
    type('.docs-sign-in-form__password', typedPassword);
    element
      .querySelector<HTMLFormElement>('.docs-sign-in-form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(submissions).toEqual([
      { email: typedEmail, password: typedPassword, mode: 'sign-in' },
    ]);
  });

  it('should emit socialClick when the provider button is clicked', () => {
    const providers: string[] = [];
    custom.socialClick.subscribe((event) => providers.push(event.providerId));

    element
      .querySelector<HTMLButtonElement>('.docs-sign-in-form__social')
      ?.click();

    expect(providers).toEqual(['google']);
  });
});
