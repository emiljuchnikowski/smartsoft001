import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';

import { SearchbarStandardComponent } from './standard';
import { ISearchbarOptions } from '../../models';
import { SEARCHBAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-searchbar',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-searchbar-standard
        [(show)]="show"
        [(text)]="text"
        [options]="options()"
        [class]="cssClass()"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [SearchbarStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchbarComponent {
  private injectedComponent = inject(SEARCHBAR_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  options = input<ISearchbarOptions>();
  show = model<boolean>(true);
  text = model.required<string>();
  cssClass = input<string>('', { alias: 'class' });

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    options: this.options(),
    show: this.show(),
    text: this.text(),
    cssClass: this.cssClass(),
  }));
}
