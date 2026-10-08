export interface SmartImportProps {
  /** The file types the picker offers (`application/json` by default). */
  accept?: string;
  /** Extra CSS classes applied to the host element around the button. */
  className?: string;
  /** Called with the picked file (the Angular `set` output). */
  onSet?: (file: File) => void;
}
