import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IEntity } from "@smartsoft001/domain-core";

import { DetailBaseComponent } from "../base/base.component";
import { IDetailsOptions } from '../../../models';
import { DETAILS_COMPONENT_TOKEN } from "../../../shared.inectors";

@Component({
  selector: 'smart-detail-object',
  template: `
    <br />
    @let childOptions = childOptions$ | async;
    @if (childOptions) {
      <ng-template [ngComponentOutlet]="detailsComponent"
                   [ndcDynamicInputs]="{ options: childOptions }"
      ></ng-template>
    }
  `,
  styleUrls: ['./object.component.scss'],
  imports: [
    NgComponentOutlet,
    DynamicIoDirective,
    AsyncPipe
  ]
})
export class DetailObjectComponent<
  T,
  TChild extends IEntity<string>
> extends DetailBaseComponent<T> {
  childOptions$!: Observable<IDetailsOptions<TChild> | null>;

  constructor(
    cd: ChangeDetectorRef,
    @Inject(DETAILS_COMPONENT_TOKEN) public detailsComponent: any
  ) {
    super(cd);
  }

  protected override afterSetOptionsHandler() {
    super.afterSetOptionsHandler();
    if (this.options?.item$) {
      this.childOptions$ = this.options.item$.pipe(
        map((item) => {
          if (!item) return null;

          return {
            type: item[this.options.key].constructor as any,
            item$: of(item[this.options.key] as TChild),
          } as IDetailsOptions<TChild>;
        })
      );
    }
  }
}
