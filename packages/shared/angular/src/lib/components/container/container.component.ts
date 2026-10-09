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

import { ContainerStandardComponent } from './standard/standard.component';
import { IContainerOptions } from '../../models';
import { CONTAINER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { outletContent } from '../base/outlet-content';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-container',
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
      <smart-container-standard [options]="options()" [class]="cssClass()">
        <ng-container [ngTemplateOutlet]="content" />
      </smart-container-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ContainerStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  private injectedComponent = inject(CONTAINER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IContainerOptions>();
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
