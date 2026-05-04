import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeadingBaseComponent } from './base/base.component';
import { SectionHeadingComponent } from './section-heading.component';
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-section-heading-injected',
  template: '<div class="injected-section-heading">injected</div>',
})
class MockInjectedComponent extends SectionHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: SectionHeadingComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<SectionHeadingComponent>;
    let component: SectionHeadingComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-section-heading-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-section-heading-standard',
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

  describe('with SECTION_HEADING_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<SectionHeadingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingComponent, MockInjectedComponent],
        providers: [
          {
            provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingComponent);
      fixture.detectChanges();
    });

    it('should render injected component when SECTION_HEADING_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-section-heading',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-section-heading-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-section-heading-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
