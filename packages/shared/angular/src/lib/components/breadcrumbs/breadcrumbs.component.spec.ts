import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsBaseComponent } from './base/base.component';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BREADCRUMBS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-breadcrumbs-injected',
  template: '<div class="injected-breadcrumbs">injected</div>',
})
class MockInjectedComponent extends BreadcrumbsBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: BreadcrumbsComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<BreadcrumbsComponent>;
    let component: BreadcrumbsComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BreadcrumbsComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(BreadcrumbsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-breadcrumbs-standard by default', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-breadcrumbs-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate options/class', () => {
      fixture.componentRef.setInput('options', {
        items: [{ id: 'a', label: 'A', href: '/' }],
      });
      fixture.componentRef.setInput('class', 'wrap');
      fixture.detectChanges();

      expect(component.options()?.items.length).toBe(1);
      expect(component.cssClass()).toBe('wrap');
    });
  });

  describe('with BREADCRUMBS_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<BreadcrumbsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BreadcrumbsComponent, MockInjectedComponent],
        providers: [
          {
            provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BreadcrumbsComponent);
      fixture.detectChanges();
    });

    it('should render injected component when token provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-breadcrumbs',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-breadcrumbs-standard when token provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-breadcrumbs-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
