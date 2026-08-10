import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { DetailAddressComponent } from '../address.component';

@Component({
  selector: 'smart-detail-address-preset',
  template: `
    @let address = thisAddress();
    @if (address) {
      <div data-role="address" [class]="containerClasses()">
        <svg
          data-role="icon"
          class="smart:mt-0.5 smart:size-4 smart:shrink-0 smart:text-gray-400 smart:dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        <p [class]="textClasses()">
          {{ address?.street }}
          {{
            address?.flatNumber
              ? address?.buildingNumber + '/' + address?.flatNumber
              : address?.buildingNumber
          }}
          <br />{{ address?.zipCode }} {{ address?.city }}
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DetailAddressPresetComponent<
  T extends { [key: string]: any } | undefined,
> extends DetailAddressComponent<T> {
  containerClasses = computed(() => {
    const classes = ['smart:flex', 'smart:items-start', 'smart:gap-x-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  textClasses = computed(() =>
    ['smart:text-sm', 'smart:text-gray-900', 'smart:dark:text-gray-100'].join(
      ' ',
    ),
  );
}
