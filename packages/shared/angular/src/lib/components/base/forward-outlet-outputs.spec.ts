import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { forwardOutletOutputs } from './forward-outlet-outputs';

@Component({
  selector: 'smart-test-outlet-child',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class ChildComponent {
  picked = output<string>();
  open = model(false);
}

@Component({
  selector: 'smart-test-outlet-wrapper',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-container *ngComponentOutlet="child" />',
})
class WrapperComponent {
  readonly child = ChildComponent;
  picked = output<string>();
  open = model(false);

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      picked: this.picked,
      open: this.open,
    });
  }
}

describe('@smartsoft001/shared-angular: forwardOutletOutputs', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [WrapperComponent] });
    const fixture = TestBed.createComponent(WrapperComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const child = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ChildComponent,
    ).componentInstance as ChildComponent;

    return { fixture, wrapper: fixture.componentInstance, child };
  }

  it('should re-emit an output of the rendered component', async () => {
    const { wrapper, child } = await setup();
    const emitted: string[] = [];
    wrapper.picked.subscribe((value) => emitted.push(value));

    child.picked.emit('alpha');

    expect(emitted).toEqual(['alpha']);
  });

  it('should write a model change of the rendered component to the wrapper model', async () => {
    const { wrapper, child } = await setup();

    child.open.set(true);

    expect(wrapper.open()).toBe(true);
  });

  it('should stop forwarding when the wrapper is destroyed', async () => {
    const { fixture, wrapper, child } = await setup();
    const emitted: string[] = [];
    wrapper.picked.subscribe((value) => emitted.push(value));

    fixture.destroy();
    child.picked.emit('late');

    expect(emitted).toEqual([]);
  });
});
