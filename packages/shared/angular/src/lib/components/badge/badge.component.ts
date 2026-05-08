import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { BadgeStandardComponent } from './standard/standard.component';
import { IBadgeOptions, SmartBadgeColor } from '../../models';
import { BADGE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-badge',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-badge-standard
        [text]="text()"
        [color]="color()"
        [size]="size()"
        [options]="options()"
        [class]="cssClass()"
        (removed)="removed.emit()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [BadgeStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  private injectedComponent = inject(BADGE_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  text = input.required<string>();
  color = input<SmartBadgeColor>('gray');
  size = input<'sm' | 'md'>('md');
  options = input<IBadgeOptions>();
  cssClass = input<string>('', { alias: 'class' });

  removed = output<void>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    text: this.text(),
    color: this.color(),
    size: this.size(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
