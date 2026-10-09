// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonComponent,
  CardComponent,
  IButtonOptions,
  ICardOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-card-usage-example',
  imports: [CardComponent, ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardUsageExampleComponent {
  readonly options: ICardOptions = {
    title: 'Team members',
    grayFooter: true,
  };

  readonly seatsUsed = signal(4);
  readonly seatsTotal = 10;

  readonly inviteButton: IButtonOptions = {
    click: () => this.seatsUsed.update((used) => used + 1),
  };
}
// #endregion
