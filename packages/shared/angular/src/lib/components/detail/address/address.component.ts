import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AsyncPipe } from '@angular/common';
import { map } from "rxjs/operators";

import { IAddress } from "@smartsoft001/domain-core";

import { DetailBaseComponent } from "../base/base.component";

@Component({
  selector: 'smart-detail-address',
  template: `
    @let address = address$ | async;
    @if (address) {
      <p>
        {{ address?.street }}
        {{ address?.flatNumber ? address?.buildingNumber + "/" + address?.flatNumber : address?.buildingNumber }}
        <br />{{ address?.zipCode }} {{ address?.city }}
      </p>
    }
  `,
  styleUrls: ['./address.component.scss'],
  imports: [
    AsyncPipe
  ]
})
export class DetailAddressComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {
  address$!: Observable<IAddress>;

  protected override afterSetOptionsHandler() {
    if (this.options?.item$ && this.options?.key) {
      this.address$ = this.options.item$.pipe(
        map((item) => (this.options && item ? item[this.options.key] : null))
      );
    }
  }
}
