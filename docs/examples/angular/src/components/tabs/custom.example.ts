// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ITabsOptions,
  TABS_STANDARD_COMPONENT_TOKEN,
  TabsBaseComponent,
  TabsComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-tabs',
  template: `
    <nav
      [class]="containerClasses()"
      [attr.aria-label]="options()?.ariaLabel ?? 'Tabs'"
    >
      @for (item of options()?.items ?? []; track item.id) {
        <button
          type="button"
          [class]="tabClasses(item.id)"
          [attr.aria-current]="isCurrent(item.id) ? 'page' : null"
          (click)="select(item.id)"
        >
          {{ item.label ?? item.id }}
          @if (item.badge !== undefined && item.badge !== null) {
            <span class="docs-tabs__badge">{{ item.badge }}</span>
          }
        </button>
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTabsComponent extends TabsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-tabs', this.cssClass()].filter(Boolean).join(' '),
  );

  // selectedId is a model on the base: the implementation updates it and
  // announces the change through the tabChange output.
  select(tabId: string): void {
    this.selectedId.set(tabId);
    this.tabChange.emit({ tabId });
  }

  protected isCurrent(tabId: string): boolean {
    return this.selectedId() === tabId;
  }

  protected tabClasses(tabId: string): string {
    return this.isCurrent(tabId)
      ? 'docs-tabs__tab docs-tabs__tab--current'
      : 'docs-tabs__tab';
  }
}

@Component({
  selector: 'docs-tabs-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent],
  // The token swaps the standard tabs for the custom one everywhere below this
  // component, so consumers keep writing `<smart-tabs>`.
  providers: [
    {
      provide: TABS_STANDARD_COMPONENT_TOKEN,
      useValue: CustomTabsComponent,
    },
  ],
  // NgComponentOutlet forwards inputs only, so the wrapper's (tabChange) and
  // (selectedIdChange) stay silent here: selection lives in the custom
  // component and `selectedId` below is the initial value.
  template: `<smart-tabs [options]="options" [selectedId]="selectedId" />`,
})
export class TabsCustomExampleComponent {
  selectedId = 'billing';

  options: ITabsOptions = {
    layout: 'underline',
    ariaLabel: 'Account sections',
    showMobileSelect: false,
    items: [
      { id: 'account', label: 'Account' },
      { id: 'billing', label: 'Billing' },
      { id: 'members', label: 'Members', badge: 12 },
    ],
  };
}
// #endregion
