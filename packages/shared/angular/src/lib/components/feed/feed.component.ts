import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { FeedStandardComponent } from './standard';
import { IFeedOptions } from '../../models';
import { FEED_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-feed',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-feed-standard [options]="options()" [class]="cssClass()" />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [FeedStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedComponent {
  private injectedComponent = inject(FEED_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<IFeedOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
