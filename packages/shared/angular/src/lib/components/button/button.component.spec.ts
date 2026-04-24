import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IButtonOptions } from '../../models';
import { BUTTON_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { ButtonBaseComponent } from './base/base.component';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'smart-test-injected',
  template: '<button class="injected">injected</button>',
})
class MockInjectedComponent extends ButtonBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

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
});
