import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  Inject,
  Optional,
  Signal,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonCheckbox,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonListHeader,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { getModelFieldOptions } from '@smartsoft001/models';

import { ModelLabelPipe } from '../../../pipes';
import {
  IModelPossibilitiesProvider,
  MODEL_POSSIBILITIES_PROVIDER,
} from '../../../providers';
import { InputPossibilitiesBaseComponent } from '../base/possibilities.component';

@Component({
  selector: 'smart-input-check',
  templateUrl: './check.component.html',
  imports: [
    IonItemGroup,
    IonListHeader,
    ModelLabelPipe,
    AsyncPipe,
    IonItem,
    IonLabel,
    IonCheckbox,
    TranslatePipe,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
  ],
  styleUrls: ['./check.component.scss'],
})
export class InputCheckComponent<T> extends InputPossibilitiesBaseComponent<T> {
  override possibilities: Signal<Array<{
    id: any;
    text: string;
    checked: boolean;
  }> | null> = signal(null);

  constructor(
    cd: ChangeDetectorRef,
    @Optional()
    @Inject(MODEL_POSSIBILITIES_PROVIDER)
    modelPossibilitiesProvider: IModelPossibilitiesProvider,
  ) {
    super(cd, modelPossibilitiesProvider);
  }

  protected override afterSetOptionsHandler(): void {


    if (this.internalOptions && !this.possibilities) {
      this.possibilities = signal(
        getModelFieldOptions(
          this.internalOptions.model,
          this.internalOptions.fieldKey,
        ).possibilities,
      );
    }

    effect(() => {
      const list = this.possibilities();
      if (list) {
        const result = list.map((item) => {
          if (this.control.value && item?.id?.id) {
            const controlItem = this.control.value.find(
              (ci: any) => ci?.id === item?.id.id,
            );
            if (controlItem) {
              item.id = controlItem;
              (item as any)['checked'] = true;
            }
          } else {
            (item as any)['checked'] = item.id === this.control.value;
          }

          return item;
        });

        this.possibilities = computed(() => result);

        this.cd.detectChanges();
      }
    });
  }

  refresh(item: { id: any; text: string; checked: boolean }): void {
    item.checked = !item.checked;

    const possibilities = this.possibilities();
    if (possibilities) {
      const result = possibilities
        .filter((p: any) => p.checked)
        .map((p) => p.id);
      this.control.markAsDirty();
      this.control.markAsTouched();
      this.control.setValue(result);
    }
  }
}
