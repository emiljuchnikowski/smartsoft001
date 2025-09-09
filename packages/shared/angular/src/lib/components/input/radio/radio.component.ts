import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../pipes';
import { InputPossibilitiesBaseComponent } from '../base/possibilities.component';

@Component({
  selector: 'smart-input-radio',
  templateUrl: './radio.component.html',
  imports: [ModelLabelPipe, AsyncPipe, ReactiveFormsModule, TranslatePipe],
  styleUrls: ['./radio.component.scss'],
})
export class InputRadioComponent<T> extends InputPossibilitiesBaseComponent<T> {
  protected override afterSetOptionsHandler(): void {
    if (this.internalOptions && !this.possibilities()) {
      let options = getModelFieldOptions(
        this.internalOptions.model,
        this.internalOptions.fieldKey,
      );

      if (!options && (this.internalOptions.model as any)[0])
        options = getModelFieldOptions(
          (this.internalOptions.model as any)[0],
          this.internalOptions.fieldKey,
        );

      const possibilities = options.possibilities;
      if (!possibilities || _.isArray(possibilities)) return possibilities;

      this.possibilities.set(
        Object.keys(possibilities).map((key) => ({
          id: possibilities[key],
          text: key,
          checked: false,
        })),
      );
    }
  }
}
