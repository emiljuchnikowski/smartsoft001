import { SmartStore } from '../../store';

export interface IToastButton {
  text: string;
  /** Kept for compatibility; the actions render in the order given. */
  position: 'start' | 'end';
  /** Runs on a click on the button; the toast closes afterwards. */
  handler: () => void;
}

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

export interface IToast extends IToastOptions {
  id: number;
  type: 'error' | 'info';
}

/** Milliseconds a toast stays without a positive `duration`. */
const DEFAULT_TOAST_DURATION = 2000;

/**
 * Short messages shown at the bottom of the screen. `SmartProvider` renders
 * the queue; any code with the service can push to it. A toast closes itself
 * after its `duration`, on its close button or after one of its buttons ran
 * its handler. Error toasts are announced assertively, info toasts politely.
 * While an error lock is held (`addLockError`), error toasts are swallowed,
 * e.g. during a sign-out that makes every pending request fail.
 */
export class ToastService {
  readonly toasts = new SmartStore<IToast[]>([]);

  private lockError = 0;
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  addLockError(): void {
    ++this.lockError;
  }

  /** Releases one error lock; the count does not go below zero. */
  removeLockError(): void {
    this.lockError = Math.max(0, this.lockError - 1);
  }

  async error(config: IToastOptions): Promise<void> {
    if (this.lockError) return;

    this.push('error', config);
  }

  async info(config: IToastOptions): Promise<void> {
    this.push('info', config);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);

    if (timer) clearTimeout(timer);

    this.timers.delete(id);
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private push(type: IToast['type'], config: IToastOptions): void {
    const id = this.nextId++;
    const duration =
      config.duration && config.duration > 0
        ? config.duration
        : DEFAULT_TOAST_DURATION;

    this.toasts.update((toasts) => [...toasts, { ...config, id, type }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), duration),
    );
  }
}
