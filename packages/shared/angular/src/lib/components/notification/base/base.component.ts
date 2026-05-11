import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  INotificationAction,
  INotificationOptions,
} from '../../../models';

@Directive()
export abstract class NotificationBaseComponent {
  static smartType: DynamicComponentType = 'notification';

  title: InputSignal<string> = input.required<string>();
  description: InputSignal<string | undefined> = input<string>();
  iconName: InputSignal<string | undefined> = input<string>();
  avatarUrl: InputSignal<string | undefined> = input<string>();
  actions: InputSignal<INotificationAction[]> = input<INotificationAction[]>(
    [],
  );
  dismissible: InputSignal<boolean> = input<boolean>(false);
  options: InputSignal<INotificationOptions | undefined> =
    input<INotificationOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  dismissed: OutputEmitterRef<void> = output<void>();
  actionClick: OutputEmitterRef<{ actionId: string }> = output<{
    actionId: string;
  }>();

  dismiss(): void {
    this.dismissed.emit();
  }

  invokeAction(actionId: string): void {
    this.actionClick.emit({ actionId });
  }
}
