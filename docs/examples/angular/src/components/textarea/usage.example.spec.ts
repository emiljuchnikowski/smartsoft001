import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaUsageExampleComponent } from './usage.example';

describe('docs-examples-angular: TextareaUsageExampleComponent', () => {
  let fixture: ComponentFixture<TextareaUsageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaUsageExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaUsageExampleComponent);
    fixture.detectChanges();
  });

  it('should render the textarea configured by the options', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(fixture.nativeElement.textContent).toContain('Add your comment');
    expect(textarea.rows).toBe(4);
    expect(textarea.getAttribute('maxlength')).toBe('500');
    expect(textarea.getAttribute('placeholder')).toBe('Write a comment...');
  });

  it('should bind the typed text to the component', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    textarea.value = 'Looks good to me';
    textarea.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.comment()).toBe('Looks good to me');
  });

  it('should hand the action id and the text to the handler', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    textarea.value = 'Ship it';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const action: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    action.click();

    expect(fixture.componentInstance.lastSubmitted()).toBe('Ship it');
  });
});
