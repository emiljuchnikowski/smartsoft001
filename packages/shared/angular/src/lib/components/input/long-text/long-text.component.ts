import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  Editor,
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Toolbar,
} from 'ngx-editor';

import { ModelLabelPipe } from '../../../pipes';
import { HardwareService } from '../../../services';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-long-text',
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
      @if (editor) {
        <div [class]="editorClasses()" style="min-height: 220px">
          <ngx-editor-menu
            [editor]="editor"
            [toolbar]="toolbar"
          ></ngx-editor-menu>
          <ngx-editor
            [outputFormat]="'html'"
            [editor]="editor"
            [formControl]="formControl"
            [placeholder]="placeholder"
          ></ngx-editor>
        </div>
      }
    }
  `,
  imports: [
    ModelLabelPipe,
    NgxEditorMenuComponent,
    NgxEditorComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLongTextComponent<T>
  extends InputBaseComponent<T>
  implements OnInit, OnDestroy
{
  private translateService = inject(TranslateService);
  hardwareService = inject(HardwareService);

  editor!: Editor;
  toolbar: Toolbar =
    this.hardwareService.isMobile || this.hardwareService.isMobileWeb
      ? [
          ['bold', 'italic'],
          ['text_color', 'background_color'],
          ['align_left', 'align_center', 'align_right', 'align_justify'],
        ]
      : [
          // default value
          ['bold', 'italic'],
          ['underline', 'strike'],
          ['code', 'blockquote'],
          ['ordered_list', 'bullet_list'],
          [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
          ['link', 'image'],
          ['text_color', 'background_color'],
          ['align_left', 'align_center', 'align_right', 'align_justify'],
        ];
  placeholder!: string;

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  editorClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'smart:rounded-md',
      'smart:bg-white',
      'smart:text-gray-900',
      'smart:outline-1',
      '-outline-offset-1',
      'smart:outline-gray-300',
      'smart:dark:bg-white/5',
      'smart:dark:text-white',
      'smart:dark:outline-white/10',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  ngOnInit() {
    this.placeholder = this.translateService.instant('writeHere') + '...';
    this.editor = new Editor({
      history: true,
      inputRules: true,
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.editor.destroy();
  }
}
