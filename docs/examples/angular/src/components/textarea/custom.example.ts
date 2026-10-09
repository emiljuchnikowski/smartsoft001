// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  ITextareaOptions,
  TEXTAREA_STANDARD_COMPONENT_TOKEN,
  TextareaBaseComponent,
  TextareaComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-textarea',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.label) {
        <label
          class="docs-textarea__label"
          [attr.for]="options()?.name ?? null"
        >
          {{ options()!.label }}
          @if (options()?.required) {
            <span class="docs-textarea__required">*</span>
          }
        </label>
      }

      <textarea
        class="docs-textarea__field"
        [attr.id]="options()?.name ?? null"
        [attr.name]="options()?.name ?? null"
        [attr.placeholder]="placeholder() || null"
        [attr.maxlength]="options()?.maxLength ?? null"
        [rows]="options()?.rows ?? 3"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
      ></textarea>

      @if ((options()?.actions ?? []).length > 0) {
        <div class="docs-textarea__actions">
          @for (action of options()!.actions!; track action.id) {
            <button
              type="button"
              class="docs-textarea__action"
              [attr.data-variant]="action.variant ?? 'secondary'"
              [disabled]="disabled()"
              (click)="onActionClick(action.id)"
            >
              {{ action.label ?? action.id }}
            </button>
          }
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTextareaComponent extends TextareaBaseComponent {
  containerClasses = computed(() =>
    [
      'docs-textarea',
      `docs-textarea--${this.options()?.variant ?? 'simple'}`,
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  // `value` is a model on the base: the wrapper passes it in and writes the
  // typed text back to `<smart-textarea [(value)]="...">`.
  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }

  protected onActionClick(actionId: string): void {
    if (this.disabled()) return;
    this.actionClick.emit({ actionId, value: this.value() });
  }
}

@Component({
  selector: 'docs-textarea-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaComponent],
  // The token swaps the standard textarea for the custom one everywhere below
  // this component, so consumers keep writing `<smart-textarea>`.
  providers: [
    {
      provide: TEXTAREA_STANDARD_COMPONENT_TOKEN,
      useValue: CustomTextareaComponent,
    },
  ],
  // The wrapper forwards `value` both ways and re-emits `actionClick` of the
  // custom component.
  template: `
    <smart-textarea
      [(value)]="comment"
      placeholder="Add your comment..."
      [options]="options"
      (actionClick)="lastAction.set($event.actionId + ': ' + $event.value)"
    />
    @if (lastAction()) {
      <p>Last action: {{ lastAction() }}</p>
    }
  `,
})
export class TextareaCustomExampleComponent {
  readonly comment = signal('Looks good to me.');
  readonly lastAction = signal<string | null>(null);

  options: ITextareaOptions = {
    label: 'Comment',
    name: 'comment',
    rows: 4,
    maxLength: 280,
    required: true,
    variant: 'with-pill-actions',
    actions: [
      { id: 'cancel', label: 'Cancel', variant: 'ghost' },
      { id: 'submit', label: 'Send', variant: 'primary' },
    ],
  };
}
// #endregion
