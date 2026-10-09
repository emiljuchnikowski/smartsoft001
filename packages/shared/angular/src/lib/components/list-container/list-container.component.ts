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

import { ListContainerStandardComponent } from './standard/standard.component';
import { IListContainerOptions } from '../../models';
import { LIST_CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { outletContent } from '../base/outlet-content';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-list-container',
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
      <smart-list-container-standard [options]="options()" [class]="cssClass()">
        <ng-container [ngTemplateOutlet]="content" />
      </smart-list-container-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ListContainerStandardComponent,
    NgComponentOutlet,
    NgTemplateOutlet,
  ],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListContainerComponent {
  private injectedComponent = inject(LIST_CONTAINER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IListContainerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      options: this.options(),
      cssClass: this.cssClass(),
    }),
  );

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);
}
