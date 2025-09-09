import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-info',
  template: `
    <!--<ion-icon-->
    <!--  name="information-circle-outline"-->
    <!--  (click)="onClick($event)"-->
    <!--&gt;</ion-icon>-->
  `,
  styles: [
    `
      :host {
        cursor: pointer;
        font-size: 2.4rem;
        transform: translate(0, -50%);
        ion-icon {
          color: var(--smart-color-primary);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  // private popoverCtrl: PopoverController TODO: to be rewritten

  text = input.required<string>();

  async onClick(ev: any): Promise<void> {
    // const popover = await this.popoverCtrl.create({
    //   backdropDismiss: true,
    //   component: InfoModalComponent,
    //   componentProps: {
    //     text: this.text,
    //   },
    //   event: ev,
    // });
    //
    // await popover.present();
  }
}

@Component({
  selector: 'smart-info-modal',
  template: `
    <!--    <ion-content-->
    <!--      class="ion-padding"-->
    <!--      [innerHTML]="text | translate"-->
    <!--    ></ion-content>-->
  `,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoModalComponent {
  text: string;

  constructor(/*params: NavParams*/) {
    this.text = /*params.get('text')*/ 'text';
  }
}
