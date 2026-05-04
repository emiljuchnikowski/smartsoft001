import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ISelectMenuItem } from '../../../models';
import { SelectMenuBaseComponent } from '../base';

@Component({
  selector: 'smart-select-menu-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SelectMenuStandardComponent extends SelectMenuBaseComponent {
  protected isSelected(item: ISelectMenuItem): boolean {
    const current = this.value();
    if (current === null || current === undefined) return false;
    return String(current) === String(item.value);
  }

  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const raw = target.value;
    const items = this.options()?.items ?? [];
    const match = items.find((i) => String(i.value) === raw);
    this.select(match ? match.value : raw);
  }
}
