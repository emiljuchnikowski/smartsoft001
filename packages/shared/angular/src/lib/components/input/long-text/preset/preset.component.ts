import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

/**
 * Preline "preset" variation of the long-text input field.
 *
 * Unlike the default {@link InputLongTextComponent} (which renders a
 * `ngx-editor` rich-text editor), this preset renders a Preline-styled
 * `<textarea>` (FRA-267) so the free-tier stays on HTML-template OSS markup.
 * The Preline semantic tokens are translated to `smart:`-prefixed vanilla
 * Tailwind palette classes with explicit `dark:` variants.
 */
@Component({
  selector: 'smart-input-long-text-preset',
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
      <textarea
        rows="3"
        [formControl]="formControl"
        [class]="textareaClasses()"
        [placeholder]="placeholder"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
      ></textarea>
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLongTextPresetComponent<T>
  extends InputBaseComponent<T>
  implements OnInit
{
  private translateService = inject(TranslateService);

  placeholder = '';

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:mb-3',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  textareaClasses = computed(() => {
    const classes = [
      'smart:py-2',
      'smart:px-3',
      'smart:sm:py-3',
      'smart:sm:px-4',
      'smart:block',
      'smart:w-full',
      'smart:rounded-lg',
      'smart:border',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:sm:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      'smart:focus:border-blue-700',
      'smart:dark:focus:border-blue-600',
      'smart:focus:ring-blue-700',
      'smart:dark:focus:ring-blue-600',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
      'smart:[&::-webkit-scrollbar]:w-2',
      'smart:[&::-webkit-scrollbar-thumb]:rounded-none',
      'smart:[&::-webkit-scrollbar-track]:bg-gray-100',
      'smart:dark:[&::-webkit-scrollbar-track]:bg-gray-800',
      'smart:[&::-webkit-scrollbar-thumb]:bg-gray-300',
      'smart:dark:[&::-webkit-scrollbar-thumb]:bg-gray-600',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  ngOnInit(): void {
    this.placeholder = this.translateService.instant('writeHere') + '...';
  }
}
