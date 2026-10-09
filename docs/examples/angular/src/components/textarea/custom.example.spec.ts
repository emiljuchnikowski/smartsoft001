import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaCustomExampleComponent } from './custom.example';

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

  function field(): HTMLTextAreaElement {
    return element.querySelector(
      '.docs-textarea__field',
    ) as HTMLTextAreaElement;
  }

  it('should render the custom textarea through the wrapper instead of the standard one', () => {
    // Assert
    expect(
      element.querySelector('smart-textarea docs-custom-textarea'),
    ).toBeTruthy();
    expect(element.querySelector('smart-textarea-standard')).toBeNull();
  });

  it('should forward the value, the placeholder and the row count', () => {
    // Act
    const textarea = field();

    // Assert
    expect(textarea.value).toBe('Looks good to me.');
    expect(textarea.placeholder).toBe('Add your comment...');
    expect(textarea.rows).toBe(4);
  });

  it('should write typed text back through the wrapper [(value)]', () => {
    // Act
    field().value = 'Shipping it.';
    field().dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance.comment()).toBe('Shipping it.');
  });

  it('should show the action reported through the wrapper actionClick', () => {
    // Arrange
    const send = element.querySelectorAll<HTMLButtonElement>(
      '.docs-textarea__action',
    )[1];

    // Act
    send.click();
    fixture.detectChanges();

    // Assert
    expect(send.textContent).toContain('Send');
    expect(element.textContent).toContain(
      'Last action: submit: Looks good to me.',
    );
  });
});
