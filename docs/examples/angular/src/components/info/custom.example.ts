// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  INFO_STANDARD_COMPONENT_TOKEN,
  IInfoOptions,
  InfoBaseComponent,
  InfoComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-info',
  template: `
    <div [class]="containerClasses()">
      <button
        type="button"
        class="docs-info__trigger"
        aria-label="More information"
        [attr.aria-expanded]="isOpen()"
        (click)="toggle(); $event.stopPropagation()"
      >
        ?
      </button>
      @if (isOpen()) {
        <div class="docs-info__popover" role="tooltip">
          {{ options().text | translate }}
        </div>
      }
    </div>
  `,
  imports: [TranslatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInfoComponent extends InfoBaseComponent {
  private readonly elementRef = inject(ElementRef);

  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class'
  // alias, so an info component registered through the token declares it
  // explicitly.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-info'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  // InfoBaseComponent owns isOpen/toggle/open/close but does not close the
  // popover on an outside click - a custom implementation adds that itself.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}

@Component({
  selector: 'docs-info-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InfoComponent],
  // The token swaps the standard info popover for the custom one everywhere
  // below this component, so consumers keep writing `<smart-info>`.
  providers: [
    { provide: INFO_STANDARD_COMPONENT_TOKEN, useValue: CustomInfoComponent },
  ],
  template: `
    <label class="docs-info__label">Email address</label>
    <smart-info [options]="options" />
  `,
})
export class InfoCustomExampleComponent {
  options: IInfoOptions = { text: 'Enter your primary email address.' };
}
// #endregion
