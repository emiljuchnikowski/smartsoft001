import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-input-error',
  templateUrl: './error.component.html',
  styleUrls: ['../../../styles/global.scss', './error.component.scss'],
  imports: [TranslatePipe, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  @Input() errors: any;
}
