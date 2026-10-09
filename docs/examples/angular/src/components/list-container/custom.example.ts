// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  IListContainerOptions,
  LIST_CONTAINER_STANDARD_COMPONENT_TOKEN,
  ListContainerBaseComponent,
  ListContainerComponent,
} from '@smartsoft001/angular';

/**
 * A custom list container built on `ListContainerBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs; the implementation
 * decides how the rows are framed and separated. `<smart-list-container>`
 * projects its content into the implementation's `<ng-content />`.
 */
@Component({
  selector: 'docs-custom-list-container',
  template: `
    <ul role="list" [class]="containerClasses()">
      <ng-content />
    </ul>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomListContainerComponent extends ListContainerBaseComponent {
  containerClasses = computed(() => {
    const classes = ['docs-list-container'];
    const variant = this.options()?.variant;
    if (variant) classes.push(`docs-list-container--${variant}`);
    // No built-in container reads `fullWidthOnMobile`: a custom one may.
    if (this.options()?.fullWidthOnMobile) {
      classes.push('docs-list-container--full-width-mobile');
    }
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against
 * `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN` makes every
 * `<smart-list-container>` in this injector render it instead of the standard
 * variation.
 */
@Component({
  selector: 'docs-list-container-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListContainerComponent],
  providers: [
    {
      provide: LIST_CONTAINER_STANDARD_COMPONENT_TOKEN,
      useValue: CustomListContainerComponent,
    },
  ],
  template: `
    <smart-list-container [options]="options">
      @for (member of members; track member.name) {
        <li class="docs-list-container__item">
          <span class="docs-list-container__name">{{ member.name }}</span>
          <span class="docs-list-container__role">{{ member.role }}</span>
        </li>
      }
    </smart-list-container>
  `,
})
export class ListContainerCustomExampleComponent {
  options: IListContainerOptions = {
    variant: 'separate-cards',
    fullWidthOnMobile: true,
  };

  members = [
    { name: 'Lindsay Walton', role: 'Front-end Developer' },
    { name: 'Courtney Henry', role: 'Designer' },
    { name: 'Tom Cook', role: 'Director of Product' },
  ];
}
// #endregion
