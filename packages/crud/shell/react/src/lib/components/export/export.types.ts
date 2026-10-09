/** The props of `<SmartCrudExport>`. */
export interface SmartCrudExportProps {
  /**
   * Closes the overlay the component is shown in. `ModalService` passes it
   * to the component it opens; without it the last opened modal is closed.
   */
  dismiss?: (data?: unknown) => void;
}
