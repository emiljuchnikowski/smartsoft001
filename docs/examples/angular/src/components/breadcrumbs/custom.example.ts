// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  BreadcrumbsBaseComponent,
  BreadcrumbsComponent,
  BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
  IBreadcrumbsOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-breadcrumbs',
  template: `
    <nav
      class="docs-breadcrumbs"
      [class]="cssClass()"
      [attr.aria-label]="options()?.ariaLabel ?? 'Breadcrumb'"
    >
      <ol class="docs-breadcrumbs__list">
        @for (item of options()?.items ?? []; track item.id; let last = $last) {
          <li class="docs-breadcrumbs__item">
            <a
              class="docs-breadcrumbs__link"
              [href]="item.href ?? '#'"
              [attr.aria-current]="item.current ? 'page' : null"
              (click)="select($event, item.id)"
            >
              {{ item.label }}
            </a>

            @if (!last) {
              <span class="docs-breadcrumbs__separator" aria-hidden="true">
                /
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBreadcrumbsComponent extends BreadcrumbsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  select(event: MouseEvent, itemId: string): void {
    event.preventDefault();
    this.itemClick.emit({ itemId });
  }
}

@Component({
  selector: 'docs-breadcrumbs-custom-example',
  imports: [BreadcrumbsComponent],
  providers: [
    {
      provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
      useValue: CustomBreadcrumbsComponent,
    },
  ],
  template: `<smart-breadcrumbs [options]="options" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsCustomExampleComponent {
  options: IBreadcrumbsOptions = {
    separator: 'slash',
    ariaLabel: 'Breadcrumb',
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'center', label: 'App Center', href: '#' },
      { id: 'app', label: 'Application', current: true },
    ],
  };
}
// #endregion
