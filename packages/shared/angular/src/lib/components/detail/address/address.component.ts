import { Component, computed, Signal } from '@angular/core';

import { IAddress } from '@smartsoft001/domain-core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-address',
  template: `
    @let address = thisAddress();
    @if (address) {
      <p>
        {{ address?.street }}
        {{
          address?.flatNumber
            ? address?.buildingNumber + '/' + address?.flatNumber
            : address?.buildingNumber
        }}
        <br />{{ address?.zipCode }} {{ address?.city }}
      </p>
    }
  `,
})
export class DetailAddressComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailBaseComponent<T> {
  thisAddress!: Signal<IAddress>;

  protected override afterSetOptionsHandler() {
    const item = this.options()?.item?.();
    const key = this.options()?.key;
    if (item && key) {
      this.thisAddress = computed<IAddress>(() => {
        return item[key] ?? null;
      });
    }
  }
}
