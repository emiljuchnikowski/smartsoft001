import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  IDropdownItem,
  IDropdownOptions,
} from '../../../models';

@Directive()
export abstract class DropdownBaseComponent {
  static smartType: DynamicComponentType = 'dropdown';

  items: InputSignal<IDropdownItem[]> = input<IDropdownItem[]>([]);
  triggerLabel: InputSignal<string | undefined> = input<string>();
  open: ModelSignal<boolean> = model<boolean>(false);
  options: InputSignal<IDropdownOptions | undefined> =
    input<IDropdownOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  selectedItem: OutputEmitterRef<{ itemId: string }> = output<{
    itemId: string;
  }>();

  toggle(): void {
    this.open.set(!this.open());
  }

  close(): void {
    this.open.set(false);
  }

  selectItem(itemId: string): void {
    this.selectedItem.emit({ itemId });
    this.open.set(false);
  }
}
