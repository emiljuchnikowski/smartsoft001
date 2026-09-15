// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  ISelectMenuOptions,
  SELECT_MENU_STANDARD_COMPONENT_TOKEN,
  SelectMenuBaseComponent,
  SelectMenuComponent,
  SelectMenuValue,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-select-menu',
  template: `
    <div [class]="containerClasses()">
      <button
        type="button"
        class="docs-select-menu__trigger"
        [disabled]="disabled()"
        [attr.aria-expanded]="expanded()"
        [attr.aria-label]="options()?.ariaLabel"
        (click)="toggle()"
      >
        {{ currentLabel() ?? options()?.placeholder ?? 'Select' }}
      </button>

      @if (expanded()) {
        <ul class="docs-select-menu__list" role="listbox">
          @for (item of items(); track item.value) {
            <li
              role="option"
              class="docs-select-menu__option"
              [attr.aria-selected]="value() === item.value"
              [attr.aria-disabled]="item.disabled ?? false"
              (click)="pick(item.value, item.disabled ?? false)"
            >
              {{ item.label }}
            </li>
          }
        </ul>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectMenuComponent extends SelectMenuBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  readonly expanded = signal(false);

  readonly items = computed(() => this.options()?.items ?? []);

  readonly currentLabel = computed(
    () => this.items().find((item) => item.value === this.value())?.label,
  );

  readonly containerClasses = computed(() => {
    const classes = ['docs-select-menu'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  toggle(): void {
    if (this.disabled()) return;
    this.expanded.update((open) => !open);
  }

  pick(next: SelectMenuValue, itemDisabled: boolean): void {
    if (itemDisabled) return;
    // select() is the base class API: it ignores the call while disabled.
    this.select(next);
    this.expanded.set(false);
  }
}

@Component({
  selector: 'docs-select-menu-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectMenuComponent],
  // The token swaps the standard native select for the custom listbox
  // everywhere below this component, so consumers keep writing
  // `<smart-select-menu>`.
  providers: [
    {
      provide: SELECT_MENU_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSelectMenuComponent,
    },
  ],
  // NgComponentOutlet forwards `value` as a plain input, so the initial value
  // reaches the custom component but its own selections stay inside it.
  template: ` <smart-select-menu [(value)]="selected" [options]="options" /> `,
})
export class SelectMenuCustomExampleComponent {
  readonly selected = signal<SelectMenuValue>(null);

  readonly options: ISelectMenuOptions = {
    placeholder: 'Choose a country',
    ariaLabel: 'Country',
    items: [
      { value: 'pl', label: 'Poland' },
      { value: 'de', label: 'Germany' },
      { value: 'us', label: 'United States' },
    ],
  };
}
// #endregion
