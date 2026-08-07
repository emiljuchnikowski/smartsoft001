import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getActionPanelActionClasses,
  getActionPanelCardClasses,
  getActionPanelDescriptionClasses,
  getActionPanelTitleClasses,
  getActionPanelWellClasses,
} from './preset-classes.util';
import { IActionPanelAction, SmartActionPanelLayout } from '../../../models';
import { ActionPanelStandardComponent } from '../standard/standard.component';

/**
 * Styled action-panel variation (preset).
 *
 * Renders the action-panel as a bordered card and realizes all eight
 * `SmartActionPanelLayout` arrangements through a `@switch`: the title,
 * description, optional content slot and action buttons are re-composed per
 * layout (row, split, well, etc.). Drop-in replacement for
 * `ActionPanelStandardComponent`: register it through
 * `ACTION_PANEL_STANDARD_COMPONENT_TOKEN` to restyle every
 * `<smart-action-panel>`, or use `<smart-action-panel-preset>` directly.
 */
@Component({
  selector: 'smart-action-panel-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ActionPanelPresetComponent extends ActionPanelStandardComponent {
  // NgComponentOutlet (used by ActionPanelComponent when this is registered
  // through ACTION_PANEL_STANDARD_COMPONENT_TOKEN) passes inputs by canonical
  // name, so the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected readonly titleClasses = getActionPanelTitleClasses();
  protected readonly descriptionClasses = getActionPanelDescriptionClasses();
  protected readonly wellClasses = getActionPanelWellClasses();

  protected layout = computed<SmartActionPanelLayout>(
    () => this.options()?.layout ?? 'simple',
  );

  protected panelClasses = computed(() =>
    `${getActionPanelCardClasses()} ${this.cssClass()}`.trim(),
  );

  protected actionClasses(variant: IActionPanelAction['variant']): string {
    return getActionPanelActionClasses(variant, this.layout() === 'with-link');
  }

  protected actionsContainerClasses = computed(() => {
    switch (this.layout()) {
      case 'right-button':
        return 'smart:flex smart:flex-col smart:gap-2';
      case 'top-right-button':
        return 'smart:flex smart:shrink-0 smart:gap-2';
      case 'with-link':
        return 'smart:mt-2 smart:flex smart:flex-wrap smart:gap-4';
      default:
        return 'smart:mt-4 smart:flex smart:flex-wrap smart:gap-2';
    }
  });
}
