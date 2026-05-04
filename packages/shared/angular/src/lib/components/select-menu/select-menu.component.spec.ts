import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuBaseComponent } from './base/base.component';
import { SelectMenuComponent } from './select-menu.component';
import { SELECT_MENU_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-select-menu-injected',
  template: '<div class="injected-select-menu">injected</div>',
})
class MockInjectedComponent extends SelectMenuBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SelectMenuComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SelectMenuComponent>;
    let component: SelectMenuComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SelectMenuComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-select-menu-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-select-menu-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(component.disabled()).toBe(true);
    });

    it('should propagate options input', () => {
      fixture.componentRef.setInput('options', { placeholder: 'X' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ placeholder: 'X' });
    });
  });

  describe('with SELECT_MENU_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SelectMenuComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SelectMenuComponent, MockInjectedComponent],
        providers: [
          {
            provide: SELECT_MENU_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectMenuComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-select-menu',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-select-menu-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-select-menu-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
