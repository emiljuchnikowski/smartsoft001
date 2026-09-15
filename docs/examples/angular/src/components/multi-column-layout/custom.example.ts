// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  IMultiColumnLayoutOptions,
  MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
  MultiColumnLayoutBaseComponent,
  MultiColumnLayoutComponent,
} from '@smartsoft001/angular';

/**
 * A custom multi column layout built on `MultiColumnLayoutBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs; the implementation
 * decides the column order and where each `TemplateRef` slot of
 * `IMultiColumnLayoutOptions` is projected.
 */
@Component({
  selector: 'docs-custom-multi-column-layout',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h1 class="docs-multi-column-layout__title">{{ options()!.title }}</h1>
      }

      @if (options()?.headerTpl) {
        <header class="docs-multi-column-layout__header">
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      }

      @if (options()?.navTpl) {
        <aside class="docs-multi-column-layout__nav">
          <ng-container [ngTemplateOutlet]="options()!.navTpl!" />
        </aside>
      }

      <!--
        smart-multi-column-layout renders a custom implementation through
        NgComponentOutlet, which does not forward projected content. Only
        options and cssClass arrive here, so the main column is owned by the
        implementation instead of relying on ng-content.
      -->
      <main class="docs-multi-column-layout__main">
        <p>Three unread conversations, oldest from Tuesday.</p>
      </main>

      @if (options()?.secondaryTpl) {
        <aside class="docs-multi-column-layout__secondary">
          <ng-container [ngTemplateOutlet]="options()!.secondaryTpl!" />
        </aside>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMultiColumnLayoutComponent extends MultiColumnLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-multi-column-layout'];
    const width = this.options()?.width;
    if (width) classes.push(`docs-multi-column-layout--${width}`);
    const secondaryWidth = this.options()?.secondaryWidth;
    if (secondaryWidth) {
      classes.push(`docs-multi-column-layout--secondary-${secondaryWidth}`);
    }
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against
 * `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN` makes every
 * `<smart-multi-column-layout>` in this injector render it instead of the
 * standard variation. The slots are `<ng-template>` references owned by this
 * host, because `IMultiColumnLayoutOptions` takes `TemplateRef`s.
 */
@Component({
  selector: 'docs-multi-column-layout-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiColumnLayoutComponent],
  providers: [
    {
      provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
      useValue: CustomMultiColumnLayoutComponent,
    },
  ],
  template: `
    <smart-multi-column-layout [options]="options()" />

    <ng-template #headerTpl>
      <span>Unread first</span>
    </ng-template>

    <ng-template #navTpl>
      <a href="#">Inbox</a>
      <a href="#">Drafts</a>
      <a href="#">Sent</a>
    </ng-template>

    <ng-template #secondaryTpl>
      <span>Storage: 4.2 GB of 15 GB used</span>
    </ng-template>
  `,
})
export class MultiColumnLayoutCustomExampleComponent {
  headerTpl = viewChild<TemplateRef<unknown>>('headerTpl');
  navTpl = viewChild<TemplateRef<unknown>>('navTpl');
  secondaryTpl = viewChild<TemplateRef<unknown>>('secondaryTpl');

  options = computed<IMultiColumnLayoutOptions>(() => ({
    title: 'Inbox',
    width: 'full',
    secondaryWidth: 'sm',
    headerTpl: this.headerTpl(),
    navTpl: this.navTpl(),
    secondaryTpl: this.secondaryTpl(),
  }));
}
// #endregion
