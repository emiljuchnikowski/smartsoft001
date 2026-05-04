import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedLayoutBaseComponent } from './base/base.component';
import { StackedLayoutComponent } from './stacked-layout.component';
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-stacked-layout-injected',
  template: '<div class="injected-stacked-layout">injected</div>',
})
class MockInjectedComponent extends StackedLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: StackedLayoutComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<StackedLayoutComponent>;
    let component: StackedLayoutComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedLayoutComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedLayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-stacked-layout-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stacked-layout-standard',
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

  describe('with STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<StackedLayoutComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StackedLayoutComponent, MockInjectedComponent],
        providers: [
          {
            provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(StackedLayoutComponent);
      fixture.detectChanges();
    });

    it('should render injected component when STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-stacked-layout',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-stacked-layout-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stacked-layout-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
