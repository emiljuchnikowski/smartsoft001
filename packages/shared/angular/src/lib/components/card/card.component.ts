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

import { ICardOptions } from '../../models';
import { CARD_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { CardStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-card',
  template: `
    <ng-template #headerTpl>
      <ng-content select="[cardHeader]"></ng-content>
    </ng-template>
    <ng-template #bodyTpl>
      <ng-content></ng-content>
    </ng-template>
    <ng-template #footerTpl>
      <ng-content select="[cardFooter]"></ng-content>
    </ng-template>

    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-card-standard
        [options]="options()"
        [hasHeader]="hasHeader()"
        [hasFooter]="hasFooter()"
        [class]="cssClass()"
        [headerTpl]="headerTplRef()"
        [bodyTpl]="bodyTplRef()"
        [footerTpl]="footerTplRef()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [CardStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  private injectedComponent = inject(CARD_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ICardOptions>();
  hasHeader = input<boolean>(false);
  hasFooter = input<boolean>(false);
  cssClass = input<string>('', { alias: 'class' });

  headerTplRef = viewChild.required<TemplateRef<unknown>>('headerTpl');
  bodyTplRef = viewChild.required<TemplateRef<unknown>>('bodyTpl');
  footerTplRef = viewChild.required<TemplateRef<unknown>>('footerTpl');

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    hasHeader: this.hasHeader(),
    hasFooter: this.hasFooter(),
    cssClass: this.cssClass(),
    headerTpl: this.headerTplRef(),
    bodyTpl: this.bodyTplRef(),
    footerTpl: this.footerTplRef(),
  }));
}
