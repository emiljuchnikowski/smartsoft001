import {
  AfterViewInit,
  Input,
  ViewChild,
  ViewContainerRef,
  Directive,
} from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  getModelFieldsWithOptions,
  IFieldDetailsMetadata,
  IFieldOptions,
  ISpecification,
} from "@smartsoft001/models";
import { IEntity } from "@smartsoft001/domain-core";
import { ObjectService, SpecificationService } from "@smartsoft001/utils";

import {DynamicComponentType, ICellPipe, IDetailsComponentFactories, IDetailsOptions} from "../../../models";
import { AuthService } from "../../../services/auth/auth.service";
import {DetailsService} from "../../../services/details/details.service";

@Directive()
export abstract class DetailsBaseComponent<T extends IEntity<string>>
  implements AfterViewInit {
  static smartType: DynamicComponentType = 'details';

  private _fields: Array<{ key: string; options: IFieldOptions }> | null = null;
  private _type: any | null = null;

  componentFactories: IDetailsComponentFactories<T> | null = null;
  cellPipe: ICellPipe<T> | null = null;

  get fields(): Array<{ key: string; options: IFieldOptions }> | null {
    return this._fields;
  }

  get type(): any {
    return this._type;
  }

  item$: Observable<T> | null = null;
  loading$: Observable<boolean> | null = null;

  @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
  contentTpl: ViewContainerRef | null = null;

  @ViewChild("topTpl", { read: ViewContainerRef, static: true })
  topTpl: ViewContainerRef | null = null;

  @ViewChild("bottomTpl", { read: ViewContainerRef, static: true })
  bottomTpl: ViewContainerRef | null = null;

  @Input() set options(obj: IDetailsOptions<T> | null) {
    this._type = obj?.type ?? null;

    const enabledDefinitions: Array<{ key: string; spec: ISpecification | null }> = [];

    this._fields = getModelFieldsWithOptions(new this._type())
      .filter((f) => f.options.details)
      .filter((field) => {
        if ((field.options.details as IFieldDetailsMetadata).enabled) {
          enabledDefinitions.push({
            key: field.key,
            spec: (field.options.details as IFieldDetailsMetadata)?.enabled ?? null,
          });
        } else if (field.options.enabled) {
          enabledDefinitions.push({
            key: field.key,
            spec: field.options.enabled,
          });
        }

        if (
          (field.options.details as IFieldDetailsMetadata).permissions &&
          !this.authService.expectPermissions(
            (field.options.details as IFieldDetailsMetadata)?.permissions ?? null
          )
        ) {
          return false;
        }

        return true;
      });
    if (obj !== null) {
      this.item$ = obj.item$.pipe(
        map((item) => {
          if (!item) return item;

          let result = null;

          if (item instanceof obj.type) result = item;
          else result = ObjectService.createByType(item, obj.type);

          const removeFields = enabledDefinitions.filter((def) => {
            return SpecificationService.invalid(result, def.spec as ISpecification, {
              $root: this.detailsService.$root
            });
          }).map(def => def.key);

          if (this._fields) {
            this._fields = this._fields.filter(f => !removeFields.some(rf => rf === f.key));
          }

          return result;
        })
      ) as Observable<T>;

      this.loading$ = obj.loading$ ?? null;
      this.componentFactories = obj.componentFactories ?? null;
      this.cellPipe = obj.cellPipe ?? null;
    }

    this.generateDynamicComponents();
  }

  constructor(private authService: AuthService, private detailsService: DetailsService) {}

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  protected generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    if (this.componentFactories.top && this.topTpl) {
      if (!this.topTpl.get(0)) {
        this.topTpl.createComponent(this.componentFactories.top);
      }
    }

    if (this.componentFactories.bottom && this.bottomTpl) {
      if (!this.bottomTpl.get(0)) {
        this.bottomTpl.createComponent(this.componentFactories.bottom);
      }
    }
  }
}
