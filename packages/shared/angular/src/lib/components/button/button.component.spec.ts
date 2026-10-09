import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { IButtonOptions } from '../../models';
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { ButtonBaseComponent } from './base/base.component';

@Component({
  selector: 'smart-test-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<button class="injected">injected</button>',
})
class MockInjectedComponent extends ButtonBaseComponent {}

@Component({
  selector: 'smart-test-button-with-slot',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<button class="custom-button"><ng-content /></button>',
})
class MockSlotComponent extends ButtonBaseComponent {}

const HOST_TEMPLATE = `
  <smart-button [options]="options">Projected label</smart-button>
`;

@Component({
  selector: 'smart-test-button-standard-host',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: HOST_TEMPLATE,
})
class StandardHostComponent {
  options: IButtonOptions = { click: jest.fn() };
}

@Component({
  selector: 'smart-test-button-host',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: BUTTON_STANDARD_COMPONENT_TOKEN, useValue: MockSlotComponent },
  ],
  template: HOST_TEMPLATE,
})
class InjectedHostComponent extends StandardHostComponent {}

describe('@smartsoft001/shared-angular: ButtonComponent', () => {
  const defaultOptions: IButtonOptions = { click: jest.fn() };

  describe('without token', () => {
    let fixture: ComponentFixture<ButtonComponent>;
    let component: ButtonComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonComponent],
      })
        .overrideComponent(ButtonComponent, {
          remove: { imports: [] },
        })
        .compileComponents();

      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('options', defaultOptions);
      fixture.detectChanges();
    });

    it('should render smart-button-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-button-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should render a button element through standard component', () => {
      const button = fixture.nativeElement.querySelector('button');

      expect(button).toBeTruthy();
    });

    it('should pass options to standard component', () => {
      const opts: IButtonOptions = { click: jest.fn(), size: 'lg' };
      fixture.componentRef.setInput('options', opts);
      fixture.detectChanges();

      expect(component.options()).toEqual(opts);
    });

    it('should pass disabled to standard component', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
    });

    it('should pass cssClass to standard component', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });
  });

  describe('with BUTTON_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonComponent, MockInjectedComponent],
        providers: [
          {
            provide: BUTTON_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonComponent);
      fixture.componentRef.setInput('options', defaultOptions);
      fixture.detectChanges();
    });

    it('should render injected component when BUTTON_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('button.injected');

      expect(injected).toBeTruthy();
    });
  });

  describe('projected content', () => {
    it('should render the projected content inside smart-button-standard', () => {
      const fixture = TestBed.createComponent(StandardHostComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'smart-button-standard button',
      );

      expect(button?.textContent.trim()).toBe('Projected label');
    });

    it('should render the projected content inside the implementation registered through BUTTON_STANDARD_COMPONENT_TOKEN', () => {
      const fixture = TestBed.createComponent(InjectedHostComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button.custom-button',
      );

      expect(button?.textContent.trim()).toBe('Projected label');
    });
  });
});
