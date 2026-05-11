import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStandardComponent } from './standard.component';

@Component({
  selector: 'smart-test-modal-host',
  template: `<smart-modal-standard
    [open]="open"
    [title]="title"
    [description]="description"
    [actions]="actions"
    [options]="options"
    [class]="cssClass"
  >
    <span class="projected-content">projected-body</span>
  </smart-modal-standard>`,
  imports: [ModalStandardComponent],
})
class TestModalHostComponent {
  open = true;
  title: string | undefined = undefined;
  description: string | undefined = undefined;
  actions: { id: string; label: string; variant?: string }[] = [];
  options: { withDismiss?: boolean; ariaLabel?: string } | undefined =
    undefined;
  cssClass = '';
}

describe('@smartsoft001/shared-angular: ModalStandardComponent', () => {
  describe('rendering', () => {
    let fixture: ComponentFixture<ModalStandardComponent>;
    let component: ModalStandardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ModalStandardComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalStandardComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
    });

    it('should render a <dialog> element with role="dialog" and aria-modal="true"', () => {
      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should reflect open() in the dialog open attribute', () => {
      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.hasAttribute('open')).toBe(true);
    });

    it('should not render a heading when title is not provided', () => {
      const heading = fixture.nativeElement.querySelector('h2');

      expect(heading).toBeNull();
    });

    it('should render a heading with the title when provided', () => {
      fixture.componentRef.setInput('title', 'Confirm');
      fixture.detectChanges();

      const heading = fixture.nativeElement.querySelector(
        'h2#smart-modal-title',
      );

      expect(heading).toBeTruthy();
      expect(heading.textContent.trim()).toBe('Confirm');
    });

    it('should set aria-labelledby when title is provided', () => {
      fixture.componentRef.setInput('title', 'Confirm');
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.getAttribute('aria-labelledby')).toBe('smart-modal-title');
    });

    it('should set aria-label from options when title is not provided', () => {
      fixture.componentRef.setInput('options', { ariaLabel: 'Modal box' });
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.getAttribute('aria-label')).toBe('Modal box');
    });

    it('should render a description paragraph when provided', () => {
      fixture.componentRef.setInput('description', 'Are you sure?');
      fixture.detectChanges();

      const p = fixture.nativeElement.querySelector('p');

      expect(p).toBeTruthy();
      expect(p.textContent.trim()).toBe('Are you sure?');
    });

    it('should render dismiss button when options.withDismiss is true', () => {
      fixture.componentRef.setInput('options', { withDismiss: true });
      fixture.detectChanges();

      const dismiss = fixture.nativeElement.querySelector(
        '.smart-modal-dismiss',
      );

      expect(dismiss).toBeTruthy();
    });

    it('should NOT render dismiss button by default', () => {
      const dismiss = fixture.nativeElement.querySelector(
        '.smart-modal-dismiss',
      );

      expect(dismiss).toBeNull();
    });

    it('should render one button per action with action label as text', () => {
      fixture.componentRef.setInput('actions', [
        { id: 'confirm', label: 'OK' },
        { id: 'cancel', label: 'Cancel' },
      ]);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('footer button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent.trim()).toBe('OK');
      expect(buttons[1].textContent.trim()).toBe('Cancel');
    });

    it('should set data-variant attribute from action.variant', () => {
      fixture.componentRef.setInput('actions', [
        { id: 'a', label: 'A', variant: 'danger' },
        { id: 'b', label: 'B' },
      ]);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('footer button');

      expect(buttons[0].getAttribute('data-variant')).toBe('danger');
      expect(buttons[1].getAttribute('data-variant')).toBe('primary');
    });

    it('should emit actionClick with id and not close when action is clicked', () => {
      fixture.componentRef.setInput('actions', [
        { id: 'confirm', label: 'OK' },
      ]);
      fixture.detectChanges();

      const spy = jest.fn();
      component.actionClick.subscribe(spy);

      const button = fixture.nativeElement.querySelector('footer button');
      button.click();

      expect(spy).toHaveBeenCalledWith({ actionId: 'confirm' });
      expect(component.open()).toBe(true);
    });

    it('should emit closed and set open=false when dismiss button is clicked', () => {
      fixture.componentRef.setInput('options', { withDismiss: true });
      fixture.detectChanges();

      const spy = jest.fn();
      component.closed.subscribe(spy);

      const dismiss = fixture.nativeElement.querySelector(
        '.smart-modal-dismiss',
      );
      dismiss.click();

      expect(spy).toHaveBeenCalled();
      expect(component.open()).toBe(false);
    });

    it('should include external cssClass on the dialog when provided', () => {
      fixture.componentRef.setInput('class', 'my-extra-class');
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.className).toContain('my-extra-class');
    });
  });

  describe('content projection', () => {
    let fixture: ComponentFixture<TestModalHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestModalHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestModalHostComponent);
      fixture.detectChanges();
    });

    it('should project arbitrary content into the dialog body via <ng-content>', () => {
      const projected = fixture.nativeElement.querySelector(
        'dialog .projected-content',
      );

      expect(projected).toBeTruthy();
      expect(projected.textContent.trim()).toBe('projected-body');
    });
  });
});
