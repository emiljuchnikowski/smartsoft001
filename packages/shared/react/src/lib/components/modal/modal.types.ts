import type { ReactNode } from 'react';

import { IModalAction, IModalOptions } from '../../models';

/** Payload of `onActionClick` (the Angular `IModalActionClick`). */
export interface IModalActionClick {
  actionId: string;
}

export interface SmartModalProps {
  /**
   * Whether the modal is shown (the Angular `open` model). Leave it
   * `undefined` for an uncontrolled modal that starts from `defaultOpen`.
   */
  open?: boolean;
  /** Initial `open` of an uncontrolled modal. */
  defaultOpen?: boolean;
  /** The `openChange` half of the Angular `[(open)]` binding. */
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
