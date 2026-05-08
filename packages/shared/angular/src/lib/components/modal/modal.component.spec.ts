import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBaseComponent } from './base/base.component';
import { ModalComponent } from './modal.component';
import { MODAL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-modal-injected',
  template: '<div class="injected-modal">injected</div>',
})
class MockInjectedComponent extends ModalBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ModalComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ModalComponent>;
    let component: ModalComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ModalComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-modal-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-modal-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate open via model', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(component.open()).toBe(true);
    });

    it('should propagate title input', () => {
      fixture.componentRef.setInput('title', 'Confirm');
      fixture.detectChanges();

      expect(component.title()).toBe('Confirm');
    });

    it('should propagate description input', () => {
      fixture.componentRef.setInput('description', 'Are you sure?');
      fixture.detectChanges();

      expect(component.description()).toBe('Are you sure?');
    });

    it('should propagate actions input', () => {
      fixture.componentRef.setInput('actions', [{ id: 'a', label: 'A' }]);
      fixture.detectChanges();

      expect(component.actions()).toEqual([{ id: 'a', label: 'A' }]);
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input', () => {
      fixture.componentRef.setInput('options', { variant: 'centered' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ variant: 'centered' });
    });
  });

  describe('with MODAL_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ModalComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ModalComponent, MockInjectedComponent],
        providers: [
          {
            provide: MODAL_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token is provided', () => {
      const injected =
        fixture.nativeElement.querySelector('div.injected-modal');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-modal-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-modal-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
