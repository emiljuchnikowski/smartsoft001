import type { ComponentType } from 'react';

import { SmartStore } from '../../store';

export interface IModalServiceOptions {
  /** Rendered in the modal with `props` and a `dismiss(data)` prop. */
  component: ComponentType<any>;
  props?: Record<string, unknown>;
  /**
   * `'bottom'` opens the modal as a bottom sheet (the `'bottom-sheet'` modal
   * variant: docked to the bottom of the viewport, full width up to a max
   * width) and adds the `smart-modal-bottom` class to it.
   */
  mode?: 'default' | 'bottom';
  /** Classes added to the modal (`<SmartModal className>`). */
  cssClass?: string[];
  /**
   * `false` keeps the modal open on a click on its backdrop and on Escape;
   * its close button and `dismiss()` still close it. Defaults to `true`.
   */
  backdropDismiss?: boolean;
}

export interface IModal {
  dismiss: (data?: any) => void;
  onDidDismiss(): Promise<{ data: any }>;
}

export interface IModalRequest extends IModalServiceOptions {
  id: number;
  dismiss: (data?: any) => void;
}

/**
 * Opens a component in a modal dialog. The component receives `props` and can
 * close the dialog, with a result, through `useModalService().dismiss(data)`
 * or the `dismiss` prop it is given. The modals stack: the last one opened is
 * on top, and `dismiss()` closes it.
 */
export class ModalService {
  readonly modals = new SmartStore<IModalRequest[]>([]);

  private nextId = 1;
  private listening = false;

  /**
   * Stops Escape before the modal's own document listener (added after this
   * one) while the top modal has `backdropDismiss: false`. Elements inside the
   * modal still receive the key.
   */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' && event.key !== 'Esc') return;

    const modals = this.modals.get();

    if (modals[modals.length - 1]?.backdropDismiss === false) {
      event.stopImmediatePropagation();
    }
  };

  async show(options: IModalServiceOptions): Promise<IModal> {
    const id = this.nextId++;
    let resolveDismiss!: (result: { data: any }) => void;
    const dismissed = new Promise<{ data: any }>((resolve) => {
      resolveDismiss = resolve;
    });

    const dismiss = (data: any = null) => {
      if (!this.modals.get().some((m) => m.id === id)) return;

      this.modals.update((modals) => modals.filter((m) => m.id !== id));
      this.listenToEscape();
      resolveDismiss({ data });
    };

    this.modals.update((modals) => [...modals, { ...options, id, dismiss }]);
    this.listenToEscape();

    return { dismiss, onDidDismiss: () => dismissed };
  }

  /** Closes the modal opened last. */
  async dismiss<T>(data: T | null = null): Promise<void> {
    const modals = this.modals.get();

    modals[modals.length - 1]?.dismiss(data);
  }

  /** Listens to Escape on the document while a modal is open. */
  private listenToEscape(): void {
    if (typeof document === 'undefined') return;

    const open = this.modals.get().length > 0;

    if (open && !this.listening) {
      document.addEventListener('keydown', this.onKeydown);
    } else if (!open && this.listening) {
      document.removeEventListener('keydown', this.onKeydown);
    }

    this.listening = open;
  }
}
