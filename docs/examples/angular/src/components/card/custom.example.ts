// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  CARD_STANDARD_COMPONENT_TOKEN,
  CardBaseComponent,
  CardComponent,
  ICardOptions,
} from '@smartsoft001/angular';

/**
 * A card of your own built on `CardBaseComponent`. `<smart-card>` hands its
 * `[cardHeader]`, default and `[cardFooter]` content over as the `headerTpl`,
 * `bodyTpl` and `footerTpl` templates.
 */
@Component({
  selector: 'docs-flat-card',
  imports: [NgTemplateOutlet],
  template: `
    <article [class]="containerClasses()">
      @if (hasHeader()) {
        <header class="docs-card__header">
          @if (options()?.title; as title) {
            <h3>{{ title }}</h3>
          }
          <ng-container [ngTemplateOutlet]="headerTpl() ?? null" />
        </header>
      }
      <div class="docs-card__body">
        <ng-container [ngTemplateOutlet]="bodyTpl()" />
      </div>
      @if (hasFooter()) {
        <footer class="docs-card__footer">
          <ng-container [ngTemplateOutlet]="footerTpl() ?? null" />
        </footer>
      }
    </article>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatCardComponent extends CardBaseComponent {
  containerClasses = computed(() =>
    ['docs-card', this.cssClass()].filter(Boolean).join(' '),
  );
}

// Registering the token makes every <smart-card> in this injector render
// FlatCardComponent.
@Component({
  selector: 'docs-card-custom-example',
  imports: [CardComponent],
  providers: [
    { provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: FlatCardComponent },
  ],
  template: `
    <smart-card [options]="options" [hasHeader]="true" [hasFooter]="true">
      <p>Pro plan, billed monthly.</p>
      <span cardFooter>Next invoice on 1 May</span>
    </smart-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCustomExampleComponent {
  options: ICardOptions = { title: 'Billing' };
}
// #endregion
