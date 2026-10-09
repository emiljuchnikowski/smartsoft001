import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutBaseComponent } from './base/base.component';
import { SidebarLayoutComponent } from './sidebar-layout.component';
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-sidebar-layout-injected',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="injected-sidebar-layout">injected</div>',
})
class MockInjectedComponent extends SidebarLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

@Component({
  selector: 'smart-test-sidebar-layout-with-slot',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<main class="custom-sidebar-layout"><ng-content /></main>',
})
class MockSlotComponent extends SidebarLayoutBaseComponent {
  override cssClass = input<string>('');
}

const PROJECTION_HOST_TEMPLATE = `
  <smart-sidebar-layout>Projected text</smart-sidebar-layout>
`;

@Component({
  selector: 'smart-test-sidebar-layout-standard-host',
  imports: [SidebarLayoutComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: PROJECTION_HOST_TEMPLATE,
})
class StandardHostComponent {}

@Component({
  selector: 'smart-test-sidebar-layout-host',
  imports: [SidebarLayoutComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
      useValue: MockSlotComponent,
    },
  ],
  template: PROJECTION_HOST_TEMPLATE,
})
class InjectedHostComponent {}

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

  describe('projected content', () => {
    it('should render the projected content inside smart-sidebar-layout-standard', () => {
      const fixture = TestBed.createComponent(StandardHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector(
        'smart-sidebar-layout-standard main',
      );

      expect(slot?.textContent.trim()).toBe('Projected text');
    });

    it('should render the projected content inside the implementation registered through SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN', () => {
      const fixture = TestBed.createComponent(InjectedHostComponent);
      fixture.detectChanges();

      const slot = fixture.nativeElement.querySelector(
        'main.custom-sidebar-layout',
      );

      expect(slot?.textContent.trim()).toBe('Projected text');
    });
  });
});
