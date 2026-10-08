import type { ComponentType } from 'react';

import { SmartStore } from '../../store';

export interface IModalServiceOptions {
  component: ComponentType<any>;
  props?: Record<string, unknown>;
  mode?: 'default' | 'bottom';
  cssClass?: string[];
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
 * or the `dismiss` prop it is given.
 */
export class ModalService {
  readonly modals = new SmartStore<IModalRequest[]>([]);

  private nextId = 1;

  async show(options: IModalServiceOptions): Promise<IModal> {
    const id = this.nextId++;
    let resolveDismiss!: (result: { data: any }) => void;
    const dismissed = new Promise<{ data: any }>((resolve) => {
      resolveDismiss = resolve;
    });

    const dismiss = (data: any = null) => {
      if (!this.modals.get().some((m) => m.id === id)) return;

      this.modals.update((modals) => modals.filter((m) => m.id !== id));
      resolveDismiss({ data });
    };

    this.modals.update((modals) => [...modals, { ...options, id, dismiss }]);

    return { dismiss, onDidDismiss: () => dismissed };
  }

  /** Closes the modal opened last. */
  async dismiss<T>(data: T | null = null): Promise<void> {
    const modals = this.modals.get();

    modals[modals.length - 1]?.dismiss(data);
  }
}
