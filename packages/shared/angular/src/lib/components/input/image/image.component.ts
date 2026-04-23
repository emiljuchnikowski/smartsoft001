import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';

import { ModelLabelPipe } from '../../../pipes';
import { ButtonComponent } from '../../button';
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
        <smart-button [options]="addButtonOptions">
          {{ (control.value ? 'change' : 'add') | translate }}
        </smart-button>
        @if (control.value) {
          <smart-button [options]="deleteButtonOptions">
            {{ 'delete' | translate }}
          </smart-button>
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
  imports: [ModelLabelPipe, TranslatePipe, ButtonComponent],
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

  private subscribed = false;

  override ngOnInit() {
    super.ngOnInit();
    this.setupImageSubscription();
  }

  protected override afterSetOptionsHandler(): void {
    super.afterSetOptionsHandler();
    this.setupImageSubscription();
  }

  private setupImageSubscription(): void {
    if (this.subscribed || !this.control) return;

    this.control.valueChanges
      .pipe(debounceTime(1000), this.takeUntilDestroy)
      .subscribe(() => this.initImage());

    this.initImage();
    this.subscribed = true;
  }

  private initImage(): void {
    this.imageUrl = this.control.value
      ? this.fileService.getUrl(this.control.value.id)
      : null;
    this.cd.detectChanges();
  }
}
