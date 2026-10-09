import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: TextareaUsageExampleComponent', () => {
  let fixture: ComponentFixture<TextareaUsageExampleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaUsageExampleComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function textarea(): HTMLTextAreaElement {
    return element.querySelector('textarea') as HTMLTextAreaElement;
  }

  function type(value: string): void {
    textarea().value = value;
    textarea().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('should render the textarea configured by the options', () => {
    // Act
    const field = textarea();

    // Assert
    expect(element.querySelector('label')?.textContent).toContain(
      'Add your comment',
    );
    expect(field.rows).toBe(4);
    expect(field.getAttribute('maxlength')).toBe('500');
    expect(field.getAttribute('placeholder')).toBe('Write a comment...');
    expect(field.required).toBe(true);
  });

  it('should keep the typed text in the bound signal', () => {
    // Act
    type('Looks good to me');

    // Assert
    expect(textarea().value).toBe('Looks good to me');
    expect(fixture.componentInstance.comment()).toBe('Looks good to me');
  });

  it('should show the text once the action is clicked', () => {
    // Arrange
    type('Ship it');
    const post = element.querySelector('button') as HTMLButtonElement;

    // Act
    post.click();
    fixture.detectChanges();

    // Assert
    expect(post.textContent).toContain('Post');
    expect(element.textContent).toContain('Posted: Ship it');
  });
});
