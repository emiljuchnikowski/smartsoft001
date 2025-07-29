import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver,
  Input, NgModuleRef,
  OnDestroy, QueryList, TemplateRef, ViewChild, ViewChildren,
} from "@angular/core";
import { Subscription } from "rxjs";

import { IEntity } from "@smartsoft001/domain-core";

import { IDetailsOptions } from '../../models';
import { CreateDynamicComponent } from '../base';
import { DetailsBaseComponent } from "./base/base.component";
import {DynamicContentDirective} from '../../directives';
import {DetailsService} from '../../services';
import { DetailsStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-details',
  template: `
    @if (options && template === 'default') {
      <smart-details-standard
        [options]="options"
      ></smart-details-standard>
    }
    <div #customTpl></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DetailsStandardComponent
  ]
})
export class DetailsComponent<T extends IEntity<string>>
  extends CreateDynamicComponent<DetailsBaseComponent<any>>("details")
  implements OnDestroy
{
  private _options: IDetailsOptions<T> | null = null;
  private _subscription = new Subscription();

  item: T | null = null;

  @Input() set options(val: IDetailsOptions<T>) {
    this._options = val;

    this._subscription.add(
      this._options.item$.subscribe((item) => {
        this.detailsService.setRoot(item);
        this.item = item;
      })
    );

    this.refreshDynamicInstance();
  }
  get options(): IDetailsOptions<T> | null {
    return this._options;
  }

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  override contentTpl: TemplateRef<any> | null = null;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  override dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
      cd: ChangeDetectorRef,
      moduleRef: NgModuleRef<any>,
      cfr: ComponentFactoryResolver,
      private detailsService: DetailsService
  ) {
    super(cd, moduleRef, cfr);
  }

  override ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  override refreshProperties(): void {
    this.baseInstance.options = this.options;
  }
}
