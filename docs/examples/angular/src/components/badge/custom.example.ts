// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  BadgeBaseComponent,
  BadgeComponent,
  BADGE_STANDARD_COMPONENT_TOKEN,
  IBadgeOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-badge',
  template: `
    <span [class]="containerClasses()" [attr.data-color]="color()">
      @if (options()?.withDot) {
        <span class="docs-badge__dot" aria-hidden="true">&bull;</span>
      }

      <span class="docs-badge__text">{{ text() }}</span>

      @if (options()?.withRemove) {
        <button
          type="button"
          class="docs-badge__remove"
          aria-label="Remove"
          (click)="remove()"
        >
          &times;
        </button>
      }
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBadgeComponent extends BadgeBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-badge',
      `docs-badge--${this.size()}`,
      this.options()?.pill === false ? '' : 'docs-badge--pill',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-badge-custom-example',
  imports: [BadgeComponent],
  providers: [
    {
      provide: BADGE_STANDARD_COMPONENT_TOKEN,
      useValue: CustomBadgeComponent,
    },
  ],
  template: `
    <smart-badge
      text="In review"
      color="yellow"
      size="md"
      [options]="options"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeCustomExampleComponent {
  options: IBadgeOptions = { variant: 'soft', withDot: true, withRemove: true };
}
// #endregion
