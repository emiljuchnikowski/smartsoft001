import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingBaseComponent } from './base/base.component';
import { PageHeadingComponent } from './page-heading.component';
import { PAGE_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-page-heading-injected',
  template: '<div class="injected-page-heading">injected</div>',
})
class MockInjectedComponent extends PageHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: PageHeadingComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<PageHeadingComponent>;
    let component: PageHeadingComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageHeadingComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(PageHeadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-page-heading-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-page-heading-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Hello' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Hello' });
    });
  });

  describe('with PAGE_HEADING_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<PageHeadingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PageHeadingComponent, MockInjectedComponent],
        providers: [
          {
            provide: PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PageHeadingComponent);
      fixture.detectChanges();
    });

    it('should render injected component when PAGE_HEADING_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-page-heading',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-page-heading-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-page-heading-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
