import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Optional,
  signal,
  Signal,
  Type,
} from '@angular/core';
import {
  IModelPossibilitiesProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '@smartsoft001/angular';
import { debounceTime } from 'rxjs/operators';

import { InputBaseComponent } from './base.component';

@Directive()
export abstract class InputPossibilitiesBaseComponent<
  T,
> extends InputBaseComponent<T> {
  protected constructor(
    cd: ChangeDetectorRef,
    @Optional()
    @Inject(MODEL_POSSIBILITIES_PROVIDER)
    private modelPossibilitiesProvider: IModelPossibilitiesProvider,
  ) {
    super(cd);
  }

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

  protected getPossibilitiesFromProvider(): Signal<
    { id: any; text: string }[] | null
  > {
    if (!this.modelPossibilitiesProvider) return signal(null);

    return this.modelPossibilitiesProvider.get({
      type: this.internalOptions?.model?.constructor as Type<any>,
      key: this.internalOptions.fieldKey,
      instance: this.internalOptions.control.parent?.value,
    });
  }
}
