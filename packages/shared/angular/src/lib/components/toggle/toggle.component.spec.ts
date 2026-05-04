import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleBaseComponent } from './base/base.component';
import { ToggleComponent } from './toggle.component';
import { TOGGLE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-toggle-injected',
  template: '<div class="injected-toggle">injected</div>',
})
class MockInjectedComponent extends ToggleBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ToggleComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ToggleComponent>;
    let component: ToggleComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ToggleComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ToggleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-toggle-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-toggle-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate value input to standard component', () => {
      fixture.componentRef.setInput('value', true);
      fixture.detectChanges();

      expect(component.value()).toBe(true);
    });

    it('should propagate disabled input to standard component', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { label: 'my-toggle' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ label: 'my-toggle' });
    });
  });

  describe('with TOGGLE_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ToggleComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ToggleComponent, MockInjectedComponent],
        providers: [
          {
            provide: TOGGLE_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ToggleComponent);
      fixture.detectChanges();
    });

    it('should render injected component when TOGGLE_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-toggle',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-toggle-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-toggle-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
