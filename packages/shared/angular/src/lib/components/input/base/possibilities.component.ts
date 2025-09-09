import {
  Directive,
  inject,
  signal,
  Signal,
  Type,
  WritableSignal,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';

import { InputBaseComponent } from './base.component';
import { MODEL_POSSIBILITIES_PROVIDER } from '../../../providers';

@Directive()
export abstract class InputPossibilitiesBaseComponent<
  T,
> extends InputBaseComponent<T> {
  private modelPossibilitiesProvider = inject(MODEL_POSSIBILITIES_PROVIDER);

  protected override afterSetOptionsHandler() {
    const refreshPossibilities = () => {
      if (this.getPossibilitiesFromProvider()) {
        this.possibilities = this.getPossibilitiesFromProvider();
      }
    };

    refreshPossibilities();

    this.internalOptions.control.parent?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        refreshPossibilities();
        this.cd.detectChanges();
      });
  }

  protected getPossibilitiesFromProvider(): WritableSignal<
    { id: any; text: string; checked: boolean }[] | null
  > {
    if (!this.modelPossibilitiesProvider) return signal(null);

    return this.modelPossibilitiesProvider.get({
      type: this.internalOptions?.model?.constructor as Type<any>,
      key: this.internalOptions.fieldKey,
      instance: this.internalOptions.control.parent?.value,
    });
  }
}
