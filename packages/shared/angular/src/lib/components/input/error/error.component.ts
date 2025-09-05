import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-input-error',
  templateUrl: './error.component.html',
  styleUrls: ['../../../styles/global.scss', './error.component.scss'],
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  @Input() errors: any;
}
