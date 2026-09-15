// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
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
          smart-drawer renders a custom implementation through NgComponentOutlet,
          which forwards neither projected content nor extra inputs. Only open,
          title, options and cssClass arrive here, so a custom drawer renders its
          own body instead of relying on ng-content.
        -->
        <p class="docs-drawer__body">Your cart is empty.</p>
      </aside>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDrawerComponent extends DrawerBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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
