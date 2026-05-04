import { Component, computed, signal, Signal } from '@angular/core';

import { IAddress } from '@smartsoft001/domain-core';

import { DetailBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-detail-address',
  template: `
    @let address = thisAddress();
    @if (address) {
      <p [class]="addressClasses()">
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
  thisAddress: Signal<IAddress | null> = signal(null);

  addressClasses = computed(() => {
    const classes = [
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-gray-100',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

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
