/**
 * The preset modals that are open, in the order they opened. Every open preset
 * listens to Escape on the whole document, so with modals stacked (a modal
 * opened from a modal) only the one on top may close on it.
 */
const openLayers: object[] = [];

/** Puts `layer` on top of the open modals. */
export function openEscapeLayer(layer: object): void {
  closeEscapeLayer(layer);
  openLayers.push(layer);
}

/** Takes `layer` off the open modals, wherever it is. */
export function closeEscapeLayer(layer: object): void {
  const index = openLayers.indexOf(layer);

  if (index !== -1) openLayers.splice(index, 1);
}

/** Whether `layer` is the open modal on top, the one Escape closes. */
export function isTopEscapeLayer(layer: object): boolean {
  return openLayers[openLayers.length - 1] === layer;
}
