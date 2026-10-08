import { ICommand, ICommandPaletteOptions } from '../../models';

/** Passed to `onRunCommand` when a command is chosen. */
export interface ICommandPaletteRunCommand {
  commandId: string;
}

export interface SmartCommandPaletteProps {
  commands?: ICommand[];
  /**
   * Whether the palette is open. Controlled when set; leave it `undefined` to
   * let the palette keep its own state, starting from `defaultOpen`.
   */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * The search text. Controlled when set; leave it `undefined` to let the
   * palette keep its own state, starting from `defaultQuery`.
   */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  options?: ICommandPaletteOptions;
  className?: string;
  /** Called with the id of the clicked command, before the palette closes. */
  onRunCommand?: (event: ICommandPaletteRunCommand) => void;
}
