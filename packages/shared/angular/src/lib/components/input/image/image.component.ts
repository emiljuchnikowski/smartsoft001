import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';

import { ModelLabelPipe } from '../../../pipes';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-image',
  template: `
    @if (control) {
      <label [class]="labelClasses()">
        {{
          control?.parent?.value
            | smartModelLabel
              : internalOptions.fieldKey
              : internalOptions?.model?.constructor
        }}
        @if (required) {
          <span class="smart:text-red-500 smart:ml-0.5">*</span>
        }
      </label>
      <div [class]="groupClasses()">
        <button
          type="button"
          (click)="addButtonOptions.click()"
          class="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white hover:smart:bg-indigo-500"
        >
          {{ (control.value ? 'change' : 'add') | translate }}
        </button>
        @if (control.value) {
          <button
            type="button"
            (click)="deleteButtonOptions.click()"
            class="smart:rounded-md smart:bg-red-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white hover:smart:bg-red-500"
          >
            {{ 'delete' | translate }}
          </button>
        }
        @if (loading()) {
          <div
            class="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 dark:smart:bg-gray-700"
          >
            <div
              class="smart:h-full smart:bg-indigo-600"
              [style.width.%]="percent() ?? 0"
            ></div>
          </div>
        }
        @if (imageUrl) {
          <img
            [src]="imageUrl"
            class="smart:max-h-96 smart:max-w-full smart:rounded smart:border smart:border-gray-300 dark:smart:border-gray-600"
          />
        }
        <input type="file" accept=".jpg,.png,.jpeg" [hidden]="true" #inputObj />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImageComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  imageUrl: any;

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'dark:smart:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-2',
      'smart:flex-wrap',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  override ngOnInit() {
    super.ngOnInit();

    this.control.valueChanges
      .pipe(debounceTime(1000), this.takeUntilDestroy)
      .subscribe(() => this.initImage());

    this.initImage();
  }

  private initImage(): void {
    this.imageUrl = this.control.value
      ? this.fileService.getUrl(this.control.value.id)
      : null;
    this.cd.detectChanges();
  }
}
