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
  ISectionHeadingOptions,
  SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
  SectionHeadingBaseComponent,
  SectionHeadingComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-section-heading',
  template: `
    <div [class]="containerClasses()">
      <div class="docs-section-heading__text">
        @if (options()?.label) {
          <p class="docs-section-heading__label">{{ options()?.label }}</p>
        }

        @if (options()?.title) {
          <h2 class="docs-section-heading__title">{{ options()?.title }}</h2>
        }

        @if (options()?.description) {
          <p class="docs-section-heading__description">
            {{ options()?.description }}
          </p>
        }
      </div>

      @if (options()?.actionsTpl) {
        <div class="docs-section-heading__actions">
          <ng-container [ngTemplateOutlet]="actionsTpl()" />
        </div>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionHeadingComponent extends SectionHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  // Templates travel inside `options`, which is a plain object, so slots keep
  // working even though NgComponentOutlet drops projected content.
  readonly actionsTpl = computed(
    () => this.options()?.actionsTpl as TemplateRef<unknown>,
  );

  readonly containerClasses = computed(() => {
    const classes = ['docs-section-heading'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-section-heading-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent],
  // The token swaps the standard heading for the custom one everywhere below
  // this component, so consumers keep writing `<smart-section-heading>`.
  providers: [
    {
      provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSectionHeadingComponent,
    },
  ],
  template: `
    <ng-template #actions>
      <a href="#" class="docs-section-heading__cta">Get started</a>
    </ng-template>

    <smart-section-heading [options]="buildOptions(actions)" />
  `,
})
export class SectionHeadingCustomExampleComponent {
  // A factory because an Angular template expression cannot spread the
  // TemplateRef declared above into an object literal.
  buildOptions(actions: TemplateRef<unknown>): ISectionHeadingOptions {
    return {
      label: 'New',
      title: 'Manage your team in one place',
      description:
        'A balanced two-column split of copy and imagery for the default layout.',
      actionsTpl: actions,
    };
  }
}
// #endregion
