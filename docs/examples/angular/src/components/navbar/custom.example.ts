// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  INavbarOptions,
  NAVBAR_STANDARD_COMPONENT_TOKEN,
  NavbarBaseComponent,
  NavbarComponent,
} from '@smartsoft001/angular';

/**
 * A custom navbar built on `NavbarBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs, the `mobileMenuOpen`
 * model and the `itemClick` output; the implementation owns the markup and
 * decides when to emit.
 */
@Component({
  selector: 'docs-custom-navbar',
  template: `
    <nav [class]="containerClasses()">
      @if (options()?.logoUrl) {
        <a class="docs-navbar__logo" [href]="options()?.logoHref ?? '#'">
          <img [src]="options()!.logoUrl" [alt]="options()?.logoAlt ?? ''" />
        </a>
      }

      <ul class="docs-navbar__items">
        @for (item of options()?.items ?? []; track item.id) {
          <li>
            <a
              class="docs-navbar__item"
              [href]="item.href ?? '#'"
              [attr.aria-current]="item.current ? 'page' : null"
              (click)="itemClick.emit({ itemId: item.id })"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ul>

      <button
        type="button"
        class="docs-navbar__toggle"
        aria-label="Toggle navigation"
        [attr.aria-expanded]="mobileMenuOpen()"
        (click)="mobileMenuOpen.set(!mobileMenuOpen())"
      >
        &#9776;
      </button>

      @if (mobileMenuOpen()) {
        <ul class="docs-navbar__mobile">
          @for (item of options()?.items ?? []; track item.id) {
            <li>
              <a [href]="item.href ?? '#'">{{ item.label }}</a>
            </li>
          }
        </ul>
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomNavbarComponent extends NavbarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-navbar'];
    if (this.options()?.dark) classes.push('docs-navbar--dark');
    if (this.options()?.menuButtonOnLeft) {
      classes.push('docs-navbar--menu-left');
    }
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against `NAVBAR_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-navbar>` in this injector render it instead of the
 * standard variation.
 *
 * NgComponentOutlet forwards `mobileMenuOpen` as a plain input, so the model
 * the custom navbar writes to stays local; the wrapper's `(itemClick)` and
 * `(mobileMenuOpenChange)` never fire.
 */
@Component({
  selector: 'docs-navbar-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent],
  providers: [
    {
      provide: NAVBAR_STANDARD_COMPONENT_TOKEN,
      useValue: CustomNavbarComponent,
    },
  ],
  template: `<smart-navbar [options]="options" />`,
})
export class NavbarCustomExampleComponent {
  options: INavbarOptions = {
    layout: 'simple',
    dark: false,
    logoUrl: 'https://avatars.githubusercontent.com/u/10416742?s=200&v=4',
    logoAlt: 'Brand',
    logoHref: '#',
    items: [
      { id: 'landing', label: 'Landing', href: '#', current: true },
      { id: 'account', label: 'Account', href: '#' },
      { id: 'work', label: 'Work', href: '#' },
      { id: 'blog', label: 'Blog', href: '#' },
    ],
  };
}
// #endregion
