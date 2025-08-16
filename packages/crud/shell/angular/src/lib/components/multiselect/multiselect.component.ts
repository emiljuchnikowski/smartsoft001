import { NgComponentOutlet } from '@angular/common';
import { Component, computed, OnInit, Signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ButtonComponent,
  FormComponent,
  IButtonOptions,
  MenuService,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldEditMetadata,
} from '@smartsoft001/models';
import * as _ from 'lodash';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { CrudFacade } from '../../+state/crud.facade';
import { CrudFullConfig } from '../../crud.config';
import { FormOptionsPipe } from '../../pipes';

@Component({
  selector: 'smart-crud-multiselect',
  templateUrl: './multiselect.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    TranslatePipe,
    NgComponentOutlet,
    DynamicIoDirective,
    FormOptionsPipe,
    FormComponent,
    ButtonComponent,
  ],
  styleUrls: ['./multiselect.component.scss'],
})
export class MultiselectComponent<T extends IEntity<string>> {
  private _list: Array<T>;
  private _changes: Partial<T>;

  item: T;
  valid: boolean;
  buttonOptions: IButtonOptions = {
    click: async () => {
      const result = this._list.map((item) => {
        return {
          ...this._changes,
          id: item.id,
        };
      });

      this.facade.updatePartialMany(result);
      await this.menuService.closeEnd();
    },
    confirm: true,
  };
  lock: boolean;
  showForm = false;

  list: Signal<T[]>;

  constructor(
    private facade: CrudFacade<T>,
    public config: CrudFullConfig<T>,
    private menuService: MenuService,
  ) {
    this.list = computed(() => {
      const list = this.facade.multiSelected();
      this.lock = true;
      const model = new this.config.type();

      const fieldsWithOptions = getModelFieldsWithOptions(model).filter(
        (f) => (f.options.update as IFieldEditMetadata)?.multi,
      );

      this.showForm = !!fieldsWithOptions.length;

      fieldsWithOptions.forEach(({ key }) => {
        const uniques = _.uniq(list.map((i) => i[key]));

        if (uniques.length === 1) {
          model[key] = uniques[0];
        }
      });

      this.item = model;

      return list;
    });
  }

  async onClose(): Promise<void> {
    await this.menuService.closeEnd();
  }

  onPartialChange(changes: Partial<T>, list: Array<T>) {
    this.lock = false;
    this._list = list;
    this._changes = changes;
  }

  onValidChange(valid: boolean) {
    this.valid = valid;
  }
}
