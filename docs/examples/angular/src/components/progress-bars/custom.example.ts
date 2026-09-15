// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  IProgressBarsOptions,
  PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
  ProgressBarsBaseComponent,
  ProgressBarsComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-progress-bars',
  template: `
    <div [class]="containerClasses()" [attr.aria-label]="options()?.ariaLabel">
      @if (options()?.title) {
        <p class="docs-progress-bars__title">{{ options()?.title }}</p>
      }

      @if (options()?.value !== undefined) {
        <div class="docs-progress-bars__track">
          <div
            class="docs-progress-bars__value"
            [style.width.%]="options()?.value"
          ></div>
        </div>
      }

      <ol class="docs-progress-bars__steps">
        @for (step of steps(); track step.id) {
          <li>
            <button
              type="button"
              class="docs-progress-bars__step"
              [class]="
                'docs-progress-bars__step--' + (step.status ?? 'upcoming')
              "
              [attr.aria-current]="step.status === 'current' ? 'step' : null"
              (click)="stepClick.emit({ stepId: step.id })"
            >
              <span class="docs-progress-bars__index">{{ step.index }}</span>
              <span class="docs-progress-bars__name">{{ step.name }}</span>
            </button>
          </li>
        }
      </ol>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomProgressBarsComponent extends ProgressBarsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  readonly steps = computed(() => this.options()?.steps ?? []);

  readonly containerClasses = computed(() => {
    const classes = ['docs-progress-bars'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-progress-bars-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarsComponent],
  // The token swaps the standard progress bars for the custom one everywhere
  // below this component, so consumers keep writing `<smart-progress-bars>`.
  providers: [
    {
      provide: PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
      useValue: CustomProgressBarsComponent,
    },
  ],
  template: ` <smart-progress-bars [options]="options" /> `,
})
export class ProgressBarsCustomExampleComponent {
  readonly options: IProgressBarsOptions = {
    layout: 'progress-bar',
    title: 'Uploading files',
    ariaLabel: 'Upload progress',
    value: 50,
    steps: [
      { id: 'account', name: 'Account', index: '1', status: 'complete' },
      { id: 'profile', name: 'Profile', index: '2', status: 'current' },
      { id: 'review', name: 'Review', index: '3', status: 'upcoming' },
    ],
  };
}
// #endregion
