import { Location } from '@angular/common';
import {
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  Directive,
  ViewContainerRef,
  TemplateRef,
  input,
  viewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  DynamicComponentType,
  IIconButtonOptions,
  IPageOptions,
} from '../../../models';
import { AppService } from '../../../services';
import { HardwareService } from '../../../services';

@Directive()
export abstract class PageBaseComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private location = inject(Location);
  public appService = inject(AppService);
  public hardwareService = inject(HardwareService);
  // private popover: PopoverController, //TODO: to be injected

  static smartType: DynamicComponentType = 'page';

  public options = input<IPageOptions | null>();
  private _subscriptions = new Subscription();

  get isMobile(): boolean {
    return this.hardwareService.isMobile || this.hardwareService.isMobileWeb;
  }

  contentTpl = viewChild<TemplateRef<any> | ViewContainerRef | undefined>(
    'contentTpl',
  );

  back(): void {
    this.location.back();
  }

  async presentPopover(ev: any, btn: IIconButtonOptions): Promise<void> {
    // const instance = await this.popover.create({
    //   event: ev,
    //   component: btn.component,
    //   translucent: true,
    // });
    //
    // await instance.present();
  }

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
