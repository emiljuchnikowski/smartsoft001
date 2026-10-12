import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ModalBaseComponent } from '../base';

/**
 * Minimal positioning of the `bottom-sheet` variant on the native dialog:
 * docked to the bottom of the viewport, full width (centred under a max width
 * from `sm`, with rounded top corners), at most 85% of the viewport high with
 * its own scroll. The other variants keep the browser's dialog layout.
 */
const BOTTOM_SHEET_CLASSES = [
  'smart:fixed',
  'smart:inset-x-0',
  'smart:top-auto',
  'smart:bottom-0',
  'smart:z-[80]',
  'smart:m-0',
  'smart:w-full',
  'smart:max-w-none',
  'smart:max-h-[85dvh]',
  'smart:overflow-y-auto',
  'smart:sm:mx-auto',
  'smart:sm:max-w-2xl',
  'smart:sm:rounded-t-xl',
].join(' ');

@Component({
  selector: 'smart-modal-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalStandardComponent extends ModalBaseComponent {
  protected readonly dialogClasses = computed(() =>
    [
      this.options()?.variant === 'bottom-sheet' ? BOTTOM_SHEET_CLASSES : '',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
