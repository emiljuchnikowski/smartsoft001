/**
 * Class recipes for the styled form variation (preset).
 *
 * The preset only restyles the form *shell* — the vertical rhythm of the form
 * and the spacing around each field row. Field internals are rendered by
 * `<smart-input>` (and its own presets), so nothing here touches inputs.
 */

/** Vertical rhythm applied to the form root that wraps every field row. */
export function getFormShellClasses(): string {
  return 'smart:space-y-5';
}

/** Consistent spacing applied to each per-field wrapper. */
export function getFormFieldClasses(): string {
  return 'smart:space-y-1.5';
}
