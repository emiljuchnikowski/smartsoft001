export interface SmartImportProps {
  /** The file types the picker offers (`application/json` by default). */
  accept?: string;
  /** Extra CSS classes applied to the `<span>` around the button. */
  className?: string;
  /** Called with the picked file. */
  onSet?: (file: File) => void;
}
