import { ISearchbarOptions } from '../../models';

export interface SmartSearchbarProps {
  options?: ISearchbarOptions;
  className?: string;
  /**
   * Whether the search field is shown (the Angular `show` model). Leave it
   * `undefined` for an uncontrolled searchbar that starts from `defaultShow`.
   */
  show?: boolean;
  /** Initial `show` of an uncontrolled searchbar (default `true`). */
  defaultShow?: boolean;
  /** The `showChange` half of the Angular `[(show)]` binding. */
  onShowChange?: (show: boolean) => void;
  /**
   * The search text (the Angular `text` model), updated once the typing
   * settles for `options.debounceTime` ms (1000 by default). Leave it
   * `undefined` for an uncontrolled searchbar that starts from `defaultText`.
   */
  text?: string;
  /** Initial text of an uncontrolled searchbar. */
  defaultText?: string;
  /** The `textChange` half of the Angular `[(text)]` binding. */
  onTextChange?: (text: string) => void;
}
