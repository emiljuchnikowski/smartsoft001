import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { DropdownStandardComponent } from './standard/standard.component';
import { IDropdownItem, IDropdownOptions } from '../../models';
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletContent } from '../base/outlet-content';

@Component({
  selector: 'smart-dropdown',
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="
          componentType();
          inputs: componentInputs();
          content: projectedContent()
        "
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
        <ng-container [ngTemplateOutlet]="content" />
      </smart-dropdown-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DropdownStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
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

  private readonly outlet = viewChild(NgComponentOutlet);

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      selectedItem: this.selectedItem,
      open: this.open,
    });
  }
}
