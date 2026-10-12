import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  OnDestroy,
  Signal,
  signal,
} from '@angular/core';

import {
  IToastHostActionClick,
  ToastHostComponent,
} from './toast-host.component';

export interface IToastOptions {
  title?: string;
  message: string;
  /**
   * Milliseconds before the toast closes itself; 2000 when it is missing,
   * zero or negative.
   */
  duration?: number;
  buttons?: Array<IToastButton>;
}

export interface IToastButton {
  text: string;
  /** Kept for compatibility; the actions render in the order given. */
  position: 'start' | 'end';
  /** Runs on a click on the button; the toast closes afterwards. */
  handler: () => void;
}

export interface IToast extends IToastOptions {
  id: number;
  type: 'error' | 'info';
}

/** Milliseconds a toast stays without a positive `duration`. */
const DEFAULT_TOAST_DURATION = 2000;

/**
 * Short messages shown at the bottom of the screen. The toasts render at the
 * end of `<body>`, in a stack fixed to the bottom of the viewport, each
 * through `<smart-notification>` (the implementation registered for
 * `NOTIFICATION_STANDARD_COMPONENT_TOKEN`, so the preset with
 * `provideSmartPresets()`). A toast closes itself after its `duration`, on its
 * close button or after one of its buttons ran its handler. Error toasts are
 * announced assertively, info toasts politely. While an error lock is held
 * (`addLockError`), error toasts are swallowed, e.g. during a sign-out that
 * makes every pending request fail.
 */
@Injectable()
export class ToastService implements OnDestroy {
  /** The error locks held, shared by every instance. */
  static lockError = 0;

  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private readonly queue = signal<IToast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private host: ComponentRef<ToastHostComponent> | null = null;
  private nextId = 1;

  /** The toasts shown, oldest first. */
  readonly toasts: Signal<IToast[]> = this.queue.asReadonly();

  addLockError(): void {
    ++ToastService.lockError;
  }

  /** Releases one error lock; the count does not go below zero. */
  removeLockError(): void {
    ToastService.lockError = Math.max(0, ToastService.lockError - 1);
  }

  async error(config: IToastOptions): Promise<void> {
    if (ToastService.lockError) return;

    this.push('error', config);
  }

  async info(config: IToastOptions): Promise<void> {
    this.push('info', config);
  }

  /** Closes the toast `id`. */
  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);

    if (!this.queue().some((toast) => toast.id === id)) return;

    this.queue.update((toasts) => toasts.filter((toast) => toast.id !== id));
    this.render();
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.queue.set([]);
    this.destroyHost();
  }

  private push(type: IToast['type'], config: IToastOptions): void {
    const id = this.nextId++;
    const duration =
      config.duration && config.duration > 0
        ? config.duration
        : DEFAULT_TOAST_DURATION;

    this.queue.update((toasts) => [...toasts, { ...config, id, type }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), duration),
    );
    this.render();
  }

  private runAction({ id, index }: IToastHostActionClick): void {
    const toast = this.queue().find((item) => item.id === id);

    try {
      toast?.buttons?.[index]?.handler();
    } finally {
      this.dismiss(id);
    }
  }

  /** Shows the queue: mounts the host for the first toast, removes it after the last one. */
  private render(): void {
    const toasts = this.queue();

    if (!toasts.length) {
      this.destroyHost();
      return;
    }

    const host = this.host ?? this.createHost();

    host.setInput('toasts', toasts);
    host.changeDetectorRef.detectChanges();
  }

  private createHost(): ComponentRef<ToastHostComponent> {
    const host = createComponent(ToastHostComponent, {
      environmentInjector: this.environmentInjector,
    });

    host.instance.dismissed.subscribe((id) => this.dismiss(id));
    host.instance.actionClick.subscribe((click) => this.runAction(click));

    this.document.body.appendChild(host.location.nativeElement);
    this.appRef.attachView(host.hostView);
    this.host = host;

    return host;
  }

  private destroyHost(): void {
    if (!this.host) return;

    const element = this.host.location.nativeElement as HTMLElement;

    this.host.destroy();
    element.remove();
    this.host = null;
  }
}
