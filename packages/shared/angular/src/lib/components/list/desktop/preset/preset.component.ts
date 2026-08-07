import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { IEntity } from '@smartsoft001/domain-core';

import {
  getListDesktopCellClasses,
  getListDesktopContainerClasses,
  getListDesktopHeaderCellClasses,
  getListDesktopHeaderRowClasses,
  getListDesktopRowClasses,
  getListDesktopTableClasses,
} from './preset-classes.util';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../../../pipes';
import { PagingComponent } from '../../../paging';
import { ListDesktopComponent } from '../desktop.component';

/**
 * Preline-styled desktop list variation (preset).
 *
 * Drop-in replacement for `ListDesktopComponent` — register it through
 * `LIST_MODE_COMPONENTS_TOKEN` for `ListMode.desktop`, or use the
 * `<smart-list-desktop-preset>` selector directly.
 *
 * Keeps every functional branch of the base desktop table (top slot, multi
 * select, remove/item actions, pagination, image cells) and restyles it with
 * the Preline table look. Styling variations are driven by
 * `options.presentation`: `variant` (default | striped | bordered |
 * borderless), `hoverable`, and `header` (default | muted | none).
 *
 * Decorator metadata is not inherited, so the full `imports` list is repeated.
 */
@Component({
  selector: 'smart-list-desktop-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ListHeaderPipe,
    ListCellPipe,
    LazyLoadImageModule,
    FileUrlPipe,
    TranslatePipe,
    PagingComponent,
    CdkTable,
    CdkHeaderCell,
    CdkCell,
    CdkHeaderRow,
    CdkRow,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkHeaderRowDef,
    CdkRowDef,
  ],
})
export class ListDesktopPresetComponent<
  T extends IEntity<string>,
> extends ListDesktopComponent<T> {
  // cssClass keeps the inherited `class` alias — ListComponent forwards the
  // input under the `class` key through NgComponentOutlet.

  private presentation = computed(() => this.options()?.presentation ?? {});

  override containerClasses = computed(() =>
    [
      getListDesktopContainerClasses(this.presentation().variant),
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  tableClasses = computed(() =>
    getListDesktopTableClasses(this.presentation().variant),
  );

  headerRowClasses = computed(() =>
    getListDesktopHeaderRowClasses(this.presentation().header),
  );

  headerCellClasses = computed(() => getListDesktopHeaderCellClasses());

  rowClasses = computed(() =>
    getListDesktopRowClasses(
      this.presentation().variant,
      Boolean(this.presentation().hoverable),
    ),
  );

  cellClasses = computed(() => getListDesktopCellClasses());
}
