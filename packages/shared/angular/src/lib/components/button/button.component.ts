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

import { IButtonOptions } from '../../models';
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { ButtonStandardComponent } from './standard/standard.component';
import { outletContent } from '../base/outlet-content';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-button',
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
      <smart-button-standard
        [options]="options()"
        [disabled]="disabled()"
        [class]="cssClass()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </smart-button-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private injectedComponent = inject(BUTTON_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input.required<IButtonOptions>();
  disabled = input<boolean>(false);
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      options: this.options(),
      disabled: this.disabled(),
      cssClass: this.cssClass(),
    }),
  );

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);
}
