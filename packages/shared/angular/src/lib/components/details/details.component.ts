import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnDestroy,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { DynamicContentDirective } from '../../directives';
import { IDetailsOptions } from '../../models';
import { DetailsService } from '../../services';
import { CreateDynamicComponent } from '../base';
import { DetailsBaseComponent } from './base/base.component';
import { DetailsStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-details',
  template: `
    @if (options() && template() === 'default') {
      <smart-details-standard [options]="options()"></smart-details-standard>
    }
    <div #customTpl></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailsStandardComponent],
})
export class DetailsComponent<T extends IEntity<string>>
  extends CreateDynamicComponent<DetailsBaseComponent<any>>('details')
  implements OnDestroy
{
  item: T | null = null;

  options = input<IDetailsOptions<T> | undefined>(undefined);

  override contentTpl = viewChild<TemplateRef<any>>('contentTpl');

  override dynamicContents = viewChildren<DynamicContentDirective>(
    DynamicContentDirective,
  );

  constructor(private detailsService: DetailsService) {
    super();

    effect(() => {
      const options = this.options();
      const item = options?.item();
      if (item) {
        this.detailsService.setRoot(item);
        this.item = item;
      }

      this.refreshDynamicInstance();
    });
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
  }
}
