import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { InputFlagComponent, InputOptions } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import { IFieldOptions } from '@smartsoft001/models';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-flag',
  host: { class: 'smart:block smart:w-full' },
  template: `
    @if (inputOptions()) {
      <div class="smart:flex smart:w-full smart:items-center smart:gap-2">
        <smart-input-flag
          class="smart:flex-1"
          [options]="inputOptions()!"
          [fieldOptions]="fieldOptions()"
        ></smart-input-flag>
        @if (value === true || value === false) {
          <button
            type="button"
            (click)="refresh(null)"
            aria-label="clear"
            class="smart:shrink-0 smart:rounded smart:px-2 smart:py-2 smart:text-red-600 smart:hover:bg-red-50"
          >
            ×
          </button>
        }
      </div>
    }
  `,
  imports: [InputFlagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFlagComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements OnInit
{
  readonly inputOptions: WritableSignal<InputOptions<any> | undefined> = signal<
    InputOptions<any> | undefined
  >(undefined);
  readonly fieldOptions: WritableSignal<IFieldOptions | undefined> = signal<
    IFieldOptions | undefined
  >(undefined);

  override ngOnInit(): void {
    super.ngOnInit();

    const control = this.bindValueControl();
    this.inputOptions.set(this.buildInputOptions(control));
  }
}
