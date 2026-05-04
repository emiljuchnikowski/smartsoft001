import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { TextareaBaseComponent } from '../base';

@Component({
  selector: 'smart-textarea-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TextareaStandardComponent extends TextareaBaseComponent {
  protected onInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this.value.set(next);
  }

  protected onActionClick(actionId: string): void {
    if (this.disabled()) return;
    this.actionClick.emit({ actionId, value: this.value() });
  }
}
