import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SmartModalFooterStyle, SmartModalVariant } from '../../../models';
import { ModalBaseComponent } from '../base';
import {
  getModalActionClasses,
  getModalFooterClasses,
  getModalPanelClasses,
  getModalWrapperClasses,
  MODAL_BACKDROP,
  MODAL_BODY,
  MODAL_DESCRIPTION,
  MODAL_DISMISS,
  MODAL_HEADER,
  MODAL_TITLE,
} from './preset-classes.util';

/**
 * Styled modal variation (preset).
 *
 * Drop-in replacement for `ModalStandardComponent` — register it through
 * `MODAL_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-modal>`, or use the
 * `<smart-modal-preset>` selector directly.
 *
 * Preline's Overlay JS plugin is NOT used: open/close and backdrop dismiss are
 * driven by the existing `open` model + `close()`/`invokeAction()` API with
 * `@if` and `(click)`, while keeping the translated Preline visual classes and
 * the dialog ARIA contract (`role="dialog"`, `aria-modal="true"`).
 */
@Component({
  selector: 'smart-modal-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ModalPresetComponent extends ModalBaseComponent {
  // Declared without the inherited `class` alias. <smart-modal> resolves its
  // inputs to the names this component declares (outletInputs), so the class
  // passed to the wrapper still lands here; used directly, the preset takes the
  // extra classes as `[cssClass]`.
  override cssClass = input<string>('');

  protected variant = computed<SmartModalVariant>(
    () => this.options()?.variant ?? 'centered',
  );

  protected footerStyle = computed<SmartModalFooterStyle>(
    () => this.options()?.footerStyle ?? 'default',
  );

  protected withDismiss = computed(() => Boolean(this.options()?.withDismiss));

  protected readonly backdropClasses = MODAL_BACKDROP;
  protected readonly headerClasses = MODAL_HEADER;
  protected readonly titleClasses = MODAL_TITLE;
  protected readonly dismissClasses = MODAL_DISMISS;
  protected readonly bodyClasses = MODAL_BODY;
  protected readonly descriptionClasses = MODAL_DESCRIPTION;

  protected wrapperClasses = computed(() =>
    getModalWrapperClasses(this.variant()),
  );
  protected panelClasses = computed(() => getModalPanelClasses(this.variant()));
  protected footerClasses = computed(() =>
    getModalFooterClasses(this.variant(), this.footerStyle()),
  );

  protected actionClasses(variant?: string): string {
    return getModalActionClasses(
      variant as Parameters<typeof getModalActionClasses>[0],
    );
  }

  protected onBackdropClick(event: MouseEvent): void {
    // Only dismiss when the backdrop itself is clicked, not the panel.
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }
}
