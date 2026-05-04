import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBaseComponent } from './base/base.component';
import { FeedComponent } from './feed.component';
import { FEED_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-feed-injected',
  template: '<div class="injected-feed">injected</div>',
})
class MockInjectedComponent extends FeedBaseComponent {
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: FeedComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<FeedComponent>;
    let component: FeedComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FeedComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FeedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-feed-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-feed-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', { title: 'Activity' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ title: 'Activity' });
    });
  });

  describe('with FEED_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<FeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FeedComponent, MockInjectedComponent],
        providers: [
          {
            provide: FEED_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FeedComponent);
      fixture.detectChanges();
    });

    it('should render injected component when FEED_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector('div.injected-feed');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-feed-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-feed-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
