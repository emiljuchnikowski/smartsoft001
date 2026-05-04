import {
  AfterViewInit,
  Directive,
  effect,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DynamicComponentType, ISearchbarOptions } from '../../../models';

@Directive()
export abstract class SearchbarBaseComponent
  implements AfterViewInit, OnDestroy
{
  static smartType: DynamicComponentType = 'searchbar';

  private _subscriptions = new Subscription();

  options: InputSignal<ISearchbarOptions | undefined> =
    input<ISearchbarOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  show: ModelSignal<boolean> = model<boolean>(true);
  text = model.required<string>();

  control: WritableSignal<UntypedFormControl> = signal(
    new UntypedFormControl(),
  );

  constructor() {
    effect(() => {
      const text = this.text();
      if (text?.length) {
        this.control().setValue(text, { emitEvent: false });
      }
    });
  }

  setShow(): void {
    this.show.set(true);
  }

  tryHide(): void {
    if (!this.control().value) this.show.set(false);
  }

  ngAfterViewInit(): void {
    const debounceMs = this.options()?.debounceTime ?? 1000;

    this._subscriptions.add(
      this.control()
        .valueChanges.pipe(debounceTime(debounceMs))
        .subscribe((val) => {
          this.text.set(val);
        }),
    );
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
