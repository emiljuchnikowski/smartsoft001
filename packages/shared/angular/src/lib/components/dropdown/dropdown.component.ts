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

import { DropdownStandardComponent } from './standard/standard.component';
import { IDropdownItem, IDropdownOptions } from '../../models';
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-dropdown',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-dropdown-standard
        [items]="items()"
        [triggerLabel]="triggerLabel()"
        [(open)]="open"
        [options]="options()"
        [class]="cssClass()"
        (selectedItem)="selectedItem.emit($event)"
      >
        <ng-content />
      </smart-dropdown-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DropdownStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  private injectedComponent = inject(DROPDOWN_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  items = input<IDropdownItem[]>([]);
  triggerLabel = input<string>();
  open = model<boolean>(false);
  options = input<IDropdownOptions>();
  cssClass = input<string>('', { alias: 'class' });

  selectedItem = output<{ itemId: string }>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    items: this.items(),
    triggerLabel: this.triggerLabel(),
    open: this.open(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
