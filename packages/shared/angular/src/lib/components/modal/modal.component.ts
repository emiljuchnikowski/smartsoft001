import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { ModalStandardComponent } from './standard/standard.component';
import { IModalAction, IModalOptions } from '../../models';
import { MODAL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-modal',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-modal-standard
        [(open)]="open"
        [title]="title()"
        [description]="description()"
        [actions]="actions()"
        [options]="options()"
        [class]="cssClass()"
        (actionClick)="actionClick.emit($event)"
        (closed)="closed.emit()"
      >
        <ng-content />
      </smart-modal-standard>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [ModalStandardComponent, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private injectedComponent = inject(MODAL_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  open = model<boolean>(false);
  title = input<string>();
  description = input<string>();
  actions = input<IModalAction[]>([]);
  options = input<IModalOptions>();
  cssClass = input<string>('', { alias: 'class' });

  actionClick = output<{ actionId: string }>();
  closed = output<void>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() => ({
    open: this.open(),
    title: this.title(),
    description: this.description(),
    actions: this.actions(),
    options: this.options(),
    cssClass: this.cssClass(),
  }));
}
