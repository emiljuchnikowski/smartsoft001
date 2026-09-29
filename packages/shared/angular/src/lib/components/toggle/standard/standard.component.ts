import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ToggleBaseComponent } from '../base';

let nextToggleId = 0;

/**
 * Barebones native-HTML toggle (checkbox) rendered by `<smart-toggle>`.
 *
 * `options.label` renders in a `<label for>` bound to the checkbox (so it is
 * the accessible name), `options.description` in an element referenced by
 * `aria-describedby`; both sit after the checkbox, or before it when
 * `options.labelPosition === 'left'`. `options.ariaLabel` names the checkbox
 * only when there is no visible label.
 */
@Component({
  selector: 'smart-toggle-standard',
  templateUrl: './standard.component.html',
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleStandardComponent extends ToggleBaseComponent {
  private readonly instanceId = `smart-toggle-${nextToggleId++}`;
  protected readonly inputId = `${this.instanceId}-input`;
  protected readonly descriptionId = `${this.instanceId}-description`;

  protected label = computed(() => this.options()?.label ?? '');
  protected description = computed(() => this.options()?.description ?? '');
  protected labelPosition = computed(
    () => this.options()?.labelPosition ?? 'right',
  );
  protected hasText = computed(() =>
    Boolean(this.label() || this.description()),
  );

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }
}
