export interface SmartExportProps {
  /** The data to export; the button is disabled while it is empty. */
  value?: any;
  /** Name for the exported file, passed to `handler` as its second argument. */
  fileName?: string;
  /**
   * Called with `value` and `fileName` on click. Serialise and download the
   * data here. The `fileName` argument is optional, so `(value) => void`
   * handlers keep working.
   */
  handler: (value: any, fileName?: string) => void;
  /** Extra CSS classes applied to the button and to the host element around it. */
  className?: string;
}
