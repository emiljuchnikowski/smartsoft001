import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';

import { ModelLabelPipe } from '../../../../pipes';
import { ButtonComponent } from '../../../button';
import { InputFileBaseComponent } from '../../base/file.component';

@Component({
  selector: 'smart-input-logo-preset',
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
        @if (imageUrl) {
          <img [src]="imageUrl" alt="" [class]="avatarClasses()" />
        } @else {
          <span [class]="placeholderClasses()">
            <svg
              class="smart:size-full smart:text-gray-400 smart:dark:text-gray-500"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="0.62854"
                y="0.359985"
                width="15"
                height="15"
                rx="7.5"
                fill="currentColor"
                class="smart:fill-white smart:dark:fill-gray-800"
              />
              <path
                d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                fill="currentColor"
              />
              <path
                d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                fill="currentColor"
              />
            </svg>
          </span>
        }
        <div class="smart:flex smart:flex-col smart:gap-y-2">
          <div
            class="smart:flex smart:items-center smart:gap-x-2 smart:flex-wrap"
          >
            <smart-button [options]="addButtonOptions">
              {{ (control.value ? 'change' : 'add') | translate }}
            </smart-button>
            @if (control.value) {
              <smart-button [options]="deleteButtonOptions">
                {{ 'delete' | translate }}
              </smart-button>
            }
          </div>
          @if (loading()) {
            <div
              class="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700"
            >
              <div
                class="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500"
                [style.width.%]="percent() ?? 0"
              ></div>
            </div>
          }
        </div>
        <input type="file" accept=".jpg,.png,.jpeg" [hidden]="true" #inputObj />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ButtonComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLogoPresetComponent<T>
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
      'smart:dark:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:items-center',
      'smart:gap-x-3',
      'smart:flex-wrap',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  // Avatar-style circular thumbnail (FRA-266: presentation like the avatar component).
  avatarClasses = computed(() =>
    [
      'smart:inline-block',
      'smart:object-cover',
      'smart:size-20',
      'smart:rounded-full',
      'smart:ring-2',
      'smart:ring-white',
      'smart:dark:ring-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
    ].join(' '),
  );

  placeholderClasses = computed(() =>
    [
      'smart:inline-block',
      'smart:overflow-hidden',
      'smart:size-20',
      'smart:rounded-full',
      'smart:bg-gray-100',
      'smart:dark:bg-gray-700',
    ].join(' '),
  );

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
