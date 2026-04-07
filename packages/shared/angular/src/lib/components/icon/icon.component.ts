import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type IconName = 'spinner' | 'chevron-down' | 'chevron-up';

@Component({
  selector: 'smart-icon',
  templateUrl: './icon.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  name = input.required<IconName>();
  cssClass = input<string>('');
}
