// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  IVerticalNavOptions,
  VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
  VerticalNavigationBaseComponent,
  VerticalNavigationComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-vertical-navigation',
  template: `
    <nav
      [class]="containerClasses()"
      [attr.aria-label]="options()?.ariaLabel ?? 'Sidebar'"
    >
      <!--
        The base normalizes options.items and options.groups into one list of
        groups, so the implementation only has to render groups.
      -->
      @for (group of groups(); track group.id ?? $index) {
        <div class="docs-vertical-nav__group">
          @if (group.title) {
            <div class="docs-vertical-nav__group-title">{{ group.title }}</div>
          }
          <ul role="list">
            @for (item of group.items; track item.id) {
              <li [class]="itemClasses(item.current)">
                @if (item.href) {
                  <a
                    [href]="item.href"
                    [attr.aria-current]="item.current ? 'page' : null"
                  >
                    @if (item.initial) {
                      <span class="docs-vertical-nav__initial">
                        {{ item.initial }}
                      </span>
                    }
                    <span>{{ item.label ?? item.id }}</span>
                    @if (item.badge !== undefined && item.badge !== null) {
                      <span class="docs-vertical-nav__badge">
                        {{ item.badge }}
                      </span>
                    }
                  </a>
                } @else {
                  <button type="button" (click)="onItemClick(item.id)">
                    {{ item.label ?? item.id }}
                  </button>
                }
              </li>
            }
          </ul>
        </div>
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomVerticalNavigationComponent extends VerticalNavigationBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  groups = computed(() => this.resolvedGroups());

  containerClasses = computed(() =>
    [
      'docs-vertical-nav',
      `docs-vertical-nav--${this.options()?.layout ?? 'simple'}`,
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected itemClasses(current: boolean | undefined): string {
    return current
      ? 'docs-vertical-nav__item docs-vertical-nav__item--current'
      : 'docs-vertical-nav__item';
  }

  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }
}

@Component({
  selector: 'docs-vertical-navigation-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VerticalNavigationComponent],
  // The token swaps the standard navigation for the custom one everywhere below
  // this component, so consumers keep writing `<smart-vertical-navigation>`.
  providers: [
    {
      provide: VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
      useValue: CustomVerticalNavigationComponent,
    },
  ],
  // NgComponentOutlet forwards inputs only, so the wrapper's (itemClick) stays
  // silent: the custom implementation emits it instead.
  template: `<smart-vertical-navigation [options]="options" />`,
})
export class VerticalNavigationCustomExampleComponent {
  // `items` and `groups` can be combined: the base puts the loose items in a
  // first, untitled group and appends the explicit groups after them.
  options: IVerticalNavOptions = {
    layout: 'with-badges',
    ariaLabel: 'Sidebar',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
      { id: 'team', label: 'Team', href: '#team', current: true, badge: 5 },
      { id: 'calendar', label: 'Calendar', href: '#calendar' },
    ],
    groups: [
      {
        id: 'projects',
        title: 'Projects',
        items: [
          {
            id: 'website',
            label: 'Website redesign',
            href: '#website',
            initial: 'W',
          },
          { id: 'new-project', label: 'New project' },
        ],
      },
    ],
  };
}
// #endregion
