// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ISidebarNavOptions,
  SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
  SidebarNavigationBaseComponent,
  SidebarNavigationComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-sidebar-navigation',
  template: `
    <nav
      [class]="containerClasses()"
      [attr.aria-label]="options()?.ariaLabel ?? 'Sidebar'"
    >
      <!--
        resolvedGroups() is the protected helper of the base class: it merges
        the flat items list and the named groups into a single list.
      -->
      @for (group of resolvedGroups(); track $index) {
        <div class="docs-sidebar-navigation__group">
          @if (group.title) {
            <p class="docs-sidebar-navigation__group-title">
              {{ group.title }}
            </p>
          }

          <ul>
            @for (item of group.items; track item.id) {
              <li>
                @if (item.expandable) {
                  <button
                    type="button"
                    class="docs-sidebar-navigation__toggle"
                    [attr.aria-expanded]="isExpanded(item)"
                    (click)="toggleExpanded(item)"
                  >
                    {{ item.label }}
                  </button>

                  @if (isExpanded(item)) {
                    <ul class="docs-sidebar-navigation__children">
                      @for (child of item.children ?? []; track child.id) {
                        <li>
                          <a
                            class="docs-sidebar-navigation__child-link"
                            [href]="child.href"
                            (click)="itemClick.emit({ itemId: child.id })"
                          >
                            {{ child.label }}
                          </a>
                        </li>
                      }
                    </ul>
                  }
                } @else {
                  <a
                    class="docs-sidebar-navigation__link"
                    [href]="item.href"
                    [attr.aria-current]="item.current ? 'page' : null"
                    (click)="itemClick.emit({ itemId: item.id })"
                  >
                    @if (item.initial) {
                      <span class="docs-sidebar-navigation__initial">
                        {{ item.initial }}
                      </span>
                    }

                    <span>{{ item.label }}</span>

                    @if (item.badge !== undefined) {
                      <span class="docs-sidebar-navigation__badge">
                        {{ item.badge }}
                      </span>
                    }
                  </a>
                }
              </li>
            }
          </ul>
        </div>
      }

      @if (options()?.profile) {
        <a
          class="docs-sidebar-navigation__profile"
          [href]="options()?.profile?.href"
        >
          {{ options()?.profile?.name }}
        </a>
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSidebarNavigationComponent extends SidebarNavigationBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  readonly containerClasses = computed(() => {
    const classes = [
      'docs-sidebar-navigation',
      `docs-sidebar-navigation--${this.options()?.layout ?? 'light'}`,
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-sidebar-navigation-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarNavigationComponent],
  // The token swaps the standard navigation for the custom one everywhere
  // below this component, so consumers keep writing
  // `<smart-sidebar-navigation>`.
  providers: [
    {
      provide: SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSidebarNavigationComponent,
    },
  ],
  template: ` <smart-sidebar-navigation [options]="options" /> `,
})
export class SidebarNavigationCustomExampleComponent {
  readonly options: ISidebarNavOptions = {
    layout: 'light',
    ariaLabel: 'Sidebar',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '#', current: true },
      { id: 'team', label: 'Team', href: '#', badge: 5 },
      { id: 'projects', label: 'Projects', href: '#', badge: 12 },
      {
        id: 'teams',
        label: 'Teams',
        expandable: true,
        children: [
          { id: 'engineering', label: 'Engineering', href: '#' },
          { id: 'human-resources', label: 'Human Resources', href: '#' },
        ],
      },
    ],
    groups: [
      {
        id: 'your-teams',
        title: 'Your teams',
        items: [
          {
            id: 'engineering-team',
            label: 'Engineering',
            initial: 'E',
            href: '#',
          },
          { id: 'marketing-team', label: 'Marketing', initial: 'M', href: '#' },
        ],
      },
    ],
    profile: { name: 'Tom Cook', href: '#', srOnlyText: 'Your profile' },
  };
}
// #endregion
