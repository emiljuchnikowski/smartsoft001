import { IButtonGroupButton, IButtonGroupOptions } from '../../models';

/** Payload of `onButtonClick` (the Angular `buttonClick` output). */
export interface IButtonGroupButtonClick {
  buttonId: string;
}

export interface SmartButtonGroupProps {
  buttons?: IButtonGroupButton[];
  options?: IButtonGroupOptions;
  /**
   * The id of the selected button (the Angular `selected` model). Controlled
   * when defined; otherwise the group keeps the selection itself.
   */
  selected?: string;
  /** The initial selection when `selected` is not controlled. */
  defaultSelected?: string;
  /** Called with the id of the button the user selected. */
  onSelectedChange?: (selected: string) => void;
  className?: string;
  /** The Angular `buttonClick` output: a button was clicked. */
  onButtonClick?: (event: IButtonGroupButtonClick) => void;
}
