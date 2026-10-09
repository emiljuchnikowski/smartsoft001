// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AccordionComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-accordion-usage-example',
  imports: [AccordionComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionUsageExampleComponent {
  readonly open = signal(false);
}
// #endregion
