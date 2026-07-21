import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { getContainerClasses } from './preset-classes.util';
import { ContainerStandardComponent } from '../standard/standard.component';

/**
 * Styled container variation (preset).
 *
 * Drop-in replacement for `ContainerStandardComponent` — register it through
 * `CONTAINER_STANDARD_COMPONENT_TOKEN`, or use the `<smart-container-preset>`
 * selector directly. Unlike the neutral standard component, this variant maps
 * `IContainerOptions` (`mode`, `padding`, `narrow`) to real layout utilities.
 *
 * Decorator metadata is not inherited, but the standard component declares no
 * imports, so none are repeated here.
 */
@Component({
  selector: 'smart-container-preset',
  template: `
    <div [class]="containerClasses()" data-role="container">
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerPresetComponent extends ContainerStandardComponent {
  // NgComponentOutlet forwards inputs canonically, so drop the `class` alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      getContainerClasses(
        this.options()?.mode,
        this.options()?.padding,
        this.options()?.narrow,
      ),
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
