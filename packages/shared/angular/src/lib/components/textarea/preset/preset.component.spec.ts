import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaPresetComponent } from './preset.component';
import { ITextareaOptions } from '../../../models';
import { ITextareaActionClick, TextareaBaseComponent } from '../base';

@Component({
  selector: 'smart-test-textarea-slots',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ng-template #avatar><img class="test-avatar" alt="" /></ng-template>
    <ng-template #toolbar><span class="test-toolbar">B I</span></ng-template>
    <ng-template #preview><p class="test-preview">Rendered</p></ng-template>
    <ng-template #footer
      ><span class="test-footer">Markdown ok</span></ng-template
    >
  `,
})
class SlotsHostComponent {
  avatar = viewChild.required<TemplateRef<unknown>>('avatar');
  toolbar = viewChild.required<TemplateRef<unknown>>('toolbar');
  preview = viewChild.required<TemplateRef<unknown>>('preview');
  footer = viewChild.required<TemplateRef<unknown>>('footer');
}

describe('@smartsoft001/shared-angular: TextareaPresetComponent', () => {
  let fixture: ComponentFixture<TextareaPresetComponent>;
  let component: TextareaPresetComponent;
  let slots: SlotsHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaPresetComponent, SlotsHostComponent],
    }).compileComponents();

    const slotsFixture = TestBed.createComponent(SlotsHostComponent);
    slotsFixture.detectChanges();
    slots = slotsFixture.componentInstance;

    fixture = TestBed.createComponent(TextareaPresetComponent);
    component = fixture.componentInstance;
  });

  function setOptions(options: ITextareaOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  function el(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function root(): HTMLElement {
    return el().firstElementChild as HTMLElement;
  }

  function field(): HTMLTextAreaElement {
    return el().querySelector('textarea') as HTMLTextAreaElement;
  }

  function actionButtons(): HTMLButtonElement[] {
    return Array.from(
      el().querySelectorAll<HTMLButtonElement>('button[data-action-id]'),
    );
  }

  const ACTIONS: ITextareaOptions['actions'] = [
    { id: 'cancel', label: 'Cancel', variant: 'ghost' },
    { id: 'submit', label: 'Send', variant: 'primary' },
    { id: 'draft', label: 'Draft', variant: 'secondary' },
  ];

  it('should extend TextareaBaseComponent', () => {
    fixture.detectChanges();

    expect(component).toBeInstanceOf(TextareaBaseComponent);
  });

  describe('field', () => {
    it('should render a textarea with default 3 rows', () => {
      fixture.detectChanges();

      expect(field().rows).toBe(3);
    });

    it('should apply rows, name, maxlength, aria-label and required from options', () => {
      setOptions({
        rows: 6,
        name: 'bio',
        maxLength: 140,
        ariaLabel: 'Your bio',
        required: true,
      });

      expect(field().rows).toBe(6);
      expect(field().getAttribute('name')).toBe('bio');
      expect(field().getAttribute('maxlength')).toBe('140');
      expect(field().getAttribute('aria-label')).toBe('Your bio');
      expect(field().required).toBe(true);
    });

    it('should set the placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Add your comment...');
      fixture.detectChanges();

      expect(field().getAttribute('placeholder')).toBe('Add your comment...');
    });

    it('should reflect value and write typed text back to the model', () => {
      fixture.componentRef.setInput('value', 'Pre-filled');
      fixture.detectChanges();

      expect(field().value).toBe('Pre-filled');

      field().value = 'Typed';
      field().dispatchEvent(new Event('input'));

      expect(component.value()).toBe('Typed');
    });

    it('should disable the textarea when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(field().disabled).toBe(true);
    });

    it('should keep dark-mode classes on the field', () => {
      fixture.detectChanges();

      expect(field().className).toContain('smart:dark:text-white');
    });

    it('should focus the textarea when autoFocus is set', () => {
      setOptions({ autoFocus: true });

      expect(document.activeElement).toBe(field());
    });
  });

  describe('label', () => {
    it('should render a label linked to the textarea', () => {
      setOptions({ label: 'Comment' });

      const label = el().querySelector('label') as HTMLLabelElement;

      expect(label.textContent).toContain('Comment');
      expect(label.htmlFor).toBe(field().id);
      expect(label.className).toContain('smart:dark:text-white');
    });

    it('should show a required marker when required', () => {
      setOptions({ label: 'Comment', required: true });

      const label = el().querySelector('label') as HTMLLabelElement;

      expect(label.textContent).toContain('*');
    });
  });

  describe('variants', () => {
    it('should default to the simple variant with an outlined, rounded field', () => {
      fixture.detectChanges();

      expect(root().getAttribute('data-variant')).toBe('simple');
      expect(field().className).toContain('smart:rounded-lg');
      expect(field().className).toContain('smart:outline-gray-300');
      expect(field().className).toContain('smart:dark:outline-white/10');
    });

    it('should wrap the field in an outlined box for with-avatar-actions', () => {
      setOptions({ variant: 'with-avatar-actions' });

      const frame = field().parentElement as HTMLElement;

      expect(frame.className).toContain('smart:focus-within:outline-2');
      expect(frame.className).toContain('smart:dark:bg-white/5');
      expect(field().className).toContain('smart:bg-transparent');
    });

    it('should draw only a bottom border for with-underline', () => {
      setOptions({ variant: 'with-underline' });

      const frame = field().parentElement as HTMLElement;

      expect(frame.className).toContain('smart:border-b');
      expect(frame.className).toContain('smart:dark:border-white/10');
      expect(field().className).not.toContain('smart:rounded-lg');
    });

    it('should render pill-shaped actions for with-pill-actions', () => {
      setOptions({ variant: 'with-pill-actions', actions: ACTIONS });

      expect(actionButtons()[0].className).toContain('smart:rounded-full');
    });

    it('should render rounded-md actions for other variants', () => {
      setOptions({ variant: 'simple', actions: ACTIONS });

      expect(actionButtons()[0].className).toContain('smart:rounded-md');
      expect(actionButtons()[0].className).not.toContain('smart:rounded-full');
    });

    it('should place toolbar and actions inside the box for with-avatar-actions', () => {
      setOptions({
        variant: 'with-avatar-actions',
        actions: ACTIONS,
        toolbarTpl: slots.toolbar(),
      });

      const frame = field().parentElement as HTMLElement;

      expect(frame.querySelector('.test-toolbar')).toBeTruthy();
      expect(frame.querySelector('button[data-action-id]')).toBeTruthy();
    });

    it('should place toolbar and actions below the field for simple', () => {
      setOptions({ actions: ACTIONS, toolbarTpl: slots.toolbar() });

      const frame = field().parentElement as HTMLElement;

      expect(frame.querySelector('button[data-action-id]')).toBeNull();
      expect(el().querySelector('.test-toolbar')).toBeTruthy();
      expect(actionButtons().length).toBe(3);
    });
  });

  describe('with-preview', () => {
    it('should render Write / Preview tabs and switch to the preview pane', () => {
      setOptions({ variant: 'with-preview', previewTpl: slots.preview() });

      const tabs = el().querySelectorAll<HTMLButtonElement>('[role="tab"]');

      expect(tabs.length).toBe(2);
      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      expect(field()).toBeTruthy();
      expect(el().querySelector('.test-preview')).toBeNull();

      tabs[1].click();
      fixture.detectChanges();

      expect(tabs[1].getAttribute('aria-selected')).toBe('true');
      expect(el().querySelector('.test-preview')).toBeTruthy();
      expect(el().querySelector('textarea')).toBeNull();
    });

    it('should render the preview below the field in other variants', () => {
      setOptions({ previewTpl: slots.preview() });

      expect(el().querySelector('[role="tab"]')).toBeNull();
      expect(el().querySelector('.test-preview')).toBeTruthy();
      expect(field()).toBeTruthy();
    });
  });

  describe('slots', () => {
    it('should render the avatar next to the body', () => {
      setOptions({ avatarTpl: slots.avatar() });

      expect(el().querySelector('.test-avatar')).toBeTruthy();
    });

    it('should render the footer', () => {
      setOptions({ footerTpl: slots.footer() });

      expect(el().querySelector('.test-footer')).toBeTruthy();
    });
  });

  describe('character counter', () => {
    it('should show the count against maxLength', () => {
      fixture.componentRef.setInput('value', 'Hello');
      setOptions({ maxLength: 140 });

      expect(el().textContent).toContain('5/140');
    });

    it('should not show a counter without maxLength', () => {
      fixture.componentRef.setInput('value', 'Hello');
      fixture.detectChanges();

      expect(el().textContent).not.toContain('5/');
    });
  });

  describe('actions', () => {
    it('should apply per-variant action classes with dark mode', () => {
      setOptions({ actions: ACTIONS });

      const [ghost, primary, secondary] = actionButtons();

      expect(primary.className).toContain('smart:bg-blue-600');
      expect(primary.className).toContain('smart:dark:bg-blue-500');
      expect(secondary.className).toContain('smart:ring-gray-300');
      expect(secondary.className).toContain('smart:dark:bg-white/10');
      expect(ghost.className).toContain('smart:hover:bg-gray-100');
      expect(ghost.className).toContain('smart:dark:hover:bg-white/10');
    });

    it('should default an action without variant to secondary', () => {
      setOptions({ actions: [{ id: 'x', label: 'X' }] });

      expect(actionButtons()[0].className).toContain('smart:ring-gray-300');
    });

    it('should emit actionClick with the action id and current value', () => {
      fixture.componentRef.setInput('value', 'message');
      setOptions({ actions: ACTIONS });
      const emitted: ITextareaActionClick[] = [];
      component.actionClick.subscribe((e) => emitted.push(e));

      actionButtons()[1].click();

      expect(emitted).toEqual([{ actionId: 'submit', value: 'message' }]);
    });

    it('should disable actions and not emit when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      setOptions({ actions: ACTIONS });
      const emitted: ITextareaActionClick[] = [];
      component.actionClick.subscribe((e) => emitted.push(e));

      actionButtons()[1].click();

      expect(actionButtons()[1].disabled).toBe(true);
      expect(emitted.length).toBe(0);
    });
  });

  it('should apply cssClass on the root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
