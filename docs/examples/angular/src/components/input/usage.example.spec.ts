import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { StyleService } from '@smartsoft001/angular';

import { InputUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: InputUsageExampleComponent', () => {
  let fixture: ComponentFixture<InputUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputUsageExampleComponent],
      // App-wide services, provided once in the application's root config.
      providers: [provideTranslateService(), StyleService],
    }).compileComponents();

    fixture = TestBed.createComponent(InputUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the field type declared on the model', () => {
    const field = fixture.nativeElement.querySelector('input[type="email"]');

    expect(field).not.toBeNull();
  });

  it('should mark the field as required from the control validators', () => {
    const label: HTMLElement = fixture.nativeElement.querySelector('label');

    expect(label.textContent).toContain('*');
  });

  it('should write what the user types into the control', () => {
    const field: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="email"]',
    );

    field.value = 'ada@example.com';
    field.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('ada@example.com');
  });
});
