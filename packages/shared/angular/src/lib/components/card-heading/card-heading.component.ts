import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { CardHeadingStandardComponent } from './standard/standard.component';
import { ICardHeadingOptions } from '../../models';
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-card-heading',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-card-heading-standard [options]="options()" [class]="cssClass()" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [CardHeadingStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeadingComponent {
  private injectedComponent = inject(CARD_HEADING_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ICardHeadingOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
