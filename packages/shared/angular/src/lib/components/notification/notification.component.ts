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

import { NotificationStandardComponent } from './standard/standard.component';
import { INotificationAction, INotificationOptions } from '../../models';
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-notification',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-notification-standard
        [title]="title()"
        [description]="description()"
        [iconName]="iconName()"
        [avatarUrl]="avatarUrl()"
        [actions]="actions()"
        [dismissible]="dismissible()"
        [options]="options()"
        [class]="cssClass()"
        (dismissed)="dismissed.emit()"
        (actionClick)="actionClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NotificationStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private injectedComponent = inject(NOTIFICATION_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  title = input.required<string>();
  description = input<string>();
  iconName = input<string>();
  avatarUrl = input<string>();
  actions = input<INotificationAction[]>([]);
  dismissible = input<boolean>(false);
  options = input<INotificationOptions>();
  cssClass = input<string>('', { alias: 'class' });

  dismissed = output<void>();
  actionClick = output<{ actionId: string }>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    title: this.title(),
    description: this.description(),
    iconName: this.iconName(),
    avatarUrl: this.avatarUrl(),
    actions: this.actions(),
    dismissible: this.dismissible(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
