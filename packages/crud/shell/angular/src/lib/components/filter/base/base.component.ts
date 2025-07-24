import {Directive, Inject, Input, OnInit, Optional} from "@angular/core";
import {Debounce} from "lodash-decorators";
import {Observable} from "rxjs";

import {IEntity} from "@smartsoft001/domain-core";
import {FieldType, IModelFilter} from "@smartsoft001/models";

import {ICrudFilter} from "../../../models/interfaces";
import {CrudFacade} from "../../../+state/crud.facade";
import {
  CRUD_MODEL_POSSIBILITIES_PROVIDER,
  ICrudModelPossibilitiesProvider,
} from "../../../providers/model-possibilities/model-possibilities.provider";
import {CrudConfig} from "../../../crud.config";
import {TranslateService} from "@ngx-translate/core";

@Directive()
export class BaseComponent<T extends IEntity<string>> implements OnInit {
  possibilities$: Observable<{ id: any; text: string }[]>;

  @Input() item: IModelFilter;
  @Input() filter: ICrudFilter;

  get value(): any {
    if (this.isArrayType()) {
      return this.filter.query
          .filter(
            (q) => q.key === this.item.key && q.type === this.item.type
          )
          .map(q => q.value);
    }

    const query = this.filter.query.find(
      (q) => q.key === this.item.key && q.type === this.item.type
    );
    return query?.value;
  }

  set value(val: any) {
    this.refresh(val);
  }

  get minValue(): any {
    if (this.isArrayType()) {
      return this.filter.query
          .filter(
              (q) => q.key === this.item.key && q.type === ">="
          )
          .map(q => q.value);
    }

    const query = this.filter.query.find(
        (q) => q.key === this.item.key && q.type === ">="
    );
    return query?.value;
  }

  set minValue(val: any) {
    this.refresh(val, ">=");
  }

  get maxValue(): any {
    if (this.isArrayType()) {
      return this.filter.query
          .filter(
              (q) => q.key === this.item.key && q.type === "<="
          )
          .map(q => q.value);
    }

    const query = this.filter.query.find(
        (q) => q.key === this.item.key && q.type === "<="
    );
    return query?.value;
  }

  set maxValue(val: any) {
    this.refresh(val, "<=");
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  constructor(
    protected facade: CrudFacade<T>,
    private config: CrudConfig<T>,
    @Optional()
    @Inject(CRUD_MODEL_POSSIBILITIES_PROVIDER)
    private modelPossibilitiesProvider: ICrudModelPossibilitiesProvider,
    protected translateService: TranslateService
  ) {}

  @Debounce(500)
  refresh(val: any, type = null): void {
    if (!type) type = this.item.type;

    this.filter.offset = 0;

    if (this.isArrayType()) {
      this.refreshForArray(val as [], type);
      return;
    }

    let query = this.filter.query.find(
        (q) => q.key === this.item.key && q.type === type
    );

    if (val === null || val === undefined || val === '') {
      const index = this.filter.query.indexOf(query);
      if (index > -1) {
        this.filter.query.splice(index, 1);
      }

      this.facade.read(this.filter);
      return;
    }

    if (!query) {
      query = {
        key: this.item.key,
        type: type,
        value: null,
      };

      this.filter.query.push(query);
    }

    query.value = val;
    query.label = this.item.label;

    this.facade.read(this.filter);
  }

  clear(): void {
    this.filter.query = this.filter.query.filter(
        (q) => q.key !== this.item.key
    );
    this.filter.offset = 0;
    this.facade.read(this.filter);
  }

  ngOnInit(): void {
    this.initPossibilities();
  }

  private initPossibilities(): void {
    let possibilities = this.item.possibilities$;

    if (this.modelPossibilitiesProvider) {
      const possibilitiesFromProvider = this.modelPossibilitiesProvider.get(this.config.type);
      if (possibilitiesFromProvider && possibilitiesFromProvider[this.item.key])
        possibilities = possibilitiesFromProvider[this.item.key];
    }

    this.possibilities$ = possibilities;
  }

  private isArrayType(): boolean {
    return (this.item?.fieldType === FieldType.check);
  }

  private refreshForArray(vals: [], type): void {
    const queries = this.filter.query.filter(
        (q) => q.key === this.item.key && q.type === type
    );

    queries.forEach(query => {
      const index = this.filter.query.indexOf(query);
      if (index > -1) {
        this.filter.query.splice(index, 1);
      }
    });

    if (vals === null || vals === undefined || !vals.length) {
      this.facade.read(this.filter);
      return;
    }

    vals.forEach(val => {
      const query = {
        key: this.item.key,
        type: type,
        value: val,
      };

      this.filter.query.push(query);
    });

    this.facade.read(this.filter);
  }
}
