import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { CommandPaletteBaseComponent } from '../base';

/**
 * Barebones native-HTML command palette: a `<dialog>` with a search input and a
 * `listbox` of the filtered commands. Escape anywhere in the document closes
 * an open palette (the listener is inherited by the preset).
 */
@Component({
  selector: 'smart-command-palette-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class CommandPaletteStandardComponent extends CommandPaletteBaseComponent {
  onQueryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }

  /** Closes the palette when it is open; does nothing otherwise. */
  onEscape(): void {
    if (this.open()) this.close();
  }
}
