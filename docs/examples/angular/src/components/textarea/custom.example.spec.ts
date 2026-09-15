import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CustomTextareaComponent,
  TextareaCustomExampleComponent,
} from './custom.example';

describe('docs-examples-angular: TextareaCustomExampleComponent', () => {
  let fixture: ComponentFixture<TextareaCustomExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaCustomExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaCustomExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should render the custom textarea through the wrapper instead of the standard one', () => {
    expect(
      element.querySelector('smart-textarea docs-custom-textarea'),
    ).toBeTruthy();
    expect(element.querySelector('smart-textarea-standard')).toBeNull();
  });

  it('should forward the value, the placeholder and the row count', () => {
    const field = element.querySelector<HTMLTextAreaElement>(
      '.docs-textarea__field',
    );

    expect(field?.value).toBe('Looks good to me.');
    expect(field?.placeholder).toBe('Add your comment...');
    expect(field?.rows).toBe(4);
  });

  it('should write typed text into the value model of the custom instance', () => {
    const textarea: CustomTextareaComponent = fixture.debugElement.query(
      By.directive(CustomTextareaComponent),
    ).componentInstance;
    const field = element.querySelector<HTMLTextAreaElement>(
      '.docs-textarea__field',
    ) as HTMLTextAreaElement;

    field.value = 'Shipping it.';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textarea.value()).toBe('Shipping it.');
  });

  // NgComponentOutlet forwards inputs but not outputs, so the wrapper's
  // (actionClick) never fires; the custom instance emits it.
  it('should emit actionClick with the current value from the custom instance', () => {
    const textarea: CustomTextareaComponent = fixture.debugElement.query(
      By.directive(CustomTextareaComponent),
    ).componentInstance;
    const emitted: { actionId: string; value: string }[] = [];
    textarea.actionClick.subscribe((event) => emitted.push(event));

    const send = element.querySelectorAll<HTMLButtonElement>(
      '.docs-textarea__action',
    )[1];
    send.click();

    expect(emitted).toEqual([
      { actionId: 'submit', value: 'Looks good to me.' },
    ]);
  });
});
