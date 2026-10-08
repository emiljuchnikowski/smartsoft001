import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { SidebarLayoutStandardComponent } from './standard/standard.component';
import { ISidebarLayoutOptions } from '../../models';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { outletContent } from '../base/outlet-content';

@Component({
  selector: 'smart-sidebar-layout',
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
      <smart-sidebar-layout-standard [options]="options()" [class]="cssClass()">
        <ng-container [ngTemplateOutlet]="content" />
      </smart-sidebar-layout-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    SidebarLayoutStandardComponent,
    NgComponentOutlet,
    NgTemplateOutlet,
  ],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutComponent {
  private injectedComponent = inject(SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ISidebarLayoutOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');

  /** The captured content for an implementation registered through the token. */
  protected readonly projectedContent = outletContent(this.contentTemplate);
}
