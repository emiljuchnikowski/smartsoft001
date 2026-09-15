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
  IPageHeadingOptions,
  PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
  PageHeadingBaseComponent,
  PageHeadingComponent,
} from '@smartsoft001/angular';

/**
 * A custom page heading built on `PageHeadingBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs; the implementation
 * decides which `TemplateRef` slots of `IPageHeadingOptions` it renders and
 * in which order.
 */
@Component({
  selector: 'docs-custom-page-heading',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.breadcrumbsTpl) {
        <nav class="docs-page-heading__breadcrumbs" aria-label="Breadcrumb">
          <ng-container [ngTemplateOutlet]="options()!.breadcrumbsTpl!" />
        </nav>
      }

      <header class="docs-page-heading__header">
        <div>
          @if (options()?.title) {
            <h1 class="docs-page-heading__title">{{ options()!.title }}</h1>
          }
          @if (options()?.subtitle) {
            <p class="docs-page-heading__subtitle">{{ options()!.subtitle }}</p>
          }
          @if (options()?.metaTpl) {
            <div class="docs-page-heading__meta">
              <ng-container [ngTemplateOutlet]="options()!.metaTpl!" />
            </div>
          }
        </div>

        @if (options()?.actionsTpl) {
          <div class="docs-page-heading__actions">
            <ng-container [ngTemplateOutlet]="options()!.actionsTpl!" />
          </div>
        }
      </header>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageHeadingComponent extends PageHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-page-heading'];
    const layout = this.options()?.presentation?.layout;
    if (layout) classes.push(`docs-page-heading--${layout}`);
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against
 * `PAGE_HEADING_STANDARD_COMPONENT_TOKEN` makes every `<smart-page-heading>`
 * in this injector render it instead of the standard variation. The slots are
 * `<ng-template>` references owned by this host, because
 * `IPageHeadingOptions` takes `TemplateRef`s.
 */
@Component({
  selector: 'docs-page-heading-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent],
  providers: [
    {
      provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
      useValue: CustomPageHeadingComponent,
    },
  ],
  template: `
    <smart-page-heading [options]="options()" />

    <ng-template #breadcrumbsTpl>
      <a href="#">Jobs</a>
      <span aria-hidden="true">/</span>
      <span>Engineering</span>
    </ng-template>

    <ng-template #metaTpl>
      <span>Remote</span>
      <span>$120k - $140k</span>
    </ng-template>

    <ng-template #actionsTpl>
      <button type="button">Edit</button>
      <button type="button">Publish</button>
    </ng-template>
  `,
})
export class PageHeadingCustomExampleComponent {
  breadcrumbsTpl = viewChild<TemplateRef<unknown>>('breadcrumbsTpl');
  metaTpl = viewChild<TemplateRef<unknown>>('metaTpl');
  actionsTpl = viewChild<TemplateRef<unknown>>('actionsTpl');

  options = computed<IPageHeadingOptions>(() => ({
    title: 'Back End Developer',
    subtitle: 'Full-time, Engineering',
    breadcrumbsTpl: this.breadcrumbsTpl(),
    metaTpl: this.metaTpl(),
    actionsTpl: this.actionsTpl(),
    presentation: { layout: 'links-right' },
  }));
}
// #endregion
