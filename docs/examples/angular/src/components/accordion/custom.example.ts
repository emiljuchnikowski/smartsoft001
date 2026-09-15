// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  AccordionBaseComponent,
  IAccordionOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-accordion',
  imports: [NgTemplateOutlet],
  template: `
    <div [class]="containerClasses()">
      <button
        type="button"
        class="docs-accordion__header"
        [disabled]="options()?.disabled ?? false"
        [attr.aria-expanded]="show()"
        (click)="toggle()"
      >
        <ng-container [ngTemplateOutlet]="headerTpl()" />
        <span aria-hidden="true">{{ show() ? '-' : '+' }}</span>
      </button>

      @if (show()) {
        <div class="docs-accordion__body">
          <ng-container [ngTemplateOutlet]="bodyTpl()" />
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccordionComponent extends AccordionBaseComponent {
  containerClasses = computed(() =>
    ['docs-accordion', ...this.sharedContainerClasses(), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}

// The accordion has no standard-component token, so a custom implementation is
// rendered directly by its own selector instead of being injected into
// <smart-accordion>. The required headerTpl / bodyTpl inputs are <ng-template>
// references supplied by the host.
@Component({
  selector: 'docs-accordion-custom-example',
  imports: [CustomAccordionComponent],
  template: `
    <ng-template #headerTpl
      >What is the best thing about Switzerland?</ng-template
    >
    <ng-template #bodyTpl
      >I don't know, but the flag is a big plus.</ng-template
    >

    <docs-custom-accordion
      [headerTpl]="headerTpl"
      [bodyTpl]="bodyTpl"
      [(show)]="open"
      [options]="options"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionCustomExampleComponent {
  open = signal(false);

  options: IAccordionOptions = { disabled: false };
}
// #endregion
