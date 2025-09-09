import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '.dynamic-content',
})
export class DynamicContentDirective {
  public container = inject(ViewContainerRef);
}
