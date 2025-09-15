import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-input-error',
  templateUrl: './error.component.html',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  errors = input<any | undefined>(undefined);
}
