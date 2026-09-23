import {
  Directive,
  inject,
  input,
  output,
  Signal,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';

import {
  BaseComponent,
  DynamicComponentType,
  FormComponent,
  IDetailsOptions,
  SmartFormGroup,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../../+state/crud.facade';
import { CrudFullConfig } from '../../../crud.config';

@Directive()
export abstract class CrudItemPageBaseComponent<
  T extends IEntity<string>,
> extends BaseComponent {
  public config = inject(CrudFullConfig<T>);
  public facade = inject(CrudFacade<T>);

  static smartType: DynamicComponentType = 'crud-item-page';

  selected: Signal<T>;

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  formComponents = viewChildren(FormComponent);

  detailsOptions = input<IDetailsOptions<T>>();

  mode = input<string>();

  uniqueProvider = input<(values: Record<keyof T, any>) => Promise<boolean>>();

  onPartialChange = output<Partial<T>>();

  onChange = output<T>();

  onValidChange = output<boolean>();

  constructor() {
    super();
    this.selected = this.facade.selected;
  }

  /**
   * The reactive form of the first rendered `<smart-form>`, or `undefined`
   * until the form factory has built it. `FormComponent.form` is a getter over
   * a signal, so it always reports the group currently rendered; a method is
   * kept here so the page button handlers read that group at call time rather
   * than through a `computed` captured when the form did not exist yet.
   */
  getForm(): SmartFormGroup | undefined {
    return this.formComponents()[0]?.form;
  }
}
