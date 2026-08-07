import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IDropdownItem } from '../../../models';
import { DropdownBaseComponent } from '../base';
import {
  DROPDOWN_CONTAINER,
  DROPDOWN_GROUP,
  DROPDOWN_HEADER,
  DROPDOWN_HEADER_TEXT,
  DROPDOWN_ICON,
  DROPDOWN_ITEM,
  getDropdownChevronClasses,
  getDropdownMenuClasses,
  getDropdownTriggerClasses,
  SmartDropdownPresetVariant,
} from './preset-classes.util';

/**
 * Styled dropdown variation (preset).
 *
 * Drop-in replacement for `DropdownStandardComponent` — register it through
 * `DROPDOWN_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-dropdown>`, or use
 * the `<smart-dropdown-preset>` selector directly.
 *
 * Open/close is driven by the inherited `open` signal + a `(click)` toggle and
 * `@if`; Preline's JS plugin is NOT used, but its visual classes and ARIA
 * (`aria-haspopup` / `aria-expanded`) are preserved. Supports the shared
 * `SmartDropdownVariant` set: `simple`, `with-dividers`, `with-icons`,
 * `with-header` and a borderless `minimal` trigger (defaults to `simple`).
 */
@Component({
  selector: 'smart-dropdown-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownPresetComponent extends DropdownBaseComponent {
  // NgComponentOutlet (used by DropdownComponent when this is registered through
  // DROPDOWN_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected variant = computed<SmartDropdownPresetVariant>(
    () => this.options()?.variant ?? 'simple',
  );

  protected headerLabel = computed(() => this.options()?.headerLabel);

  protected showIcons = computed(
    () => this.variant() === 'with-icons' || this.variant() === 'with-header',
  );

  // Visible (non-divider) items, split into sections at each `divider` item when
  // the with-dividers variant is active so each group renders in its own block.
  protected groups = computed<IDropdownItem[][]>(() => {
    const items = this.items();
    if (this.variant() !== 'with-dividers') {
      return [items.filter((item) => !item.divider)];
    }

    const result: IDropdownItem[][] = [];
    let current: IDropdownItem[] = [];
    for (const item of items) {
      if (item.divider) {
        if (current.length) result.push(current);
        current = [];
      } else {
        current.push(item);
      }
    }
    if (current.length) result.push(current);
    return result;
  });

  protected containerClasses = DROPDOWN_CONTAINER;
  protected groupClasses = DROPDOWN_GROUP;
  protected itemClasses = DROPDOWN_ITEM;
  protected iconClasses = DROPDOWN_ICON;
  protected headerClasses = DROPDOWN_HEADER;
  protected headerTextClasses = DROPDOWN_HEADER_TEXT;

  protected triggerClasses = computed(() =>
    getDropdownTriggerClasses(this.variant()),
  );
  protected menuClasses = computed(() =>
    getDropdownMenuClasses(this.variant()),
  );
  protected chevronClasses = computed(() =>
    getDropdownChevronClasses(this.open()),
  );
}
