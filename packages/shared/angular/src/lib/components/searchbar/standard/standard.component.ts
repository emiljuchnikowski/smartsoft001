import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { SearchbarBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-searchbar-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchbarStandardComponent extends SearchbarBaseComponent {
  containerClasses = computed(() => {
    const classes = ['smart:relative', 'smart:mt-2'];
    return classes.join(' ');
  });

  inputClasses = computed(() => {
    const classes = [
      'smart:block',
      'smart:w-full',
      'smart:rounded-md',
      'smart:bg-white',
      'smart:py-1.5',
      'smart:pr-10',
      'smart:pl-3',
      'smart:text-base',
      'smart:text-gray-900',
      'smart:outline-1',
      'smart:-outline-offset-1',
      'smart:outline-gray-300',
      'placeholder:smart:text-gray-400',
      'focus:smart:outline-2',
      'focus:smart:-outline-offset-2',
      'focus:smart:outline-indigo-600',
      'smart:sm:text-sm/6',
      'smart:dark:bg-white/5',
      'smart:dark:text-white',
      'smart:dark:outline-white/10',
      'dark:placeholder:smart:text-gray-500',
      'dark:focus:smart:outline-indigo-500',
    ];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });

  toggleButtonClasses = computed(() =>
    [
      'smart:inline-flex',
      'smart:items-center',
      'smart:justify-center',
      'smart:rounded-md',
      'smart:bg-white',
      'smart:p-2',
      'smart:text-gray-500',
      'smart:shadow-xs',
      'smart:outline-1',
      'smart:-outline-offset-1',
      'smart:outline-gray-300',
      'hover:smart:bg-gray-50',
      'smart:dark:bg-white/5',
      'smart:dark:text-gray-400',
      'smart:dark:outline-white/10',
      'dark:hover:smart:bg-white/10',
    ].join(' '),
  );
}
