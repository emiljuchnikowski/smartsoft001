import { IActionPanelOptions } from '../../models';

/** Passed to `onActionClick` when a button action is clicked. */
export interface IActionPanelActionClick {
  actionId: string;
}

export interface SmartActionPanelProps {
  options?: IActionPanelOptions;
  className?: string;
  /** Called when an action without `href` is clicked. */
  onActionClick?: (event: IActionPanelActionClick) => void;
}
