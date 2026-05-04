import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavigationBaseComponent } from './base/base.component';
import { SidebarNavigationComponent } from './sidebar-navigation.component';
import { SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-sidebar-nav-injected',
  template: '<div class="injected-sidebar-nav">injected</div>',
})
class MockInjectedComponent extends SidebarNavigationBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SidebarNavigationComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SidebarNavigationComponent>;
    let component: SidebarNavigationComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarNavigationComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarNavigationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-sidebar-navigation-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sidebar-navigation-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/class', () => {
      fixture.componentRef.setInput('options', {
        items: [{ id: 'a', label: 'A' }],
      });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()?.items?.length).toBe(1);
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SidebarNavigationComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarNavigationComponent, MockInjectedComponent],
        providers: [
          {
            provide: SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarNavigationComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-sidebar-nav',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-sidebar-navigation-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sidebar-navigation-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
