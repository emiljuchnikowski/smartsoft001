import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import {
  AuthService,
  FormFactory,
  MODEL_VALIDATORS_PROVIDER,
  StyleService,
} from '@smartsoft001/angular';

import { FormCustomExampleComponent } from './custom.example';

describe('docs-examples-angular: FormCustomExampleComponent', () => {
  let fixture: ComponentFixture<FormCustomExampleComponent>;
  let component: FormCustomExampleComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCustomExampleComponent, TranslateModule.forRoot()],
      // An application gets these from SharedFactoriesModule and
      // SharedServicesModule; the example only has to register the custom form.
      providers: [
        FormFactory,
        StyleService,
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
        { provide: AuthService, useValue: { expectPermissions: () => true } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCustomExampleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    // FormFactory.create() is async, so the form group only reaches the
    // custom component after the microtask queue drains.
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the custom form shell instead of the standard one', () => {
    expect(element.querySelector('.docs-form')).toBeTruthy();
    expect(element.querySelector('smart-form-standard')).toBeNull();
  });

  it('should render one custom row per field of the model', () => {
    const rows = element.querySelectorAll('.docs-form__row');

    expect(rows).toHaveLength(2);
    expect(element.querySelectorAll('smart-input')).toHaveLength(2);
  });

  it('should write user input into the form group', () => {
    const input = element.querySelector(
      '.docs-form__row input',
    ) as HTMLInputElement;

    input.value = 'Ada Lovelace';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()?.name).toBe('Ada Lovelace');
  });

  it('should emit invokeSubmit from the wrapper when the custom submit button is clicked', () => {
    element.querySelector<HTMLButtonElement>('.docs-form__submit')?.click();
    fixture.detectChanges();

    expect(component.submitted()).toBe(true);
  });
});
