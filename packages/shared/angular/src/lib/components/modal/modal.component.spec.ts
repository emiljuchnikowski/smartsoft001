import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBaseComponent } from './base/base.component';
import { ModalComponent } from './modal.component';
import { MODAL_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-modal-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="injected-modal">injected</div>',
})
class MockInjectedComponent extends ModalBaseComponent {
  override cssClass = input<string>('');
}

@Component({
  selector: 'smart-test-modal-with-slot',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '@if (open()) { <div class="custom-modal"><ng-content /></div> }',
})
class MockSlotComponent extends ModalBaseComponent {
  override cssClass = input<string>('');
}

const PROJECTION_HOST_TEMPLATE = `
  <smart-modal [open]="true">Projected text</smart-modal>
`;

@Component({
  selector: 'smart-test-modal-standard-host',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: PROJECTION_HOST_TEMPLATE,
})
class StandardHostComponent {}

@Component({
  selector: 'smart-test-modal-host',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: MODAL_STANDARD_COMPONENT_TOKEN, useValue: MockSlotComponent },
  ],
  template: PROJECTION_HOST_TEMPLATE,
})
class InjectedHostComponent {}

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

    describe('outputs of the injected component', () => {
      let injected: MockInjectedComponent;

      beforeEach(async () => {
        await fixture.whenStable();
        injected = fixture.debugElement.query(
          (el) => el.componentInstance instanceof MockInjectedComponent,
        ).componentInstance;
      });

      it('should re-emit actionClick through the wrapper', () => {
        const emitted: unknown[] = [];
        fixture.componentInstance.actionClick.subscribe((event: unknown) =>
          emitted.push(event),
        );

        injected.actionClick.emit({ actionId: 'ok' });

        expect(emitted).toEqual([{ actionId: 'ok' }]);
      });

      it('should re-emit closed through the wrapper', () => {
        let emissions = 0;
        fixture.componentInstance.closed.subscribe(() => emissions++);

        injected.closed.emit();

        expect(emissions).toBe(1);
      });

      it('should write open back to the wrapper model', () => {
        injected.open.set(true);

        expect(fixture.componentInstance.open()).toEqual(true);
      });
    });
  });

  describe('projected content', () => {
    it('should render the projected content inside smart-modal-standard', () => {
      const fixture = TestBed.createComponent(StandardHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector(
        'smart-modal-standard dialog',
      );

      expect(slot?.textContent.trim()).toBe('Projected text');
    });

    it('should render the projected content inside the implementation registered through MODAL_STANDARD_COMPONENT_TOKEN', () => {
      const fixture = TestBed.createComponent(InjectedHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector('div.custom-modal');

      expect(slot?.textContent.trim()).toBe('Projected text');
    });
  });
});
