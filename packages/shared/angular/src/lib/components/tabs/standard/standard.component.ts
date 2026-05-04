import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { TabsBaseComponent } from '../base';

@Component({
  selector: 'smart-tabs-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TabsStandardComponent extends TabsBaseComponent {
  protected onTabClick(tabId: string): void {
    this.selectedId.set(tabId);
    this.tabChange.emit({ tabId });
  }

  protected onSelectChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.onTabClick(next);
  }

  protected isCurrent(itemId: string): boolean {
    return this.selectedId() === itemId;
  }
}
