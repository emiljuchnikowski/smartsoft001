import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertStandardComponent } from './standard.component';
import { IAlertOptions } from '../../../models';

describe('@smartsoft001/shared-angular: AlertStandardComponent', () => {
  let fixture: ComponentFixture<AlertStandardComponent>;
  let component: AlertStandardComponent;

  function render(options: IAlertOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertStandardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertStandardComponent);
    component = fixture.componentInstance;
  });

  describe('rendering', () => {
    it('should render a dialog with role="alertdialog" and aria-modal="true"', () => {
      render({});

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );

      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should render the header and point aria-labelledby at it', () => {
      render({ header: 'Are you sure?' });

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );
      const heading = fixture.nativeElement.querySelector('h2');

      expect(heading.textContent.trim()).toBe('Are you sure?');
      expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
      expect(heading.id).toBe(component.headerId);
    });

    it('should not set aria-labelledby when there is no header', () => {
      render({ message: 'Something' });

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );

      expect(dialog.getAttribute('aria-labelledby')).toBeNull();
    });

    it('should render the message and point aria-describedby at it', () => {
      render({ message: 'This cannot be undone' });

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );
      const message = fixture.nativeElement.querySelector('p');

      expect(message.textContent.trim()).toBe('This cannot be undone');
      expect(dialog.getAttribute('aria-describedby')).toBe(message.id);
      expect(message.id).toBe(component.messageId);
    });

    it('should render the subHeader when provided', () => {
      render({ subHeader: 'Item will be removed' });

      const subHeader = fixture.nativeElement.querySelector('h3');

      expect(subHeader.textContent.trim()).toBe('Item will be removed');
    });

    it('should render one button per option with its text and data-role', () => {
      render({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm' }],
      });

      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent.trim()).toBe('Cancel');
      expect(buttons[0].getAttribute('data-role')).toBe('cancel');
      expect(buttons[1].textContent.trim()).toBe('Confirm');
      expect(buttons[1].getAttribute('data-role')).toBeNull();
    });

    it('should include the external class on the dialog panel', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      render({});

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );

      expect(dialog.className).toContain('my-extra-class');
    });

    it('should include dark mode classes on the dialog panel', () => {
      render({});

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );

      expect(dialog.className).toContain('smart:dark:bg-gray-800');
    });
  });

  describe('interaction', () => {
    it('should run the handler and emit dismissed when the confirm button is clicked', () => {
      const handler = jest.fn();
      const spy = jest.fn();
      render({
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Confirm', handler },
        ],
      });
      component.dismissed.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons[1].click();

      expect(handler).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        text: 'Confirm',
        handler,
      });
    });

    it('should not run the confirm handler when the cancel button is clicked', () => {
      const handler = jest.fn();
      const spy = jest.fn();
      render({
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Confirm', handler },
        ],
      });
      component.dismissed.subscribe(spy);

      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons[0].click();

      expect(handler).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({ text: 'Cancel', role: 'cancel' });
    });

    it('should emit dismissed with the cancel button on Escape without running the confirm handler', () => {
      const handler = jest.fn();
      const spy = jest.fn();
      render({
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Confirm', handler },
        ],
      });
      component.dismissed.subscribe(spy);

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );

      expect(handler).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({ text: 'Cancel', role: 'cancel' });
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      document.body.appendChild(fixture.nativeElement);
    });

    afterEach(() => {
      fixture.nativeElement.remove();
    });

    it('should focus the first button after the first change detection', () => {
      render({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm' }],
      });

      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should focus the dialog panel when there are no buttons', () => {
      render({ header: 'No actions' });

      const dialog = fixture.nativeElement.querySelector(
        '[role="alertdialog"]',
      );

      expect(document.activeElement).toBe(dialog);
    });

    it('should wrap focus to the first button when tabbing from the last one', () => {
      render({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm' }],
      });

      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons[1].focus();
      buttons[1].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
      );

      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should wrap focus to the last button when shift-tabbing from the first one', () => {
      render({
        buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Confirm' }],
      });

      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons[0].focus();
      buttons[0].dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        }),
      );

      expect(document.activeElement).toBe(buttons[1]);
    });
  });
});
