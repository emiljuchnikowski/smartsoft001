import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { ButtonComponent } from '../../../button';
import { InputFileBaseComponent } from '../../base/file.component';

@Component({
  selector: 'smart-input-pdf-preset',
  template: `
    @if (control) {
      <label [class]="labelClasses()" data-role="label">
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
        <!-- Preline-style drop zone (Angular-driven, no Dropzone/Preline JS) -->
        <div
          [class]="dropZoneClasses()"
          role="button"
          tabindex="0"
          [attr.aria-disabled]="loading() ? true : null"
          (click)="triggerUpload()"
          (keydown.enter)="triggerUpload()"
          (keydown.space)="triggerUpload(); $event.preventDefault()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="smart:text-center">
            <span
              class="smart:inline-flex smart:justify-center smart:items-center smart:size-12 smart:text-gray-500 smart:dark:text-gray-400"
            >
              <svg
                class="smart:shrink-0 smart:size-8"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M9 15v-2h1a1 1 0 0 1 0 2Z" />
              </svg>
            </span>

            <div
              class="smart:mt-2 smart:flex smart:flex-wrap smart:justify-center smart:text-sm/6 smart:text-gray-500 smart:dark:text-gray-400"
            >
              <span
                class="smart:pe-1 smart:font-medium smart:text-gray-900 smart:dark:text-white"
              >
                {{ 'INPUT.dropFileHereOr' | translate }}
              </span>
              <span
                class="smart:font-semibold smart:text-blue-600 smart:dark:text-blue-400 smart:hover:text-blue-700 smart:dark:hover:text-blue-300 smart:underline"
              >
                {{ 'browse' | translate }}
              </span>
            </div>
          </div>
        </div>

        @if (control.value) {
          <div [class]="previewClasses()">
            <span
              class="smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white smart:truncate"
            >
              {{ control.value.fileName }}
            </span>
            <div
              class="smart:flex smart:items-center smart:gap-x-2 smart:flex-wrap"
            >
              <smart-button [options]="showButtonOptions">
                {{ 'show' | translate }}
              </smart-button>
              <smart-button [options]="deleteButtonOptions">
                {{ 'delete' | translate }}
              </smart-button>
            </div>
          </div>
        }

        @if (loading()) {
          <div
            class="smart:flex smart:w-full smart:h-2 smart:bg-gray-100 smart:dark:bg-gray-800 smart:rounded-full smart:overflow-hidden"
          >
            <div
              class="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500 smart:transition-all smart:duration-500"
              [style.width.%]="percent() ?? 0"
            ></div>
          </div>
        }

        <input type="file" accept=".pdf" [hidden]="true" #inputObj />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ButtonComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPdfPresetComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  dragOver = signal(false);

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:flex-col',
      'smart:gap-y-2',
      'smart:w-full',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  dropZoneClasses = computed(() => {
    const classes = [
      'smart:cursor-pointer',
      'smart:p-8',
      'smart:flex',
      'smart:justify-center',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-dashed',
      'smart:rounded-xl',
      'smart:transition-colors',
      'smart:focus:outline-none',
      'smart:focus:ring-2',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
    ];
    if (this.dragOver()) {
      classes.push(
        'smart:border-blue-600',
        'smart:dark:border-blue-500',
        'smart:bg-blue-50',
        'smart:dark:bg-gray-700',
      );
    } else {
      classes.push('smart:border-gray-300', 'smart:dark:border-gray-600');
    }
    return classes.join(' ');
  });

  previewClasses = computed(() =>
    [
      'smart:p-3',
      'smart:flex',
      'smart:justify-between',
      'smart:items-center',
      'smart:gap-x-3',
      'smart:flex-wrap',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-xl',
    ].join(' '),
  );

  protected triggerUpload(): void {
    this.addButtonOptions.click?.();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);

    const input = this.inputElementRef()?.nativeElement as
      | HTMLInputElement
      | undefined;
    const files = event.dataTransfer?.files;
    if (!input || !files || files.length === 0) return;

    // Hand the dropped files to the hidden <input> and reuse the base 'change' wiring.
    input.files = files;
    this.control.markAsDirty();
    this.control.markAsTouched();
    input.dispatchEvent(new Event('change'));
  }
}
