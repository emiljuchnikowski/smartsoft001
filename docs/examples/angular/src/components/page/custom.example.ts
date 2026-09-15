// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  Type,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  IPageOptions,
  PAGE_VARIANT_COMPONENTS_TOKEN,
  PageBaseComponent,
  PageComponent,
  SmartPageVariant,
} from '@smartsoft001/angular';

/**
 * A custom page shell built on `PageBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs, the `back()` helper
 * that delegates to `Location`, and the `appService` / `hardwareService`
 * injections; the implementation owns the chrome around the body.
 */
@Component({
  selector: 'docs-custom-page',
  template: `
    <div [class]="containerClasses()">
      @if (!options()?.hideHeader) {
        @if (options()?.breadcrumbsTpl) {
          <nav class="docs-page__breadcrumbs" aria-label="Breadcrumb">
            <ng-container [ngTemplateOutlet]="options()!.breadcrumbsTpl!" />
          </nav>
        }

        <header class="docs-page__header">
          @if (options()?.showBackButton) {
            <button
              type="button"
              class="docs-page__back"
              aria-label="Go back"
              (click)="back()"
            >
              &larr;
            </button>
          }
          <h1 class="docs-page__title">{{ options()?.title }}</h1>
        </header>
      }

      <!--
        Unlike the other wrappers, smart-page wraps its own ng-content in a
        TemplateRef and passes it down as options.bodyTpl, so projected content
        survives the NgComponentOutlet hop.
      -->
      <section class="docs-page__body">
        @if (options()?.bodyTpl; as bodyTpl) {
          <ng-container [ngTemplateOutlet]="bodyTpl" />
        }
      </section>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageComponent extends PageBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-page', this.isMobile ? 'docs-page--mobile' : '', this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * The page wrapper resolves its shell from a map of variants rather than from
 * a single standard-component token, so the implementation is registered under
 * the variant name that `IPageOptions.variant` asks for. The map is merged
 * over the built-in one, so `'standard'` keeps working for everything else.
 */
const DOCS_PAGE_VARIANT_COMPONENTS: Partial<
  Record<SmartPageVariant, Type<PageBaseComponent>>
> = { docs: CustomPageComponent };

@Component({
  selector: 'docs-page-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageComponent],
  providers: [
    {
      provide: PAGE_VARIANT_COMPONENTS_TOKEN,
      useValue: DOCS_PAGE_VARIANT_COMPONENTS,
    },
  ],
  template: `
    <smart-page [options]="options()">
      <p>Account settings and permissions</p>
    </smart-page>

    <ng-template #breadcrumbsTpl>
      <a href="#">Users</a>
      <span aria-hidden="true">/</span>
      <span>Alice Johnson</span>
    </ng-template>
  `,
})
export class PageCustomExampleComponent {
  breadcrumbsTpl = viewChild<TemplateRef<unknown>>('breadcrumbsTpl');

  options = computed<IPageOptions>(() => ({
    title: 'Alice Johnson',
    variant: 'docs',
    showBackButton: true,
    breadcrumbsTpl: this.breadcrumbsTpl(),
  }));
}
// #endregion
