import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { StackedLayoutBaseComponent } from '../base';

/**
 * Barebones native-HTML stacked layout rendered by `<smart-stacked-layout>`.
 *
 * Renders `options.navTpl` in a `<header><nav>`, then `options.headerTpl` —
 * or, without it, `options.title` as `<header><h1 data-role="title">` — and
 * the projected content in `<main>`. `options.containerWidth` is visual only:
 * it is exposed as `data-container-width` (default `'xl'`) and styled by the
 * preset.
 */
@Component({
  selector: 'smart-stacked-layout-standard',
  templateUrl: './standard.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class StackedLayoutStandardComponent extends StackedLayoutBaseComponent {
  protected containerWidth = computed(
    () => this.options()?.containerWidth ?? 'xl',
  );
}
