import { ITextareaOptions } from '../../models';

/** Payload of the `actionClick` output (declared by the Angular base). */
export interface ITextareaActionClick {
  actionId: string;
  value: string;
}

export interface SmartTextareaProps {
  /**
   * The text (the Angular `value` model). Leave it `undefined` for an
   * uncontrolled textarea that starts from `defaultValue`.
   */
  value?: string;
  /** Initial text of an uncontrolled textarea. */
  defaultValue?: string;
  /** The `valueChange` half of the Angular `[(value)]` binding. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options?: ITextareaOptions;
  className?: string;
  /** The Angular `actionClick` output. */
  onActionClick?: (event: ITextareaActionClick) => void;
}
