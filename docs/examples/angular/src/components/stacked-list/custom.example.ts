// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  IStackedListOptions,
  STACKED_LIST_STANDARD_COMPONENT_TOKEN,
  StackedListBaseComponent,
  StackedListComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-stacked-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3 class="docs-stacked-list__title">{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p class="docs-stacked-list__description">
          {{ options()!.description }}
        </p>
      }

      <ul role="list">
        @for (item of options()?.items ?? []; track item.id ?? $index) {
          <li class="docs-stacked-list__item">
            @if (item.avatarUrl) {
              <img
                class="docs-stacked-list__avatar"
                [src]="item.avatarUrl"
                alt=""
              />
            }
            <span class="docs-stacked-list__body">
              @if (item.href) {
                <a [attr.href]="item.href">{{ item.title }}</a>
              } @else {
                <span>{{ item.title }}</span>
              }
              @if (item.description) {
                <span class="docs-stacked-list__meta">
                  {{ item.description }}
                </span>
              }
            </span>
            @if (item.meta) {
              <span class="docs-stacked-list__joined">{{ item.meta }}</span>
            }
          </li>
        }
      </ul>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStackedListComponent extends StackedListBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-stacked-list',
      this.options()?.withDividers ? 'docs-stacked-list--divided' : '',
      this.options()?.fullWidthOnMobile ? 'docs-stacked-list--bleed' : '',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-stacked-list-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackedListComponent],
  // The token swaps the standard list for the custom one everywhere below this
  // component, so consumers keep writing `<smart-stacked-list>`.
  providers: [
    {
      provide: STACKED_LIST_STANDARD_COMPONENT_TOKEN,
      useValue: CustomStackedListComponent,
    },
  ],
  template: `<smart-stacked-list [options]="options" />`,
})
export class StackedListCustomExampleComponent {
  // withDividers and fullWidthOnMobile are styling hints: the standard list
  // ignores them, a custom implementation decides what they mean.
  options: IStackedListOptions = {
    title: 'Team members',
    description: 'People with access to this workspace.',
    withDividers: true,
    items: [
      {
        id: '1',
        title: 'Lindsay Walton',
        description: 'lindsay.walton@example.com',
        meta: 'Joined 12 January 2026',
      },
      {
        id: '2',
        title: 'Courtney Henry',
        description: 'courtney.henry@example.com',
        meta: 'Joined 3 February 2026',
      },
      {
        id: '3',
        title: 'Tom Cook',
        description: 'tom.cook@example.com',
        meta: 'Joined 27 February 2026',
      },
    ],
  };
}
// #endregion
