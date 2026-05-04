import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavigationBaseComponent } from './base/base.component';
import { VerticalNavigationComponent } from './vertical-navigation.component';
import { VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-vnav-injected',
  template: '<div class="injected-vnav">injected</div>',
})
class MockInjectedComponent extends VerticalNavigationBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: VerticalNavigationComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<VerticalNavigationComponent>;
    let component: VerticalNavigationComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalNavigationComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(VerticalNavigationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-vertical-navigation-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-vertical-navigation-standard',
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

  describe('with VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<VerticalNavigationComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalNavigationComponent, MockInjectedComponent],
        providers: [
          {
            provide: VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(VerticalNavigationComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector('div.injected-vnav');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-vertical-navigation-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-vertical-navigation-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
