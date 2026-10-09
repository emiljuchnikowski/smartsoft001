import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import {
  FormFactory,
  MODEL_VALIDATORS_PROVIDER,
  SharedModule,
  StyleService,
} from '@smartsoft001/angular';

import { FormUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: FormUsageExampleComponent', () => {
  let fixture: ComponentFixture<FormUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // App-wide services, provided once in the application's root config:
      // SharedModule registers the library's dictionary.
      imports: [FormUsageExampleComponent, SharedModule],
      providers: [
        provideTranslateService(),
        FormFactory,
        StyleService,
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).use('eng');
    fixture = TestBed.createComponent(FormUsageExampleComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();

    // The form group is built asynchronously from the model metadata.
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render one labelled input per field of the model', () => {
    // Arrange
    const labels = Array.from(element.querySelectorAll('label'), (label) =>
      label.textContent?.trim(),
    );

    // Assert
    expect(element.querySelectorAll('smart-input')).toHaveLength(2);
    expect(labels.join(' ')).toContain('first name');
    expect(labels.join(' ')).toContain('email');
  });

  it('should show the typed value from the change handler', () => {
    // Arrange
    const input = element.querySelector('input') as HTMLInputElement;

    // Act
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('First name: Ada');
  });

  it('should show that the form was submitted', () => {
    // Arrange
    const form = element.querySelector('form') as HTMLFormElement;

    // Act
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    // Assert
    expect(element.textContent).toContain('Submitted');
  });
});
