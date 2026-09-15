// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  GRID_LIST_STANDARD_COMPONENT_TOKEN,
  GridListBaseComponent,
  GridListComponent,
  IGridListOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-grid-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3 class="docs-grid-list__title">{{ options()?.title }}</h3>
      }

      <ul
        class="docs-grid-list__items"
        [attr.data-columns]="options()?.columns ?? null"
      >
        @for (item of options()?.items ?? []; track item.id ?? $index) {
          <li class="docs-grid-list__item">
            @if (item.imageUrl) {
              <img
                class="docs-grid-list__image"
                [src]="item.imageUrl"
                [attr.alt]="item.imageAlt ?? ''"
              />
            }
            @if (item.href) {
              <a class="docs-grid-list__link" [attr.href]="item.href">
                {{ item.title }}
              </a>
            } @else {
              <span class="docs-grid-list__label">{{ item.title }}</span>
            }
            @if (item.description) {
              <p class="docs-grid-list__description">{{ item.description }}</p>
            }
          </li>
        }
      </ul>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGridListComponent extends GridListBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class'
  // alias, so a grid list registered through the token declares it explicitly.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-grid-list'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-grid-list-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GridListComponent],
  // The token swaps the standard grid list for the custom one everywhere
  // below this component, so consumers keep writing `<smart-grid-list>`.
  providers: [
    {
      provide: GRID_LIST_STANDARD_COMPONENT_TOKEN,
      useValue: CustomGridListComponent,
    },
  ],
  template: `<smart-grid-list [options]="options" />`,
})
export class GridListCustomExampleComponent {
  options: IGridListOptions = {
    title: 'Team',
    columns: 3,
    layout: 'cards',
    items: [
      {
        id: 'lindsay',
        title: 'Lindsay Walton',
        description: 'Front-end Developer',
        href: '/team/lindsay-walton',
      },
      { id: 'courtney', title: 'Courtney Henry', description: 'Designer' },
      { id: 'tom', title: 'Tom Cook', description: 'Director of Product' },
    ],
  };
}
// #endregion
