// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  IStackedLayoutOptions,
  STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
  StackedLayoutBaseComponent,
  StackedLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-stacked-layout',
  template: `
    <div [class]="containerClasses()">
      <header class="docs-stacked-layout__nav">
        @if (options()?.navTpl) {
          <nav>
            <ng-container [ngTemplateOutlet]="options()!.navTpl!" />
          </nav>
        }
      </header>

      @if (options()?.headerTpl) {
        <header class="docs-stacked-layout__header">
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      } @else if (options()?.title) {
        <header class="docs-stacked-layout__header">
          <h1>{{ options()!.title }}</h1>
        </header>
      }

      <!--
        smart-stacked-layout renders a custom implementation through
        NgComponentOutlet, which forwards neither projected content nor extra
        inputs. Only options and cssClass arrive here, so the page body comes
        from options().* templates instead of <ng-content>.
      -->
      <main class="docs-stacked-layout__main">
        <p>Main content rendered by the layout implementation.</p>
      </main>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomStackedLayoutComponent extends StackedLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-stacked-layout',
      `docs-stacked-layout--${this.options()?.containerWidth ?? 'full'}`,
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-stacked-layout-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackedLayoutComponent],
  // The token swaps the standard layout for the custom one everywhere below
  // this component, so consumers keep writing `<smart-stacked-layout>`.
  providers: [
    {
      provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
      useValue: CustomStackedLayoutComponent,
    },
  ],
  template: `
    <ng-template #navTpl>
      <a href="#dashboard">Dashboard</a>
      <a href="#team">Team</a>
      <a href="#projects">Projects</a>
    </ng-template>

    <ng-template #headerTpl>
      <h1>Projects</h1>
    </ng-template>

    <smart-stacked-layout [options]="options()" />
  `,
})
export class StackedLayoutCustomExampleComponent {
  private navTpl = viewChild.required<TemplateRef<unknown>>('navTpl');
  private headerTpl = viewChild.required<TemplateRef<unknown>>('headerTpl');

  // Both slots of IStackedLayoutOptions are TemplateRefs, so they are read from
  // the host view. computed() keeps the object identity stable between checks.
  options = computed<IStackedLayoutOptions>(() => ({
    title: 'Projects',
    containerWidth: 'xl',
    navTpl: this.navTpl(),
    headerTpl: this.headerTpl(),
  }));
}
// #endregion
