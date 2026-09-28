// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CardComponent, ICardOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-card-usage-example',
  imports: [CardComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardUsageExampleComponent {
  readonly options: ICardOptions = {
    title: 'Team members',
    grayFooter: true,
  };

  readonly seatsUsed = 4;
  readonly seatsTotal = 10;
}
// #endregion
