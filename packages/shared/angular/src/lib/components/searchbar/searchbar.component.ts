import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  model,
  OnDestroy,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'smart-searchbar',
  template: `
    @if (control() && show()) {
      <!--      <ion-searchbar-->
      <!--        #searchbar-->
      <!--        animated-->
      <!--        (ionBlur)="tryHide()"-->
      <!--        [formControl]="control()"-->
      <!--        [placeholder]="('search' | translate) + '...'"-->
      <!--      ></ion-searchbar>-->
    }
    @if (!show()) {
      <!--      <ion-button (click)="setShow()">-->
      <!--        <ion-icon-->
      <!--          style="font-weight: bold"-->
      <!--          slot="icon-only"-->
      <!--          name="search"-->
      <!--        ></ion-icon>-->
      <!--      </ion-button>-->
    }
  `,
  styles: [
    `
      .searchbar-input {
        /*border-radius: 2.1rem;*/
        /*--border-radius: 2.1rem;*/
        /*--background: var(--ion-color-light);*/
      }

      ion-searchbar {
        /*&.ios {*/
        /*  display: inline;*/
        /*}*/
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe],
})
export class SearchbarComponent implements OnDestroy, AfterViewInit {
  private _subscriptions = new Subscription();

  control: WritableSignal<UntypedFormControl> = signal(
    new UntypedFormControl(),
  );
  show = model<boolean>(true);
  text = model.required<string>();

  // @ViewChildren(IonSearchbar, { read: IonSearchbar }) searchComponents =
  //   new QueryList(); //TODO: rewrite ionic usage

  constructor() {
    effect(() => {
      const text = this.text();
      if (text?.length) {
        this.control().setValue(text);
      }
    });
  }

  async setShow(): Promise<void> {
    this.show.set(true);
  }

  tryHide(): void {
    if (!this.control().value) this.show.set(false);
  }

  ngAfterViewInit(): void {
    this._subscriptions.add(
      this.control()
        .valueChanges.pipe(debounceTime(1000))
        .subscribe((val) => {
          this.text.set(val);
        }),
    );

    //TODO: rewrite ionic usage
    // this._subscriptions.add(
    //   this.searchComponents.changes.subscribe(
    //     (searchComponents: QueryList<IonSearchbar>) => {
    //       if (searchComponents.length) searchComponents.first.setFocus().then();
    //     },
    //   ),
    // );
  }

  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
