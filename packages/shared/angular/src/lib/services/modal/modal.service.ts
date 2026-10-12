import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  OnDestroy,
  reflectComponentType,
  Type,
} from '@angular/core';

import { ModalComponent } from '../../components/modal/modal.component';

export interface IModalServiceOptions {
  /** The component rendered in the modal. */
  component: any;
  /**
   * The inputs of `component`, by input name. Keys the component does not
   * declare as inputs are left out.
   */
  props?: any;
  /** `'bottom'` adds the `smart-modal-bottom` class to the modal. */
  mode?: 'default' | 'bottom';
  /** Classes added to the modal (`<smart-modal class>`). */
  cssClass?: string[];
  /**
   * `false` keeps the modal open on a click on its backdrop and on Escape;
   * its close button and `dismiss()` still close it. Defaults to `true`.
   */
  backdropDismiss?: boolean;
  /**
   * The injector `component` resolves its dependencies from (e.g. the opener's
   * `inject(Injector)`), the service's injector by default.
   */
  injector?: Injector;
}

export interface IModal {
  /** Closes the modal; `onDidDismiss()` resolves with `{ data }`. */
  dismiss: (data?: any) => void;
  /** Resolves once the modal is closed, with the data it was closed with. */
  onDidDismiss(): Promise<{ data: any }>;
}

interface IModalEntry {
  modal: IModal;
  options: IModalServiceOptions;
}

/**
 * Opens a component in a `<smart-modal>` at the end of `<body>` (the
 * implementation registered for `MODAL_STANDARD_COMPONENT_TOKEN`, so the
 * preset when `provideSmartPresets()` is used). The modals stack: the last one
 * opened is on top, and `dismiss()` closes it.
 *
 * The component gets `props` as its inputs and, when it declares one, a
 * `dismiss` input with the function that closes its modal. It can also inject
 * `ModalService` and call `dismiss(data)`. The modal shows its close button;
 * closing it by the close button, the backdrop or Escape (as the modal
 * implementation provides them) resolves `onDidDismiss()` with
 * `{ data: null }`.
 */
@Injectable()
export class ModalService implements OnDestroy {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly entries: IModalEntry[] = [];

  /**
   * Stops Escape before the modal's own document listener (registered after
   * this one) while the top modal has `backdropDismiss: false`. Elements
   * inside the modal still receive the key; only document listeners added
   * after the first modal opened are skipped.
   */
  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' && event.key !== 'Esc') return;

    const top = this.entries[this.entries.length - 1];

    if (top?.options.backdropDismiss === false) {
      event.stopImmediatePropagation();
    }
  };

  async show(options: IModalServiceOptions): Promise<IModal> {
    const trigger = this.document.activeElement as HTMLElement | null;
    let resolveDismiss!: (result: { data: any }) => void;
    const dismissed = new Promise<{ data: any }>((resolve) => {
      resolveDismiss = resolve;
    });

    if (!this.entries.length) {
      this.document.addEventListener('keydown', this.onKeydown);
    }

    // The component resolves `ModalService` to this instance, whichever
    // injector it was opened from, so its `dismiss()` closes this stack.
    const elementInjector = Injector.create({
      providers: [{ provide: ModalService, useValue: this }],
      parent: options.injector ?? this.injector,
    });

    const content = createComponent(options.component as Type<unknown>, {
      environmentInjector: this.environmentInjector,
      elementInjector,
    });
    const ref = createComponent(ModalComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector,
      projectableNodes: [[content.location.nativeElement]],
    });
    const element = ref.location.nativeElement as HTMLElement;

    const entry: IModalEntry = {
      options,
      modal: {
        dismiss: (data: any = null) => {
          const index = this.entries.indexOf(entry);

          if (index === -1) return;

          this.entries.splice(index, 1);
          if (!this.entries.length) {
            this.document.removeEventListener('keydown', this.onKeydown);
          }

          content.destroy();
          ref.destroy();
          element.remove();
          trigger?.focus?.();
          resolveDismiss({ data });
        },
        onDidDismiss: () => dismissed,
      },
    };

    this.setInputs(content, {
      ...(options.props ?? {}),
      dismiss: entry.modal.dismiss,
    });

    ref.setInput('open', true);
    ref.setInput('options', { withDismiss: true });
    ref.setInput('class', this.getClasses(options).join(' '));
    ref.instance.closed.subscribe(() => entry.modal.dismiss());

    element.setAttribute('data-mode', options.mode ?? 'default');
    element.addEventListener(
      'click',
      (event) => this.onBackdropClick(event, options),
      true,
    );

    this.entries.push(entry);
    this.document.body.appendChild(element);
    this.appRef.attachView(content.hostView);
    this.appRef.attachView(ref.hostView);
    content.changeDetectorRef.detectChanges();
    ref.changeDetectorRef.detectChanges();

    return entry.modal;
  }

  /** Closes the modal opened last. */
  async dismiss<T>(data: T | null = null): Promise<void> {
    this.entries[this.entries.length - 1]?.modal.dismiss(data);
  }

  ngOnDestroy(): void {
    [...this.entries].reverse().forEach((entry) => entry.modal.dismiss());
    this.document.removeEventListener('keydown', this.onKeydown);
  }

  private getClasses(options: IModalServiceOptions): string[] {
    return [
      ...(options.cssClass ?? []),
      ...(options.mode === 'bottom' ? ['smart-modal-bottom'] : []),
    ];
  }

  /**
   * With `backdropDismiss: false`, a click that lands in the modal but outside
   * its dialog (the backdrop) is stopped before the modal sees it.
   */
  private onBackdropClick(event: Event, options: IModalServiceOptions): void {
    if (options.backdropDismiss !== false) return;

    const target = event.target as Element | null;

    if (!target?.closest?.('[role="dialog"]')) {
      event.stopPropagation();
    }
  }

  /** Sets the values whose keys `ref`'s component declares as inputs. */
  private setInputs(
    ref: ComponentRef<unknown>,
    values: Record<string, unknown>,
  ): void {
    const declared =
      reflectComponentType(ref.componentType as Type<unknown>)?.inputs ?? [];

    for (const { propName, templateName } of declared) {
      if (templateName in values) {
        ref.setInput(templateName, values[templateName]);
      } else if (propName in values) {
        ref.setInput(templateName, values[propName]);
      }
    }
  }
}
