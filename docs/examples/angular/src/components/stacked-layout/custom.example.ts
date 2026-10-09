// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  IStackedLayoutOptions,
  STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
  StackedLayoutBaseComponent,
  StackedLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-stacked-layout',
  template: `
    <div [class]="containerClasses()">
      <header class="docs-stacked-layout__nav">
        @if (options()?.navTpl) {
          <nav>
            <ng-container [ngTemplateOutlet]="options()!.navTpl!" />
          </nav>
        }
      </header>

      @if (options()?.headerTpl) {
        <header class="docs-stacked-layout__header">
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      } @else if (options()?.title) {
        <header class="docs-stacked-layout__header">
          <h1>{{ options()!.title }}</h1>
        </header>
      }

      <!-- The content projected into <smart-stacked-layout> lands here. -->
      <main class="docs-stacked-layout__main">
        <ng-content />
      </main>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStackedLayoutComponent extends StackedLayoutBaseComponent {
  containerClasses = computed(() =>
    [
      'docs-stacked-layout',
      `docs-stacked-layout--${this.options()?.containerWidth ?? 'full'}`,
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-stacked-layout-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackedLayoutComponent],
  // The token swaps the standard layout for the custom one everywhere below
  // this component, so consumers keep writing `<smart-stacked-layout>`.
  providers: [
    {
      provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
      useValue: CustomStackedLayoutComponent,
    },
  ],
  template: `
    <ng-template #navTpl>
      <a href="#dashboard">Dashboard</a>
      <a href="#team">Team</a>
      <a href="#projects">Projects</a>
    </ng-template>

    <smart-stacked-layout [options]="options()">
      <p>Main content of the page.</p>
    </smart-stacked-layout>
  `,
})
export class StackedLayoutCustomExampleComponent {
  private navTpl = viewChild.required<TemplateRef<unknown>>('navTpl');

  // The navigation slot is a TemplateRef, so it is read from the host view.
  // computed() keeps the object identity stable between checks.
  options = computed<IStackedLayoutOptions>(() => ({
    title: 'Projects',
    containerWidth: 'xl',
    navTpl: this.navTpl(),
  }));
}
// #endregion
