// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  DROPDOWN_STANDARD_COMPONENT_TOKEN,
  DropdownBaseComponent,
  DropdownComponent,
  IDropdownItem,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-dropdown',
  template: `
    <div class="docs-dropdown" [class]="cssClass()">
      <button
        type="button"
        class="docs-dropdown__trigger"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
      >
        {{ triggerLabel() }}
      </button>

      @if (open()) {
        <ul class="docs-dropdown__menu" role="menu">
          @for (item of items(); track item.id) {
            @if (item.divider) {
              <li class="docs-dropdown__divider" role="separator"></li>
            } @else {
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  class="docs-dropdown__item"
                  [disabled]="item.disabled"
                  (click)="selectItem(item.id)"
                >
                  {{ item.label }}
                </button>
              </li>
            }
          }
        </ul>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDropdownComponent extends DropdownBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class'
  // alias, so a dropdown registered through the token declares it explicitly.
  override cssClass = input<string>('');

  // toggle(), selectItem() and close() come from DropdownBaseComponent:
  // selectItem() emits selectedItem and closes the menu for you.
}

@Component({
  selector: 'docs-dropdown-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownComponent],
  // The token swaps the standard dropdown for the custom one everywhere below
  // this component, so consumers keep writing `<smart-dropdown>`.
  providers: [
    {
      provide: DROPDOWN_STANDARD_COMPONENT_TOKEN,
      useValue: CustomDropdownComponent,
    },
  ],
  // NgComponentOutlet forwards inputs but not outputs, so `(selectedItem)` on
  // the wrapper stays silent once a custom implementation is registered -
  // handle the selection inside the custom component instead.
  template: `<smart-dropdown [items]="items" triggerLabel="Actions" />`,
})
export class DropdownCustomExampleComponent {
  items: IDropdownItem[] = [
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'sep', label: '', divider: true },
    { id: 'downloads', label: 'Downloads' },
  ];
}
// #endregion
