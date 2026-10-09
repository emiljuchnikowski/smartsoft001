// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  ISearchbarOptions,
  SEARCHBAR_STANDARD_COMPONENT_TOKEN,
  SearchbarBaseComponent,
  SearchbarComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-searchbar',
  template: `
    @if (show()) {
      <div [class]="containerClasses()">
        <span class="docs-searchbar__icon" aria-hidden="true">&#9906;</span>
        <input
          type="search"
          class="docs-searchbar__input"
          [formControl]="control()"
          [placeholder]="options()?.placeholder ?? 'Search'"
          [attr.aria-label]="options()?.label ?? 'Search'"
          (blur)="tryHide()"
        />
      </div>
    } @else if (options()?.showToggleButton) {
      <button
        type="button"
        class="docs-searchbar__toggle"
        aria-label="Show the search field"
        (click)="setShow()"
      >
        &#9906;
      </button>
    }
  `,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSearchbarComponent extends SearchbarBaseComponent {
  // The base class owns the debounced control.valueChanges subscription that
  // feeds `text` - do not subscribe again here. `cssClass()` holds the `class`
  // given to <smart-searchbar>.
  readonly containerClasses = computed(() => {
    const classes = ['docs-searchbar'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-searchbar-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchbarComponent],
  // The token swaps the standard searchbar for the custom one everywhere below
  // this component, so consumers keep writing `<smart-searchbar>`.
  providers: [
    {
      provide: SEARCHBAR_STANDARD_COMPONENT_TOKEN,
      useValue: CustomSearchbarComponent,
    },
  ],
  // The wrapper forwards `show` and `text` both ways: the values reach the
  // custom component, and its own changes come back to these signals.
  template: `
    <smart-searchbar [(show)]="show" [(text)]="text" [options]="options" />
    @if (text()) {
      <p>Results for "{{ text() }}"</p>
    }
  `,
})
export class SearchbarCustomExampleComponent {
  readonly show = signal(true);
  readonly text = signal('');

  readonly options: ISearchbarOptions = {
    placeholder: 'Search invoices',
    label: 'Search invoices',
    debounceTime: 300,
    showToggleButton: true,
  };
}
// #endregion
