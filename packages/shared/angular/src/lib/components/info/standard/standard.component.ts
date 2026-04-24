import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { InfoBaseComponent } from '../base';

@Component({
  selector: 'smart-info-standard',
  templateUrl: './standard.component.html',
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoStandardComponent extends InfoBaseComponent {
  private readonly elementRef = inject(ElementRef);

  containerClasses = computed(() => {
    const classes = ['smart:relative', 'smart:inline-block'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
