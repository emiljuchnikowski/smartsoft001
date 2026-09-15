import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomToggleComponent,
  ToggleCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: ToggleCustomExampleComponent', () => {
  let fixture: ComponentFixture<ToggleCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom toggle through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-toggle docs-custom-toggle'),
    ).toBeTruthy();
    expect(element.querySelector('smart-toggle-standard')).toBeNull();
  });

  it('should render the label and the description from the options', () => {
    expect(element.querySelector('.docs-toggle__label')?.textContent).toContain(
      'Allow notifications',
    );
    expect(
      element.querySelector('.docs-toggle__description')?.textContent,
    ).toContain('Send me an email');
  });

  // NgComponentOutlet forwards inputs but not the [(value)] write-back, so the
  // new state lives on the custom instance.
  it('should flip the value model when the switch is clicked', () => {
    const toggle: CustomToggleComponent = fixture.debugElement.query(
      By.directive(CustomToggleComponent),
    ).componentInstance;
    const input = element.querySelector<HTMLInputElement>(
      '.docs-toggle__input',
    ) as HTMLInputElement;

    input.click();
    fixture.detectChanges();

    expect(toggle.value()).toBe(true);
    expect(input.checked).toBe(true);
  });
});
