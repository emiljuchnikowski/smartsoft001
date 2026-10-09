import { ITextareaOptions } from '../../models';

/** Payload of `onActionClick`. */
export interface ITextareaActionClick {
  actionId: string;
  value: string;
}

export interface SmartTextareaProps {
  /**
   * The text. Leave it `undefined` for an uncontrolled textarea that starts
   * from `defaultValue`.
   */
  value?: string;
  /** Initial text of an uncontrolled textarea. */
  defaultValue?: string;
  /** Called with the edited text. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options?: ITextareaOptions;
  className?: string;
  /** An action was clicked; reported with the current text. */
  onActionClick?: (event: ITextareaActionClick) => void;
}
