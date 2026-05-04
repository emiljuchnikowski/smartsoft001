import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar.component';
import { NAVBAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-navbar-injected',
  template: '<div class="injected-navbar">injected</div>',
})
class MockInjectedComponent extends NavbarBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: NavbarComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-navbar-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-navbar-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/class', () => {
      fixture.componentRef.setInput('options', { logoAlt: 'Acme' });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()).toEqual({ logoAlt: 'Acme' });
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with NAVBAR_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NavbarComponent, MockInjectedComponent],
        providers: [
          {
            provide: NAVBAR_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-navbar',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-navbar-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-navbar-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
