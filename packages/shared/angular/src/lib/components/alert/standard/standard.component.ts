import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { AlertBaseComponent } from '../base';

@Component({
  selector: 'smart-alert-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { '(document:keydown.escape)': 'onEscape()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertStandardComponent
  extends AlertBaseComponent
  implements AfterViewInit
{
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    const panel: HTMLElement | null =
      this.elementRef.nativeElement?.querySelector?.('[role="alertdialog"]') ??
      null;

    if (!panel) return;

    const target = panel.querySelector<HTMLElement>('button') ?? panel;

    target.focus?.();
  }
}
