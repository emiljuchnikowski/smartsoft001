import { ISearchbarOptions } from '../../models';

export interface SmartSearchbarProps {
  options?: ISearchbarOptions;
  className?: string;
  /**
   * Whether the search field is shown. Leave it `undefined` for an uncontrolled
   * searchbar that starts from `defaultShow`.
   */
  show?: boolean;
  /** Initial `show` of an uncontrolled searchbar (default `true`). */
  defaultShow?: boolean;
  /** Called when the search field is shown or hidden. */
  onShowChange?: (show: boolean) => void;
  /**
   * The search text, updated once the typing settles for `options.debounceTime`
   * ms (1000 by default). Leave it `undefined` for an uncontrolled searchbar
   * that starts from `defaultText`.
   */
  text?: string;
  /** Initial text of an uncontrolled searchbar. */
  defaultText?: string;
  /** Called with the search text once the typing settles. */
  onTextChange?: (text: string) => void;
}
