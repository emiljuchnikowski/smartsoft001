// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AccordionComponent, IAccordionOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-accordion-usage-example',
  imports: [AccordionComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionUsageExampleComponent {
  readonly options: IAccordionOptions = { disabled: false };

  readonly open = signal(false);
}
// #endregion
