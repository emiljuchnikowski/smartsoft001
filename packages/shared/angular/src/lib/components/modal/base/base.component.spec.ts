import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBaseComponent } from './base.component';
import { IModalAction, IModalOptions } from '../../../models';

@Component({
  selector: 'smart-test-modal',
  template: '',
})
class TestModalComponent extends ModalBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-modal
    [(open)]="open"
    [title]="title"
    [description]="description"
    [actions]="actions"
    [options]="options"
    [class]="cssClass"
  />`,
  imports: [TestModalComponent],
})
class TestHostComponent {
  open = false;
  title: string | undefined = undefined;
  description: string | undefined = undefined;
  actions: IModalAction[] = [];
  options: IModalOptions | undefined = undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ModalBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].componentInstance;
  });

  it('should create an instance when extended', () => {
    expect(directive).toBeInstanceOf(ModalBaseComponent);
  });

  it('should have smartType static equal to "modal"', () => {
    expect(ModalBaseComponent.smartType).toBe('modal');
  });

  it('should default open to false', () => {
    expect(directive.open()).toBe(false);
  });

  it('should default actions to empty array', () => {
    expect(directive.actions()).toEqual([]);
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should accept IModalOptions via options input', async () => {
    host.options = { variant: 'centered', withDismiss: true };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.options()).toEqual({
      variant: 'centered',
      withDismiss: true,
    });
  });

  describe('invokeAction()', () => {
    it('should emit actionClick with the given action id', () => {
      const spy = jest.fn();
      directive.actionClick.subscribe(spy);

      directive.invokeAction('confirm');

      expect(spy).toHaveBeenCalledWith({ actionId: 'confirm' });
    });
  });

  describe('close()', () => {
    it('should set open to false', () => {
      directive.open.set(true);

      directive.close();

      expect(directive.open()).toBe(false);
    });

    it('should emit closed', () => {
      const spy = jest.fn();
      directive.closed.subscribe(spy);

      directive.close();

      expect(spy).toHaveBeenCalled();
    });
  });
});
