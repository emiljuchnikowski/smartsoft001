import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeComponent } from './badge.component';
import { BadgeBaseComponent } from './base/base.component';
import { BADGE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-badge-injected',
  template: '<div class="injected-badge">injected</div>',
})
class MockInjectedComponent extends BadgeBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: BadgeComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<BadgeComponent>;
    let component: BadgeComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BadgeComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(BadgeComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('text', 'Badge');
      fixture.detectChanges();
    });

    it('should render smart-badge-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-badge-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate text input to standard component', () => {
      fixture.componentRef.setInput('text', 'Updated');
      fixture.detectChanges();

      expect(component.text()).toBe('Updated');
    });

    it('should propagate color input', () => {
      fixture.componentRef.setInput('color', 'red');
      fixture.detectChanges();

      expect(component.color()).toBe('red');
    });

    it('should propagate size input', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      expect(component.size()).toBe('sm');
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { withDot: true });
      fixture.detectChanges();

      expect(component.options()).toEqual({ withDot: true });
    });
  });

  describe('with BADGE_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<BadgeComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BadgeComponent, MockInjectedComponent],
        providers: [
          {
            provide: BADGE_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BadgeComponent);
      fixture.componentRef.setInput('text', 'Badge');
      fixture.detectChanges();
    });

    it('should render injected component when BADGE_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected =
        fixture.nativeElement.querySelector('div.injected-badge');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-badge-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-badge-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
