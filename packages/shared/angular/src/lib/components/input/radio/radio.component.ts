import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  Inject,
  Optional,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import * as _ from 'lodash';

import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../pipes';
import {
  IModelPossibilitiesProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '../../../providers';
import { InputPossibilitiesBaseComponent } from '../base/possibilities.component';

@Component({
  selector: 'smart-input-radio',
  templateUrl: './radio.component.html',
  imports: [ModelLabelPipe, AsyncPipe, ReactiveFormsModule, TranslatePipe],
  styleUrls: ['./radio.component.scss'],
})
export class InputRadioComponent<T> extends InputPossibilitiesBaseComponent<T> {
  constructor(
    cd: ChangeDetectorRef,
    @Optional()
    @Inject(MODEL_POSSIBILITIES_PROVIDER)
    modelPossibilitiesProvider: IModelPossibilitiesProvider,
  ) {
    super(cd, modelPossibilitiesProvider);
  }

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

      this.possibilities = computed(() => {
        const possibilities = options.possibilities;
        if (!possibilities || _.isArray(possibilities)) return possibilities;

        return Object.keys(possibilities).map((key) => ({
          id: possibilities[key],
          text: key,
        }));
      });
    }
  }
}
