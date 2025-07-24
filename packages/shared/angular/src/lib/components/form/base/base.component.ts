import {
  EventEmitter,
  Input,
  Output,
  Directive,
  Type,
  ChangeDetectorRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UntypedFormGroup} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {delay} from "rxjs/operators";

import {DynamicComponentType, IFormOptions} from "../../../models";
import {InputBaseComponent} from "../../input/base/base.component";
import {BaseComponent} from "../../base/base.component";

@Directive()
export abstract class FormBaseComponent<T> extends BaseComponent {
  static smartType: DynamicComponentType = "form";

  private _fields: Array<string>;
  private _subscription: Subscription;
  private _model: any;
  private _form: UntypedFormGroup;
  private _possibilities: {
    [key: string]: Observable<{ id: any, text: string }[]>;
  };
  private _inputComponents: { [key: string]: Type<InputBaseComponent<T>>; };

  mode: string;
  treeLevel: number;

  get fields(): Array<string> {
    return this._fields;
  }

  get model(): any {
      return this._model;
  }

  get possibilities(): {
    [key: string]: Observable<{ id: any, text: string }[]>;
  } {
    return this._possibilities;
  }

  get inputComponents(): { [key: string]: Type<InputBaseComponent<T>>; } {
    return this._inputComponents;
  }

  @Input() set form(val: UntypedFormGroup) {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = new Subscription();

    this._form = val;
    this._fields = Object.keys(this._form.controls);

    this._subscription.add(this._form.valueChanges.pipe(
        delay(0)
    ).subscribe(() => {
      this.cd.detectChanges();
    }));

    this.afterSetForm();
  }
  get form(): UntypedFormGroup {
    return this._form;
  }

  @Input() set options(obj: IFormOptions<T>) {
      this._model = obj.model;
      this.mode = obj.mode;
      this._possibilities = obj.possibilities ? obj.possibilities : {};
      this._inputComponents = obj.inputComponents ? obj.inputComponents : {};

      this.treeLevel = obj.treeLevel;

      this.afterSetOptions();
  }

  @Output() invokeSubmit = new EventEmitter();

  @ViewChild("contentTpl", { read: ViewContainerRef, static: true })
  contentTpl: ViewContainerRef;

  constructor(protected cd: ChangeDetectorRef) {
    super();
  }

  submit(): void {
    this.invokeSubmit.emit(this.form.value);
  }

  protected afterSetOptions(): void { }

  protected afterSetForm(): void { }
}
