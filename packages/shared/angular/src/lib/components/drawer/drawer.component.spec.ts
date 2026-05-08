import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerBaseComponent } from './base/base.component';
import { DrawerComponent } from './drawer.component';
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-drawer-injected',
  template: '<div class="injected-drawer">injected</div>',
})
class MockInjectedComponent extends DrawerBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: DrawerComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<DrawerComponent>;
    let component: DrawerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DrawerComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(DrawerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-drawer-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-drawer-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate open input to standard component', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      expect(component.open()).toBe(true);
    });

    it('should propagate title input to standard component', () => {
      fixture.componentRef.setInput('title', 'Drawer Title');
      fixture.detectChanges();

      expect(component.title()).toBe('Drawer Title');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        position: 'left',
        withOverlay: true,
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({
        position: 'left',
        withOverlay: true,
      });
    });
  });

  describe('with DRAWER_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<DrawerComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DrawerComponent, MockInjectedComponent],
        providers: [
          {
            provide: DRAWER_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DrawerComponent);
      fixture.detectChanges();
    });

    it('should render injected component when DRAWER_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-drawer',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-drawer-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-drawer-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
