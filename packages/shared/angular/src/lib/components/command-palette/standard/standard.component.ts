import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { CommandPaletteBaseComponent } from '../base';

@Component({
  selector: 'smart-command-palette-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteStandardComponent extends CommandPaletteBaseComponent {
  onQueryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }
}
