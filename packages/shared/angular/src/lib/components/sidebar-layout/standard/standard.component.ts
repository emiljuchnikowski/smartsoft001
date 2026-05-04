import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { SidebarLayoutBaseComponent } from '../base';

@Component({
  selector: 'smart-sidebar-layout-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SidebarLayoutStandardComponent extends SidebarLayoutBaseComponent {
  isRightSidebar = computed(() => this.options()?.sidebarPosition === 'right');
}
