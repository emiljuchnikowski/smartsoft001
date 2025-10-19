import {
  Directive,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Debounce } from 'lodash-decorators';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, IModelFilter } from '@smartsoft001/models';

import { CrudFacade } from '../../../+state/crud.facade';
import { ICrudFilter } from '../../../models';

@Directive()
export class BaseComponent<T extends IEntity<string>> implements OnInit {
  protected facade = inject(CrudFacade<T>);
  protected translateService = inject(TranslateService);

  possibilities!: Signal<{ id: any; text: string }[]>;

  readonly item: InputSignal<IModelFilter | undefined> = input<IModelFilter>();
  readonly filter: InputSignal<ICrudFilter | undefined> = input<ICrudFilter>();

  get value(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === item.type)
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === item.type,
    );
    return query?.value;
  }

  set value(val: any) {
    this.refresh(val);
  }

  get minValue(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === '>=')
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === '>=',
    );
    return query?.value;
  }

  set minValue(val: any) {
    this.refresh(val, '>=');
  }

  get maxValue(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === '<=')
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === '<=',
    );
    return query?.value;
  }

  set maxValue(val: any) {
    this.refresh(val, '<=');
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  @Debounce(500)
  refresh(val: any, type: string | null = null): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item) return;

    if (!type) type = item.type;
    if (!filter.query) filter.query = [];

    filter.offset = 0;

    if (this.isArrayType()) {
      this.refreshForArray(val as [], type);
      return;
    }

    let query = filter.query!.find(
      (q) => q.key === item.key && q.type === type,
    );

    if (val === null || val === undefined || val === '') {
      if (query) {
        const index = filter.query!.indexOf(query);
        if (index > -1) {
          filter.query!.splice(index, 1);
        }
      }

      this.facade.read(filter);
      return;
    }

    if (!query) {
      query = {
        key: item.key,
        type: type as '=' | '!=' | '>=' | '<=' | '<' | '>',
        value: null,
      };

      filter.query!.push(query);
    }

    query.value = val;
    query.label = item.label;

    this.facade.read(filter);
  }

  clear(): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return;

    filter.query = filter.query?.filter((q) => q.key !== item.key);
    filter.offset = 0;
    this.facade.read(filter);
  }

  ngOnInit(): void {
    this.initPossibilities();
  }

  private initPossibilities(): void {
    const item = this.item();
    if (item?.possibilities) {
      this.possibilities = item.possibilities;
    }
  }

  private isArrayType(): boolean {
    const item = this.item();
    return item?.fieldType === FieldType.check;
  }

  private refreshForArray(vals: [], type: string): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item) return;
    if (!filter.query) filter.query = [];

    const queries =
      filter.query?.filter((q) => q.key === item.key && q.type === type) || [];

    queries.forEach((query) => {
      const index = filter.query!.indexOf(query);
      if (index > -1) {
        filter.query!.splice(index, 1);
      }
    });

    if (vals === null || vals === undefined || !vals.length) {
      this.facade.read(filter);
      return;
    }

    vals.forEach((val) => {
      const query = {
        key: item.key,
        type: type as '=' | '!=' | '>=' | '<=' | '<' | '>',
        value: val,
      };

      filter.query!.push(query);
    });

    this.facade.read(filter);
  }
}
