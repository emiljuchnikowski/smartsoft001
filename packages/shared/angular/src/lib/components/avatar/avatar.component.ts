import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { AvatarStandardComponent } from './standard/standard.component';
import {
  IAvatarItem,
  IAvatarOptions,
  SmartAvatarShape,
  SmartAvatarSize,
} from '../../models';
import { AVATAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-avatar',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-avatar-standard
        [imageUrl]="imageUrl()"
        [initials]="initials()"
        [size]="size()"
        [shape]="shape()"
        [notificationPosition]="notificationPosition()"
        [group]="group()"
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [AvatarStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  private injectedComponent = inject(AVATAR_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  imageUrl = input<string>();
  initials = input<string>();
  size = input<SmartAvatarSize>('md');
  shape = input<SmartAvatarShape>('circle');
  notificationPosition = input<'top' | 'bottom'>();
  group = input<IAvatarItem[]>();
  options = input<IAvatarOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    imageUrl: this.imageUrl(),
    initials: this.initials(),
    size: this.size(),
    shape: this.shape(),
    notificationPosition: this.notificationPosition(),
    group: this.group(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
