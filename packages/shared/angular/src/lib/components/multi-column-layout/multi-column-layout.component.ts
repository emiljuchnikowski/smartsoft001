import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { MultiColumnLayoutStandardComponent } from './standard/standard.component';
import { IMultiColumnLayoutOptions } from '../../models';
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { outletContent } from '../base/outlet-content';

@Component({
  selector: 'smart-multi-column-layout',
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="
          componentType();
          inputs: componentInputs();
          content: projectedContent()
        "
      />
    } @else {
      <smart-multi-column-layout-standard
        [options]="options()"
        [class]="cssClass()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </smart-multi-column-layout-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MultiColumnLayoutStandardComponent,
    NgComponentOutlet,
    NgTemplateOutlet,
  ],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiColumnLayoutComponent {
  private injectedComponent = inject(
    MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
    {
      optional: true,
    },
  );

  options = input<IMultiColumnLayoutOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);
}
