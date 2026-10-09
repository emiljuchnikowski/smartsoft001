// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  DRAWER_STANDARD_COMPONENT_TOKEN,
  DrawerBaseComponent,
  DrawerComponent,
  IDrawerOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-drawer',
  template: `
    @if (open()) {
      @if (options()?.withOverlay) {
        <div class="docs-drawer__overlay" (click)="close()"></div>
      }
      <aside
        role="dialog"
        aria-modal="true"
        [class]="panelClasses()"
        [attr.data-position]="options()?.position ?? 'right'"
      >
        @if (title()) {
          <header class="docs-drawer__header">
            <h2>{{ title() }}</h2>
            <button
              type="button"
              class="docs-drawer__close"
              aria-label="Close"
              (click)="close()"
            >
              &times;
            </button>
          </header>
        }
        <!--
          smart-drawer passes open, title, options and cssClass to a custom
          implementation (no other inputs), and its projected content to the
          implementation's default ng-content. This one renders a fixed body,
          so it declares no ng-content.
        -->
        <p class="docs-drawer__body">Your cart is empty.</p>
      </aside>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDrawerComponent extends DrawerBaseComponent {
  // `cssClass` comes from the base (alias `class`): the wrapper hands the
  // consumer's class to it under that name.
  panelClasses = computed(() => {
    const classes = ['docs-drawer__panel'];
    if (this.options()?.wide) classes.push('docs-drawer__panel--wide');
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-drawer-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DrawerComponent],
  // The token swaps the standard drawer for the custom one everywhere below
  // this component, so consumers keep writing `<smart-drawer>`.
  providers: [
    {
      provide: DRAWER_STANDARD_COMPONENT_TOKEN,
      useValue: CustomDrawerComponent,
    },
  ],
  template: `
    <smart-drawer [open]="true" title="Shopping cart" [options]="options" />
  `,
})
export class DrawerCustomExampleComponent {
  options: IDrawerOptions = { position: 'right', withOverlay: true };
}
// #endregion
