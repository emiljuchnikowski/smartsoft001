// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  ISidebarLayoutOptions,
  SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
  SidebarLayoutBaseComponent,
  SidebarLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-sidebar-layout',
  template: `
    <div
      [class]="containerClasses()"
      [attr.data-position]="options()?.sidebarPosition ?? 'left'"
    >
      <aside class="docs-sidebar-layout__sidebar">
        @if (sidebarTpl()) {
          <ng-container [ngTemplateOutlet]="sidebarTpl()!" />
        }
      </aside>

      <main class="docs-sidebar-layout__main">
        @if (headerTpl()) {
          <header class="docs-sidebar-layout__header">
            <ng-container [ngTemplateOutlet]="headerTpl()!" />
          </header>
        } @else if (options()?.title) {
          <h1 class="docs-sidebar-layout__title">{{ options()?.title }}</h1>
        }

        <!--
          smart-sidebar-layout renders a custom implementation through
          NgComponentOutlet, which drops projected content, so <ng-content />
          would stay empty here. A custom layout either renders its own body or
          takes it from a template passed inside the options object.
        -->
        <p class="docs-sidebar-layout__body">
          Main content rendered by the custom layout.
        </p>
      </main>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSidebarLayoutComponent extends SidebarLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  readonly sidebarTpl = computed(
    () => this.options()?.sidebarTpl as TemplateRef<unknown> | undefined,
  );

  readonly headerTpl = computed(
    () => this.options()?.headerTpl as TemplateRef<unknown> | undefined,
  );

  readonly containerClasses = computed(() => {
    const classes = ['docs-sidebar-layout'];
    if (this.options()?.condensed)
      classes.push('docs-sidebar-layout--condensed');
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-sidebar-layout-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarLayoutComponent],
  // The token swaps the standard layout for the custom one everywhere below
  // this component, so consumers keep writing `<smart-sidebar-layout>`.
  providers: [
    {
      provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSidebarLayoutComponent,
    },
  ],
  template: `
    <ng-template #sidebar>
      <nav aria-label="Main">
        <a href="#">Overview</a>
        <a href="#">Team</a>
        <a href="#">Projects</a>
      </nav>
    </ng-template>

    <smart-sidebar-layout [options]="buildOptions(sidebar)" />
  `,
})
export class SidebarLayoutCustomExampleComponent {
  // A factory because an Angular template expression cannot spread the
  // TemplateRef declared above into an object literal.
  buildOptions(sidebar: TemplateRef<unknown>): ISidebarLayoutOptions {
    return {
      title: 'Dashboard',
      sidebarTpl: sidebar,
      sidebarPosition: 'left',
      condensed: false,
    };
  }
}
// #endregion
