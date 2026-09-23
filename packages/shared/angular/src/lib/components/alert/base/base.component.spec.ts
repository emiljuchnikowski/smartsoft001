import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBaseComponent } from './base.component';
import { IAlertOptions } from '../../../models';

@Component({
  selector: 'smart-test-alert',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class TestAlertComponent extends AlertBaseComponent {}

@Component({
  selector: 'smart-test-host',
  template: `<smart-test-alert [options]="options" [class]="cssClass" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TestAlertComponent],
})
class TestHostComponent {
  options: IAlertOptions = {};
  cssClass = '';
}

describe('@smartsoft001/shared-angular: AlertBaseComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: TestAlertComponent;

  async function setOptions(options: IAlertOptions): Promise<void> {
    host.options = options;
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

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
    expect(directive).toBeInstanceOf(AlertBaseComponent);
  });

  it('should have smartType static equal to "alert"', () => {
    expect(AlertBaseComponent.smartType).toBe('alert');
  });

  it('should default cssClass to empty string', () => {
    expect(directive.cssClass()).toBe('');
  });

  it('should accept cssClass via class alias', async () => {
    host.cssClass = 'my-class';
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.cssClass()).toBe('my-class');
  });

  it('should build headerId and messageId from the same unique instance id', () => {
    expect(directive.headerId).toMatch(/^smart-alert-\d+-header$/);
    expect(directive.messageId).toBe(
      directive.headerId.replace('-header', '-message'),
    );
  });

  it('should generate a different id for every instance', () => {
    const otherFixture = TestBed.createComponent(TestHostComponent);
    otherFixture.detectChanges();
    const other: TestAlertComponent =
      otherFixture.debugElement.children[0].componentInstance;

    expect(other.headerId).not.toBe(directive.headerId);
  });

  describe('buttons()', () => {
    it('should default to an empty array when options have no buttons', () => {
      expect(directive.buttons()).toEqual([]);
    });

    it('should return the buttons from options', async () => {
      await setOptions({ buttons: [{ text: 'OK' }] });

      expect(directive.buttons()).toEqual([{ text: 'OK' }]);
    });
  });

  describe('cancelButton()', () => {
    it('should return null when there is no button with the cancel role', async () => {
      await setOptions({ buttons: [{ text: 'OK' }] });

      expect(directive.cancelButton()).toBeNull();
    });

    it('should return the button with the cancel role', async () => {
      await setOptions({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'OK' }],
      });

      expect(directive.cancelButton()).toEqual({
        text: 'Cancel',
        role: 'cancel',
      });
    });
  });

  describe('invoke()', () => {
    it('should run the button handler', () => {
      const handler = jest.fn();

      directive.invoke({ text: 'OK', handler });

      expect(handler).toHaveBeenCalled();
    });

    it('should emit dismissed with the invoked button', () => {
      const spy = jest.fn();
      const button = { text: 'OK', handler: jest.fn() };
      directive.dismissed.subscribe(spy);

      directive.invoke(button);

      expect(spy).toHaveBeenCalledWith(button);
    });

    it('should emit dismissed for a cancel button without a handler', () => {
      const spy = jest.fn();
      const button = { text: 'Cancel', role: 'cancel' };
      directive.dismissed.subscribe(spy);

      directive.invoke(button);

      expect(spy).toHaveBeenCalledWith(button);
    });

    it('should not emit dismissed when the handler returns false', () => {
      const spy = jest.fn();
      directive.dismissed.subscribe(spy);

      directive.invoke({ text: 'OK', handler: () => false });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit dismissed when a cancel handler returns false', () => {
      const spy = jest.fn();
      const button = { text: 'Cancel', role: 'cancel', handler: () => false };
      directive.dismissed.subscribe(spy);

      directive.invoke(button);

      expect(spy).toHaveBeenCalledWith(button);
    });
  });

  describe('cancel()', () => {
    it('should emit dismissed with the cancel button', async () => {
      const spy = jest.fn();
      await setOptions({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'OK' }],
      });
      directive.dismissed.subscribe(spy);

      directive.cancel();

      expect(spy).toHaveBeenCalledWith({ text: 'Cancel', role: 'cancel' });
    });

    it('should emit dismissed with null when there is no cancel button', async () => {
      const spy = jest.fn();
      await setOptions({ buttons: [{ text: 'OK' }] });
      directive.dismissed.subscribe(spy);

      directive.cancel();

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should not run the cancel button handler', async () => {
      const handler = jest.fn();
      await setOptions({
        buttons: [{ text: 'Cancel', role: 'cancel', handler }],
      });

      directive.cancel();

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('onEscape()', () => {
    it('should emit dismissed with the cancel button', async () => {
      const spy = jest.fn();
      await setOptions({ buttons: [{ text: 'Cancel', role: 'cancel' }] });
      directive.dismissed.subscribe(spy);

      directive.onEscape();

      expect(spy).toHaveBeenCalledWith({ text: 'Cancel', role: 'cancel' });
    });
  });

  describe('onBackdropClick()', () => {
    it('should cancel when the click target is the backdrop itself', () => {
      const spy = jest.fn();
      const backdrop = document.createElement('div');
      directive.dismissed.subscribe(spy);

      directive.onBackdropClick({
        target: backdrop,
        currentTarget: backdrop,
      } as unknown as MouseEvent);

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should ignore clicks whose target is not the backdrop', () => {
      const spy = jest.fn();
      const backdrop = document.createElement('div');
      const panel = document.createElement('div');
      directive.dismissed.subscribe(spy);

      directive.onBackdropClick({
        target: panel,
        currentTarget: backdrop,
      } as unknown as MouseEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should ignore backdrop clicks when backdropDismiss is false', async () => {
      const spy = jest.fn();
      const backdrop = document.createElement('div');
      await setOptions({ backdropDismiss: false });
      directive.dismissed.subscribe(spy);

      directive.onBackdropClick({
        target: backdrop,
        currentTarget: backdrop,
      } as unknown as MouseEvent);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('trapFocus()', () => {
    function createContainer(count: number): HTMLElement {
      const container = document.createElement('div');
      for (let i = 0; i < count; i++) {
        container.appendChild(document.createElement('button'));
      }
      document.body.appendChild(container);

      return container;
    }

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should ignore keys other than Tab', () => {
      const container = createContainer(2);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefault = jest.spyOn(event, 'preventDefault');

      directive.trapFocus(event, container);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should do nothing when the container has no buttons', () => {
      const container = createContainer(0);
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefault = jest.spyOn(event, 'preventDefault');

      directive.trapFocus(event, container);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should not prevent default when focus is not at a boundary', () => {
      const container = createContainer(3);
      const buttons = container.querySelectorAll('button');
      buttons[1].focus();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefault = jest.spyOn(event, 'preventDefault');

      directive.trapFocus(event, container);

      expect(preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('buttonClasses()', () => {
    it('should return secondary classes for the cancel role', () => {
      const classes = directive.buttonClasses({
        text: 'Cancel',
        role: 'cancel',
      });

      expect(classes).toContain('smart:bg-white');
      expect(classes).toContain('smart:dark:bg-gray-700');
    });

    it('should return red classes for the destructive role', () => {
      const classes = directive.buttonClasses({
        text: 'Delete',
        role: 'destructive',
      });

      expect(classes).toContain('smart:bg-red-600');
    });

    it('should return primary classes when no role is given', () => {
      const classes = directive.buttonClasses({ text: 'OK' });

      expect(classes).toContain('smart:bg-blue-600');
    });

    it('should append a string cssClass', () => {
      const classes = directive.buttonClasses({
        text: 'OK',
        cssClass: 'extra-class',
      });

      expect(classes).toContain('extra-class');
    });

    it('should append an array cssClass', () => {
      const classes = directive.buttonClasses({
        text: 'OK',
        cssClass: ['one', 'two'],
      });

      expect(classes).toContain('one');
      expect(classes).toContain('two');
    });
  });
});
