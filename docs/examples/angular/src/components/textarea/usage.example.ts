// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ITextareaActionClick,
  ITextareaOptions,
  TextareaComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-textarea-usage-example',
  imports: [TextareaComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaUsageExampleComponent {
  readonly options: ITextareaOptions = {
    label: 'Add your comment',
    name: 'comment',
    rows: 4,
    maxLength: 500,
    required: true,
    actions: [{ id: 'post', label: 'Post', variant: 'primary' }],
  };

  readonly comment = signal('');
  readonly lastSubmitted = signal<string | null>(null);

  onActionClick({ value }: ITextareaActionClick): void {
    this.lastSubmitted.set(value);
  }
}
// #endregion
