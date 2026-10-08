import { IActionPanelOptions } from '../../models';

/** Emitted when a button action is clicked (the Angular `actionClick` output). */
export interface IActionPanelActionClick {
  actionId: string;
}

export interface SmartActionPanelProps {
  options?: IActionPanelOptions;
  className?: string;
  /** Called when an action without `href` is clicked. */
  onActionClick?: (event: IActionPanelActionClick) => void;
}
