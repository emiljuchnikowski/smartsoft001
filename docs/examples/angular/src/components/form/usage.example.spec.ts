import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import {
  FormFactory,
  MODEL_VALIDATORS_PROVIDER,
  StyleService,
} from '@smartsoft001/angular';

import { FormUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: FormUsageExampleComponent', () => {
  let fixture: ComponentFixture<FormUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [
        provideTranslateService(),
        FormFactory,
        StyleService,
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();

    // The form group is built asynchronously from the model metadata.
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render one input per field of the model', () => {
    expect(element.querySelectorAll('smart-input')).toHaveLength(2);
  });

  it('should hand the typed value to the change handler', () => {
    const input = element.querySelector('input') as HTMLInputElement;

    input.value = 'Ada Lovelace';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.value()?.name).toBe('Ada Lovelace');
  });

  it('should call the submit handler when the form is submitted', () => {
    const form = element.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));

    expect(fixture.componentInstance.submitted()).toBe(true);
  });
});
