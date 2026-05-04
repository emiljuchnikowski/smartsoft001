import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { NavbarBaseComponent } from '../base';

@Component({
  selector: 'smart-navbar-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class NavbarStandardComponent extends NavbarBaseComponent {
  protected onItemClick(itemId: string): void {
    this.itemClick.emit({ itemId });
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }
}
