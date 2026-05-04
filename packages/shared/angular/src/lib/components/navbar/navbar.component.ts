import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { INavbarItemClick } from './base/base.component';
import { NavbarStandardComponent } from './standard';
import { INavbarOptions } from '../../models';
import { NAVBAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-navbar',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-navbar-standard
        [options]="options()"
        [class]="cssClass()"
        [(mobileMenuOpen)]="mobileMenuOpen"
        (itemClick)="itemClick.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NavbarStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private injectedComponent = inject(NAVBAR_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<INavbarOptions>();
  cssClass = input<string>('', { alias: 'class' });
  mobileMenuOpen = model<boolean>(false);

  itemClick = output<INavbarItemClick>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
    mobileMenuOpen: this.mobileMenuOpen(),
  }));
}
