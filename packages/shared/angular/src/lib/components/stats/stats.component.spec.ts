import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBaseComponent } from './base/base.component';
import { StatsComponent } from './stats.component';
import { STATS_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-stats-injected',
  template: '<div class="injected-stats">injected</div>',
})
class MockInjectedComponent extends StatsBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: StatsComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<StatsComponent>;
    let component: StatsComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StatsComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(StatsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-stats-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stats-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input to standard component', () => {
      fixture.componentRef.setInput('options', {
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
      fixture.detectChanges();

      expect(component.options()).toEqual({
        items: [{ label: 'Revenue', value: '$405,091' }],
      });
    });
  });

  describe('with STATS_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<StatsComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StatsComponent, MockInjectedComponent],
        providers: [
          {
            provide: STATS_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(StatsComponent);
      fixture.detectChanges();
    });

    it('should render injected component when STATS_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected =
        fixture.nativeElement.querySelector('div.injected-stats');

      expect(injected).toBeTruthy();
    });

    it('should not render smart-stats-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-stats-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
