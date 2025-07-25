import {ChangeDetectorRef, Component, Inject} from "@angular/core";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IEntity } from "@smartsoft001/domain-core";

import { DetailBaseComponent } from "../base/base.component";
import { IDetailsOptions } from "../../../models";
import {DETAILS_COMPONENT_TOKEN} from "../../../shared.inectors";

@Component({
    selector: 'smart-detail-array',
    template: `
        <br />
        @let childOptions = childOptions$ | async;
        @if (childOptions) {
            @for (options of childOptions; track options) {
                <ng-template [ngComponentOutlet]="detailsComponent"
                             [ndcDynamicInputs]="{ options: options }"
                ></ng-template>
            }
        }
    `,
    styleUrls: ['./array.component.scss'],
    imports: [
        AsyncPipe,
        NgComponentOutlet,
        DynamicIoDirective
    ]
})
export class DetailArrayComponent<
    T extends { [key: string]: any },
    TChild extends IEntity<string>
    > extends DetailBaseComponent<T> {
    childOptions$!: Observable<IDetailsOptions<TChild>[]>;

    constructor(cd: ChangeDetectorRef, @Inject(DETAILS_COMPONENT_TOKEN) public detailsComponent: any) {
        super(cd);
    }

    protected override afterSetOptionsHandler() {
        super.afterSetOptionsHandler();

        if (this.options?.item$ && this.options?.key) {
            this.childOptions$ = this.options.item$.pipe(
              map(item => {
                  if (!item || !item[this.options.key]) return [];

                  return item[this.options.key].map((val: any) => {
                      return {
                          type: (val.constructor as any),
                          item$: of(val as TChild)
                      } as IDetailsOptions<TChild>;
                  });
              })
            );
        }
    }
}
