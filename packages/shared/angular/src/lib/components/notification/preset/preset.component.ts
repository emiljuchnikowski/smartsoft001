import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { INotificationAction, SmartNotificationVariant } from '../../../models';
import { NotificationBaseComponent } from '../base';
import {
  getNotificationActionClasses,
  getNotificationActionsRowClasses,
  getNotificationAvatarClasses,
  getNotificationCloseClasses,
  getNotificationContainerClasses,
  getNotificationDescriptionClasses,
  getNotificationIconClasses,
  getNotificationMessageClasses,
  getNotificationTitleClasses,
} from './preset-classes.util';

let nextId = 0;

/**
 * Styled notification (toast) variation (preset).
 *
 * Drop-in replacement for `NotificationStandardComponent` — register it through
 * `NOTIFICATION_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-notification>`,
 * or use the `<smart-notification-preset>` selector directly.
 *
 * Renders the translated Preline toast looks, selected via `options.variant`
 * (defaults to `simple`): `simple`, `condensed`, `with-actions-below`,
 * `with-buttons-below`, `with-split-buttons` and `with-avatar`. Open/close state
 * is Angular-driven (the `dismiss()` output), so no Preline JS runtime is needed.
 */
@Component({
  selector: 'smart-notification-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPresetComponent extends NotificationBaseComponent {
  // Declared without the inherited `class` alias. <smart-notification> resolves
  // its inputs to the names this component declares (outletInputs), so the
  // class passed to the wrapper still lands here; used directly, the preset
  // takes the extra classes as `[cssClass]`.
  override cssClass = input<string>('');

  protected readonly labelId = `smart-notification-preset-${nextId++}`;

  protected variant = computed<SmartNotificationVariant>(
    () => this.options()?.variant ?? 'simple',
  );

  protected ariaLive = computed<'polite' | 'assertive'>(
    () => this.options()?.ariaLive ?? 'polite',
  );

  protected containerClasses = computed(() =>
    getNotificationContainerClasses(),
  );
  protected titleClasses = computed(() => getNotificationTitleClasses());
  protected messageClasses = computed(() => getNotificationMessageClasses());
  protected descriptionClasses = computed(() =>
    getNotificationDescriptionClasses(),
  );
  protected iconClasses = computed(() => getNotificationIconClasses());
  protected avatarClasses = computed(() => getNotificationAvatarClasses());
  protected closeInlineClasses = computed(() =>
    getNotificationCloseClasses(false),
  );
  protected closeAbsoluteClasses = computed(() =>
    getNotificationCloseClasses(true),
  );
  protected actionsRowClasses = computed(() =>
    getNotificationActionsRowClasses(),
  );

  protected actionClasses(action: INotificationAction): string {
    return getNotificationActionClasses(
      this.variant(),
      action.variant ?? 'primary',
    );
  }
}
