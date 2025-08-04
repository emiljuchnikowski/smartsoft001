import { Component, computed, ElementRef, OnInit } from '@angular/core';
import { NavParams } from "@ionic/angular";
import { first } from "rxjs/operators";

import {IEntity} from "@smartsoft001/domain-core";

import { IPageOptions, IDetailsOptions } from '../../models';
import {ModalService} from '../../services';
import {StyleService} from '../../services';
import { DetailsComponent, PageComponent } from '../../components';

@Component({
  templateUrl: './details.page.html',
  imports: [
    PageComponent,
    DetailsComponent
  ],
  styleUrls: ['./details.page.scss']
})
export class DetailsPage<T extends IEntity<string>> implements OnInit {
  pageOptions: IPageOptions = {
    title: "details",
    hideMenuButton: true
  };
  detailsOptions: IDetailsOptions<T>;

  constructor(
      navParams: NavParams,
      private modalService: ModalService,
      private styleService: StyleService,
      private elementRef: ElementRef
  ) {
    this.detailsOptions = navParams.get("value") as IDetailsOptions<T>;
    this.initTitle();
    this.initButtons();
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);
  }

  private initTitle(): void {
    if (this.detailsOptions.title) {
      this.pageOptions.title = this.detailsOptions.title;
    }
  }

  private initButtons(): void {
    const buttons = [];

    if (this.detailsOptions.removeHandler) {
      buttons.push({
        handler: () => {
          computed(() => {
            const item = this.detailsOptions.item();
            this.detailsOptions?.removeHandler?.(item);
            this.modalService.dismiss();
          });
        }, icon: 'trash'
      });
    }

    if (this.detailsOptions.itemHandler) {
      buttons.push({
        handler: () => {
          computed(() => {
            const item = this.detailsOptions.item();
            this.detailsOptions?.removeHandler?.(item);
            this.modalService.dismiss();
          });
        }, icon: 'arrow-forward-outline'
      });
    }

    this.pageOptions.endButtons = buttons;
  }
}
