import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver,
  Input, NgModuleRef,
  OnDestroy, QueryList, TemplateRef, ViewChild, ViewChildren,
} from "@angular/core";
import { Subscription } from "rxjs";

import { IDetailsOptions } from "../../models/interfaces";
import { IEntity } from "@smartsoft001/domain-core";
import { CreateDynamicComponent } from "../base/base.component";
import { DetailsBaseComponent } from "./base/base.component";
import {DynamicContentDirective} from "../../directives/dynamic-content/dynamic-content.directive";
import {DetailsService} from "../../services/details/details.service";

@Component({
  selector: "smart-details",
  template: `
    <smart-details-standard
      *ngIf="options && template === 'default'"
      [options]="options"
    ></smart-details-standard>
    <div #customTpl></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent<T extends IEntity<string>>
  extends CreateDynamicComponent<DetailsBaseComponent<any>>("details")
  implements OnDestroy
{
  private _options: IDetailsOptions<T>;
  private _subscription = new Subscription();

  item: T;

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
  get options(): IDetailsOptions<T> {
    return this._options;
  }

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  contentTpl: TemplateRef<any>;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
      cd: ChangeDetectorRef,
      moduleRef: NgModuleRef<any>,
      cfr: ComponentFactoryResolver,
      private detailsService: DetailsService
  ) {
    super(cd, moduleRef, cfr);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  refreshProperties(): void {
    this.baseInstance.options = this.options;
  }
}
