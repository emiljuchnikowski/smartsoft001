import type { ReactNode } from 'react';

import { IModalAction, IModalOptions } from '../../models';

/** Payload of `onActionClick`. */
export interface IModalActionClick {
  actionId: string;
}

export interface SmartModalProps {
  /**
   * Whether the modal is shown. Leave it `undefined` for an uncontrolled modal
   * that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled modal. */
  defaultOpen?: boolean;
  /** Called when the modal opens or closes. */
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Footer buttons; a click reports `onActionClick` and keeps the modal open. */
  actions?: IModalAction[];
  options?: IModalOptions;
  className?: string;
  onActionClick?: (value: IModalActionClick) => void;
  /** Called after the modal closed itself (dismiss button, backdrop, Escape, native close). */
  onClosed?: () => void;
  /** The modal body. */
  children?: ReactNode;
}
