import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SectionHeadingStandardComponent } from './standard/standard.component';
import { ISectionHeadingOptions } from '../../models';
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-section-heading',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-section-heading-standard
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SectionHeadingStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  private injectedComponent = inject(SECTION_HEADING_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ISectionHeadingOptions>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
