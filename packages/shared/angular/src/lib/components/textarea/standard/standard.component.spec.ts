import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaStandardComponent } from './standard.component';
import { ITextareaActionClick } from '../base/base.component';

describe('@smartsoft001/shared-angular: TextareaStandardComponent', () => {
  let fixture: ComponentFixture<TextareaStandardComponent>;
  let component: TextareaStandardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should always render the wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector('.textarea');

    expect(wrapper).toBeTruthy();
  });

  it('should always render <textarea>', () => {
    const ta = fixture.nativeElement.querySelector('textarea');

    expect(ta).toBeTruthy();
  });

  it('should default rows to 3', () => {
    const ta: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(ta.rows).toBe(3);
  });

  it('should override rows from options', () => {
    fixture.componentRef.setInput('options', { rows: 8 });
    fixture.detectChanges();

    const ta: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(ta.rows).toBe(8);
  });

  it('should set placeholder attribute', () => {
    fixture.componentRef.setInput('placeholder', 'Add your comment...');
    fixture.detectChanges();

    const ta = fixture.nativeElement.querySelector('textarea');

    expect(ta.getAttribute('placeholder')).toBe('Add your comment...');
  });

  it('should set maxlength attribute when options.maxLength provided', () => {
    fixture.componentRef.setInput('options', { maxLength: 200 });
    fixture.detectChanges();

    const ta = fixture.nativeElement.querySelector('textarea');

    expect(ta.getAttribute('maxlength')).toBe('200');
  });

  it('should disable <textarea> when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const ta: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(ta.disabled).toBe(true);
  });

  it('should two-way bind value via input event', () => {
    const ta: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    ta.value = 'Hello';
    ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Hello');
  });

  it('should reflect value() back to <textarea>', () => {
    fixture.componentRef.setInput('value', 'Pre-filled');
    fixture.detectChanges();

    const ta: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');

    expect(ta.value).toBe('Pre-filled');
  });

  it('should render label when options.label is provided', () => {
    fixture.componentRef.setInput('options', { label: 'Comment' });
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');

    expect(label.textContent).toContain('Comment');
  });

  it('should render action buttons when options.actions provided', () => {
    fixture.componentRef.setInput('options', {
      actions: [
        { id: 'cancel', label: 'Cancel', variant: 'ghost' },
        { id: 'submit', label: 'Submit', variant: 'primary' },
      ],
    });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.action');

    expect(buttons.length).toBe(2);
    expect(buttons[0].className).toContain('variant-ghost');
    expect(buttons[1].className).toContain('variant-primary');
  });

  it('should emit actionClick with current value on action button click', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'submit', label: 'Submit' }],
    });
    fixture.componentRef.setInput('value', 'message');
    fixture.detectChanges();

    const emitted: ITextareaActionClick[] = [];
    component.actionClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ actionId: 'submit', value: 'message' });
  });

  it('should NOT emit actionClick when disabled', () => {
    fixture.componentRef.setInput('options', {
      actions: [{ id: 'submit' }],
    });
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitted: ITextareaActionClick[] = [];
    component.actionClick.subscribe((v) => emitted.push(v));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.action');
    button.click();

    expect(emitted.length).toBe(0);
  });

  it('should apply external cssClass on the wrapper', () => {
    fixture.componentRef.setInput('class', 'my-extra-class');
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain('my-extra-class');
  });
});
