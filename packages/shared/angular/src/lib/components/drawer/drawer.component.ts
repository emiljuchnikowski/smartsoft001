import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  output,
  Renderer2,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { DrawerStandardComponent } from './standard/standard.component';
import { IDrawerOptions } from '../../models';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';

@Component({
  selector: 'smart-drawer',
  template: `
    <ng-template #content><ng-content /></ng-template>
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="
          componentType();
          inputs: componentInputs();
          content: projectedContent()
        "
      />
    } @else {
      <smart-drawer-standard
        [(open)]="open"
        [title]="title()"
        [options]="options()"
        [class]="cssClass()"
        (closed)="closed.emit()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </smart-drawer-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [DrawerStandardComponent, NgComponentOutlet, NgTemplateOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  private injectedComponent = inject(DRAWER_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  open = model<boolean>(false);
  title = input<string>();
  options = input<IDrawerOptions>();
  cssClass = input<string>('', { alias: 'class' });

  closed = output<void>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    open: this.open(),
    title: this.title(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));

  private readonly outlet = viewChild(NgComponentOutlet);

  /** The wrapper's `<ng-content>`, captured once for whichever branch renders. */
  private readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>('content');
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private projectedNodes?: Node[][];

  /**
   * The projected content as `NgComponentOutlet` content, so an implementation
   * registered through `DRAWER_STANDARD_COMPONENT_TOKEN` receives it in its
   * (default) `<ng-content>` slot.
   *
   * The outlet takes DOM nodes, not a template, so the content template is
   * rendered once into a detached view, destroyed with the wrapper. That view
   * only holds the `<ng-content>` instruction: the projected nodes belong to
   * the host's view, which keeps change-detecting them. Its root nodes are
   * moved into a single `display: contents` element, and that element is what
   * gets projected: the implementation moves just that node in and out when it
   * shows or hides its slot (e.g. on open / close), and control flow at the root
   * of the content keeps inserting its nodes next to its anchor inside it.
   * Memoised, because a new array makes the outlet re-create the component.
   */
  protected projectedContent(): Node[][] {
    if (!this.projectedNodes) {
      const view = this.contentTemplate().createEmbeddedView(undefined);
      const slot = this.renderer.createElement('div');
      this.renderer.setStyle(slot, 'display', 'contents');
      view.rootNodes.forEach((node) => this.renderer.appendChild(slot, node));
      this.destroyRef.onDestroy(() => view.destroy());
      this.projectedNodes = [[slot]];
    }

    return this.projectedNodes;
  }

  constructor() {
    forwardOutletOutputs(this.outlet, {
      open: this.open,
      closed: this.closed,
    });
  }
}
