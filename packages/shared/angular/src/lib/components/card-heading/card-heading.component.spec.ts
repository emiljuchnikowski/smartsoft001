import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeadingBaseComponent } from './base/base.component';
import { CardHeadingComponent } from './card-heading.component';
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-card-heading-injected',
  template: '<div class="injected-card-heading">injected</div>',
})
class MockInjectedComponent extends CardHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: CardHeadingComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<CardHeadingComponent>;
    let component: CardHeadingComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeadingComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeadingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-card-heading-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-card-heading-standard',
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

  describe('with CARD_HEADING_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<CardHeadingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardHeadingComponent, MockInjectedComponent],
        providers: [
          {
            provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CardHeadingComponent);
      fixture.detectChanges();
    });

    it('should render injected component when CARD_HEADING_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-card-heading',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-card-heading-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-card-heading-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
