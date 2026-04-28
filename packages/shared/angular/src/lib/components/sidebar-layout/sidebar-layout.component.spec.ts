import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutBaseComponent } from './base/base.component';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-sidebar-layout-injected',
  template: '<div class="injected-sidebar-layout">injected</div>',
})
class MockInjectedComponent extends SidebarLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SidebarLayoutComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SidebarLayoutComponent>;
    let component: SidebarLayoutComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarLayoutComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarLayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-sidebar-layout-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sidebar-layout-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Dashboard' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Dashboard' });
    });
  });

  describe('with SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SidebarLayoutComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SidebarLayoutComponent, MockInjectedComponent],
        providers: [
          {
            provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarLayoutComponent);
      fixture.detectChanges();
    });

    it('should render injected component when SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-sidebar-layout',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-sidebar-layout-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-sidebar-layout-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
