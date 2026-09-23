import {
  computed,
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import {
  DynamicComponentType,
  IAlertButton,
  IAlertOptions,
} from '../../../models';

let nextAlertId = 0;

@Directive()
export abstract class AlertBaseComponent {
  static smartType: DynamicComponentType = 'alert';

  private readonly instanceId = `smart-alert-${nextAlertId++}`;

  readonly headerId = `${this.instanceId}-header`;
  readonly messageId = `${this.instanceId}-message`;

  options: InputSignal<IAlertOptions> = input.required<IAlertOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  dismissed: OutputEmitterRef<IAlertButton | null> =
    output<IAlertButton | null>();

  buttons: Signal<IAlertButton[]> = computed(
    () => this.options().buttons ?? [],
  );
  cancelButton: Signal<IAlertButton | null> = computed(
    () => this.buttons().find((button) => button.role === 'cancel') ?? null,
  );

  invoke(button: IAlertButton): void {
    const result = button.handler?.();

    if (result === false && button.role !== 'cancel') return;

    this.dismissed.emit(button);
  }

  cancel(): void {
    this.dismissed.emit(this.cancelButton());
  }

  onEscape(): void {
    this.cancel();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) return;
    if (this.options().backdropDismiss === false) return;

    this.cancel();
  }

  trapFocus(event: KeyboardEvent, container: HTMLElement): void {
    if (event.key !== 'Tab') return;

    const buttons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
    );

    if (!buttons.length) return;

    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    const active = container.ownerDocument.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  buttonClasses(button: IAlertButton): string {
    const base =
      'smart:rounded-md smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:shadow-sm smart:focus:outline-none smart:focus-visible:outline-2 smart:focus-visible:outline-offset-2';

    const role =
      button.role === 'cancel'
        ? 'smart:bg-white smart:text-gray-900 smart:border smart:border-gray-300 smart:hover:bg-gray-50 smart:dark:bg-gray-700 smart:dark:text-white smart:dark:border-gray-600 smart:dark:hover:bg-gray-600'
        : button.role === 'destructive'
          ? 'smart:bg-red-600 smart:text-white smart:hover:bg-red-500 smart:dark:bg-red-500 smart:dark:hover:bg-red-400'
          : 'smart:bg-blue-600 smart:text-white smart:hover:bg-blue-500 smart:dark:bg-blue-500 smart:dark:hover:bg-blue-400';

    const custom = Array.isArray(button.cssClass)
      ? button.cssClass.join(' ')
      : (button.cssClass ?? '');

    return `${base} ${role}${custom ? ` ${custom}` : ''}`;
  }
}
