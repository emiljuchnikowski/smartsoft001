import { ITabsOptions } from '../../models';

export interface ITabChange {
  tabId: string;
}

export interface SmartTabsProps {
  options?: ITabsOptions;
  /**
   * The id of the selected tab (`null` for none). Leave it `undefined` to let
   * the component keep the selection.
   */
  selectedId?: string | null;
  /** The initial selection of an uncontrolled component. */
  defaultSelectedId?: string | null;
  onSelectedIdChange?: (selectedId: string) => void;
  /** A tab was chosen (button click, preset link click or mobile select). */
  onTabChange?: (event: ITabChange) => void;
  className?: string;
}
