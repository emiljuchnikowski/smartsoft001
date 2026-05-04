import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ISidebarNavItem } from '../../../models';
import { SidebarNavigationBaseComponent } from '../base';

@Component({
  selector: 'smart-sidebar-navigation-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SidebarNavigationStandardComponent extends SidebarNavigationBaseComponent {
  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }

  protected onToggle(item: ISidebarNavItem): void {
    this.toggleExpanded(item);
  }

  protected expanded(item: ISidebarNavItem): boolean {
    return this.isExpanded(item);
  }

  protected get groups() {
    return this.resolvedGroups();
  }
}
