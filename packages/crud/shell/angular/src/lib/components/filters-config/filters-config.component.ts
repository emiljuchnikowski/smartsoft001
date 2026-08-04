import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { StyleService } from '@smartsoft001/angular';

import { CrudFacade } from '../../+state/crud.facade';
import { ICrudFilterQueryItem } from '../../models';

@Component({
  selector: 'smart-crud-filters-config',
  template: `
    @let query = this.query();
    @if (query && query.length) {
      <div class="smart:flex smart:flex-wrap smart:gap-2 smart:px-4 smart:py-2">
        @for (item of query; track item) {
          <button
            type="button"
            (click)="onRemoveQuery(item)"
            class="smart:inline-flex smart:items-center smart:gap-1 smart:rounded-full smart:border smart:border-gray-300 smart:bg-gray-50 smart:px-3 smart:py-1 smart:text-sm smart:text-gray-700 smart:hover:bg-gray-100"
            [attr.aria-label]="
              ('remove' | translate) + ' ' + ('MODEL.' + item.key | translate)
            "
          >
            <span
              >{{ 'MODEL.' + item.key | translate }} {{ item.type }}
              {{ item.value | translate }}</span
            >
            <span aria-hidden="true" class="smart:text-red-600">✕</span>
          </button>
        }
      </div>
    }
  `,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersConfigComponent implements OnInit {
  private readonly facade = inject(CrudFacade<any>);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);

  query!: Signal<ICrudFilterQueryItem[]>;

  onRemoveQuery(item: ICrudFilterQueryItem): void {
    const filter = this.facade.filter();
    if (filter?.query) {
      const index = filter.query.indexOf(item);
      if (index > -1) {
        filter.query.splice(index, 1);
      }
    }
    this.facade.read(this.facade.filter());
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);

    this.query = computed(() => {
      const filter = this.facade.filter();
      return filter?.query?.filter((i) => !i.hidden) || [];
    });
  }
}
