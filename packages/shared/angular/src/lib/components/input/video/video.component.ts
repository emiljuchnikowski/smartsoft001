import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { delay, tap } from 'rxjs/operators';

import { IButtonOptions } from '../../../models';
import { ModelLabelPipe } from '../../../pipes';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-video',
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
        @if (control.value && !play) {
          <button
            type="button"
            (click)="playButtonOptions.click()"
            class="smart:rounded-md smart:bg-gray-200 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-gray-900 hover:smart:bg-gray-300 dark:smart:bg-white/10 dark:smart:text-white"
          >
            {{ 'play' | translate }}
          </button>
        }
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
        @if (url && play) {
          <video class="smart:w-full" controls controlsList="nodownload">
            <source type="video/mp4" [src]="url" />
          </video>
        }
        <input type="file" accept=".mp4" [hidden]="true" #inputObj />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputVideoComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  url!: string | null;
  play!: boolean;
  playButtonOptions: IButtonOptions = {
    click: () => {
      this.play = true;
    },
    loading: this.loading,
  };

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

  protected override afterSetOptionsHandler() {
    this.control.valueChanges
      .pipe(
        tap(() => {
          this.url = null;
          this.play = false;
          this.cd.detectChanges();
        }),
        delay(5000),
        this.takeUntilDestroy,
      )
      .subscribe((value) => {
        if (!value?.id) return;

        this.url = this.fileService.getUrl(value.id);

        this.cd.detectChanges();
      });
  }
}
