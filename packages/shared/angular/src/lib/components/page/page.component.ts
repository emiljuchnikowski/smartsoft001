import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';

import { CreateDynamicComponent } from '../base';
import { PageBaseComponent } from './base/base.component';
import { DynamicContentDirective } from '../../directives';
import { IPageOptions } from '../../models';
import { PageStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-page',
  template: `
    @if (template() === 'default') {
      <smart-page-standard [options]="options()">
        <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </smart-page-standard>
    }
    <ng-template #contentTpl>
      <ng-content></ng-content>
    </ng-template>
    <div class="dynamic-content"></div>
  `,
  imports: [PageStandardComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent
  extends CreateDynamicComponent<PageBaseComponent>('page')
  implements OnInit
{
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  options = input.required<IPageOptions>();

  override contentTpl = viewChild<TemplateRef<any>>('contentTpl');
  override dynamicContents = viewChildren(DynamicContentDirective);

  constructor() {
    super();

    effect(() => {
      this.options(); // Track changes only
      this.refreshDynamicInstance();
    });
  }

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
  }
}
