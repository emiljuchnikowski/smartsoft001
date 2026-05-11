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

import { DrawerStandardComponent } from './standard/standard.component';
import { IDrawerOptions } from '../../models';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-drawer',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-drawer-standard
        [(open)]="open"
        [title]="title()"
        [options]="options()"
        [class]="cssClass()"
        (closed)="closed.emit()"
      >
        <ng-content />
      </smart-drawer-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DrawerStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  private injectedComponent = inject(DRAWER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  open = model<boolean>(false);
  title = input<string>();
  options = input<IDrawerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  closed = output<void>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    open: this.open(),
    title: this.title(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
