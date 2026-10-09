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

import { DrawerStandardComponent } from './standard/standard.component';
import { IDrawerOptions } from '../../models';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletContent } from '../base/outlet-content';

@Component({
  selector: 'smart-drawer',
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
      <smart-drawer-standard
        [(open)]="open"
        [title]="title()"
        [options]="options()"
        [class]="cssClass()"
        (closed)="closed.emit()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </smart-drawer-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DrawerStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
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

  private readonly outlet = viewChild(NgComponentOutlet);

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      open: this.open,
      closed: this.closed,
    });
  }
}
