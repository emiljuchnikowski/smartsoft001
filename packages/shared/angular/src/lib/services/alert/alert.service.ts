import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';

import { AlertStandardComponent } from '../../components/alert';
import { IAlertButton, IAlertOptions } from '../../models';
import { ALERT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Injectable()
export class AlertService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly document = inject(DOCUMENT);
  private readonly componentType = inject(ALERT_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  /**
   * Mounts the alert dialog at the end of `<body>`, resolves with the chosen
   * button (null on Escape/backdrop without a cancel button) after that
   * button's handler has run, then removes the dialog and restores focus to
   * the previously focused element.
   */
  async show(options: IAlertOptions): Promise<IAlertButton | null> {
    const trigger = this.document.activeElement as HTMLElement | null;
    const ref = createComponent(this.componentType ?? AlertStandardComponent, {
      environmentInjector: this.environmentInjector,
    });

    ref.setInput('options', options);
    this.document.body.appendChild(ref.location.nativeElement);
    this.appRef.attachView(ref.hostView);
    ref.changeDetectorRef.detectChanges();

    try {
      return await new Promise<IAlertButton | null>((resolve) => {
        ref.instance.dismissed.subscribe(resolve);
      });
    } finally {
      ref.destroy();
      ref.location.nativeElement.remove();
      trigger?.focus?.();
    }
  }
}
