import {
  Directive,
  Type,
  ChangeDetectorRef,
  ViewContainerRef,
  input,
  effect,
  output,
  viewChild,
  inject, WritableSignal
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { DynamicComponentType, IFormOptions } from '../../../models';
import { BaseComponent } from '../../base';
import { InputBaseComponent } from '../../input';

@Directive()
export abstract class FormBaseComponent<T> extends BaseComponent {
  protected cd = inject(ChangeDetectorRef);
  static smartType: DynamicComponentType = 'form';

  private _fields!: Array<string>;
  private _subscription!: Subscription;
  private _model: any;
  private _possibilities!: {
    [key: string]: WritableSignal<{ id: any; text: string, checked: boolean }[]>;
  };
  private _inputComponents!: { [key: string]: Type<InputBaseComponent<T>> };

  mode!: string;
  treeLevel!: number | undefined;

  get fields(): Array<string> {
    return this._fields;
  }

  get model(): any {
    return this._model;
  }

  get possibilities(): {
    [key: string]: WritableSignal<{ id: any; text: string, checked: boolean }[]>;
  } {
    return this._possibilities;
  }

  get inputComponents(): { [key: string]: Type<InputBaseComponent<T>> } {
    return this._inputComponents;
  }

  form = input.required<UntypedFormGroup>();
  options = input.required<IFormOptions<T>>();

  invokeSubmit = output<any>();

  contentTpl = viewChild<ViewContainerRef | undefined>(ViewContainerRef);

  constructor() {
    super();

    effect(() => {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }

      this._subscription = new Subscription();

      this._fields = Object.keys(this.form().controls);

      this._subscription.add(
        this.form()
          .valueChanges.pipe(delay(0))
          .subscribe(() => {
            this.cd.detectChanges();
          }),
      );

      this.afterSetForm();
    });

    effect(() => {
      const options = this.options();
      this._model = options.model;
      this.mode = options?.mode ?? '';
      this._possibilities = options.possibilities ?? {};
      this._inputComponents = options.inputComponents ?? {};

      this.treeLevel = options.treeLevel;

      this.afterSetOptions();
    });
  }

  submit(): void {
    this.invokeSubmit.emit(this.form().value);
  }

  protected afterSetOptions() {
    // No base functionality
  }

  protected afterSetForm() {
    // No base functionality
  }

  getUntypedFormControl(field: string) {
    return this.form().controls[field] as UntypedFormControl;
  }
}
