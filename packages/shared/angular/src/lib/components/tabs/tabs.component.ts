import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { ITabChange } from './base/base.component';
import { TabsStandardComponent } from './standard';
import { ITabsOptions } from '../../models';
import { TABS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-tabs',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-tabs-standard
        [options]="options()"
        [class]="cssClass()"
        [(selectedId)]="selectedId"
        (tabChange)="tabChange.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [TabsStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  private injectedComponent = inject(TABS_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ITabsOptions>();
  selectedId = model<string | null>(null);
  cssClass = input<string>('', { alias: 'class' });

  tabChange = output<ITabChange>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      options: this.options(),
      selectedId: this.selectedId(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      tabChange: this.tabChange,
      selectedId: this.selectedId,
    });
  }
}
