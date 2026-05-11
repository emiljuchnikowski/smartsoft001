import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupBaseComponent } from './base/base.component';
import { ButtonGroupComponent } from './button-group.component';
import { BUTTON_GROUP_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-button-group-injected',
  template: '<div class="injected-button-group">injected</div>',
})
class MockInjectedComponent extends ButtonGroupBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: ButtonGroupComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<ButtonGroupComponent>;
    let component: ButtonGroupComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonGroupComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonGroupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-button-group-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-button-group-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate buttons input to standard component', () => {
      const buttons = [{ id: 'a', label: 'Alpha' }];
      fixture.componentRef.setInput('buttons', buttons);
      fixture.detectChanges();

      expect(component.buttons()).toEqual(buttons);
    });

    it('should propagate selected model to standard component', () => {
      fixture.componentRef.setInput('selected', 'a');
      fixture.detectChanges();

      expect(component.selected()).toBe('a');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { variant: 'basic' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ variant: 'basic' });
    });

    it('should forward buttonClick output from standard component', () => {
      const spy = jest.fn();
      component.buttonClick.subscribe(spy);

      const standard = fixture.debugElement.children[0].componentInstance;
      standard.buttonClick.emit({ buttonId: 'x' });

      expect(spy).toHaveBeenCalledWith({ buttonId: 'x' });
    });
  });

  describe('with BUTTON_GROUP_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<ButtonGroupComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonGroupComponent, MockInjectedComponent],
        providers: [
          {
            provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonGroupComponent);
      fixture.detectChanges();
    });

    it('should render injected component when BUTTON_GROUP_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-button-group',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-button-group-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-button-group-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
