import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { DetailsComponent } from '../../components/details/details.component';
import {
  IDetailsOptions,
  IIconButtonOptions,
  IPageOptions,
} from '../../models';
import { ModalService, StyleService } from '../../services';

/**
 * The details of `value` full width, with the application style
 * (`StyleService`) applied to its element. Open it in a modal with
 * `[smartDetails]="{ component: DetailsPage, params }"` (or
 * `ModalService.show({ component: DetailsPage, props: { value } })`), which
 * passes `params` as `value`.
 *
 * `pageOptions()` gives the title and buttons for a page layout around it: a
 * `trash` button for `removeHandler` and an `arrow-forward-outline` button for
 * `itemHandler`, both closing the modal through `ModalService.dismiss()`. The
 * page layout itself moved out of the library (FRA-121), so the page does not
 * render them.
 */
@Component({
  templateUrl: './details.page.html',
  imports: [DetailsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage<T extends IEntity<string>> implements OnInit {
  private modalService = inject(ModalService);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);

  /** The details to show; `[smartDetails]` passes its `params` here. */
  value = input<IDetailsOptions<T>>();

  pageOptions: Signal<IPageOptions> = computed(() => {
    const value = this.value();

    return {
      title: value?.title ? value.title : 'details',
      hideMenuButton: true,
      endButtons: this.getButtons(value),
    };
  });

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  private getButtons(value?: IDetailsOptions<T>): IIconButtonOptions[] {
    const buttons: IIconButtonOptions[] = [];

    if (value?.removeHandler) {
      buttons.push({
        handler: () => {
          const item = value.item?.();
          if (item) value.removeHandler?.(item);
          void this.modalService.dismiss();
        },
        icon: 'trash',
      });
    }

    if (value?.itemHandler) {
      buttons.push({
        handler: () => {
          const item = value.item?.();
          if (item) value.itemHandler?.(item.id);
          void this.modalService.dismiss();
        },
        icon: 'arrow-forward-outline',
      });
    }

    return buttons;
  }
}
