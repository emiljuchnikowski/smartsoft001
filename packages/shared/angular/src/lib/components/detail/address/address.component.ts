import { Component, computed, Signal } from '@angular/core';

import { IAddress } from "@smartsoft001/domain-core";

import { DetailBaseComponent } from "../base/base.component";

@Component({
  selector: 'smart-detail-address',
  template: `
    @let address = thisAddress();
    @if (address) {
      <p>
        {{ address?.street }}
        {{ address?.flatNumber ? address?.buildingNumber + "/" + address?.flatNumber : address?.buildingNumber }}
        <br />{{ address?.zipCode }} {{ address?.city }}
      </p>
    }
  `,
  styleUrls: ['./address.component.scss'],
})
export class DetailAddressComponent<T extends { [key: string]: any }> extends DetailBaseComponent<T> {
  thisAddress!: Signal<IAddress>;

  protected override afterSetOptionsHandler() {
    if (this.options?.item && this.options?.key) {
      this.thisAddress = computed<IAddress>(() => {
        const item = this.options?.item?.();
        return item?.[this.options.key!] ?? null;
      }) 
    }
  }
}
