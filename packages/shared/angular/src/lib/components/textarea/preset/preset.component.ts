import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { ITextareaAction } from '../../../models';
import { TextareaBaseComponent } from '../base';
import {
  SmartTextareaPresetVariant,
  TEXTAREA_ACTIONS,
  TEXTAREA_AVATAR,
  TEXTAREA_BODY,
  TEXTAREA_COUNTER,
  TEXTAREA_FOOTER,
  TEXTAREA_LABEL,
  TEXTAREA_PREVIEW_BELOW,
  TEXTAREA_PREVIEW_PANE,
  TEXTAREA_REQUIRED,
  TEXTAREA_ROOT,
  TEXTAREA_TABS,
  TEXTAREA_TOOLBAR,
  textareaActionClasses,
  textareaBarClasses,
  textareaBarInside,
  textareaFieldClasses,
  textareaFrameClasses,
  textareaTabClasses,
} from './preset-classes.util';

let nextId = 0;

/**
 * Styled textarea variation (preset).
 *
 * Drop-in replacement for `TextareaStandardComponent` — register it through
 * `TEXTAREA_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-textarea>`, or
 * use the `<smart-textarea-preset>` selector directly.
 *
 * Renders the Tailwind UI comment-form look and honours `options.variant`:
 * `simple` (outlined field, bar below), `with-avatar-actions` (outlined box
 * with the toolbar/actions bar inside), `with-underline` (bottom border only),
 * `with-pill-actions` (box with a divided bar and pill buttons) and
 * `with-preview` (Write / Preview tabs swapping the field for `previewTpl`).
 * It also honours `autoFocus` and shows a character counter for `maxLength`.
 */
@Component({
  selector: 'smart-textarea-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TextareaPresetComponent extends TextareaBaseComponent {
  // NgComponentOutlet (used by TextareaComponent when this is registered
  // through TEXTAREA_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass`.
  override cssClass = input<string>('');

  protected readonly fieldId = `smart-textarea-preset-${nextId++}`;
  protected readonly mode = signal<'write' | 'preview'>('write');

  private readonly fieldRef =
    viewChild<ElementRef<HTMLTextAreaElement>>('field');

  protected variant = computed<SmartTextareaPresetVariant>(
    () => this.options()?.variant ?? 'simple',
  );
  protected actions = computed<ITextareaAction[]>(
    () => this.options()?.actions ?? [],
  );
  protected hasBar = computed(
    () => !!this.options()?.toolbarTpl || this.actions().length > 0,
  );
  protected barInside = computed(() => textareaBarInside(this.variant()));
  protected hasTabs = computed(
    () => this.variant() === 'with-preview' && !!this.options()?.previewTpl,
  );
  protected showPreviewPane = computed(
    () => this.hasTabs() && this.mode() === 'preview',
  );

  protected rootClasses = computed(() =>
    [TEXTAREA_ROOT, this.cssClass()].filter(Boolean).join(' '),
  );
  protected fieldClasses = computed(() => textareaFieldClasses(this.variant()));
  protected frameClasses = computed(() => textareaFrameClasses(this.variant()));
  protected barClasses = computed(() => textareaBarClasses(this.variant()));

  protected readonly avatarClasses = TEXTAREA_AVATAR;
  protected readonly bodyClasses = TEXTAREA_BODY;
  protected readonly labelClasses = TEXTAREA_LABEL;
  protected readonly requiredClasses = TEXTAREA_REQUIRED;
  protected readonly toolbarClasses = TEXTAREA_TOOLBAR;
  protected readonly actionsClasses = TEXTAREA_ACTIONS;
  protected readonly tabsClasses = TEXTAREA_TABS;
  protected readonly previewPaneClasses = TEXTAREA_PREVIEW_PANE;
  protected readonly previewBelowClasses = TEXTAREA_PREVIEW_BELOW;
  protected readonly counterClasses = TEXTAREA_COUNTER;
  protected readonly footerClasses = TEXTAREA_FOOTER;

  constructor() {
    super();
    afterNextRender(() => {
      if (this.options()?.autoFocus) this.fieldRef()?.nativeElement.focus();
    });
  }

  protected actionClasses(action: ITextareaAction): string {
    return textareaActionClasses(action.variant, this.variant());
  }

  protected tabClasses(selected: boolean): string {
    return textareaTabClasses(selected);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }

  protected onActionClick(actionId: string): void {
    if (this.disabled()) return;
    this.actionClick.emit({ actionId, value: this.value() });
  }
}
