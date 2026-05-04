import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBaseComponent } from './base/base.component';
import { CalendarComponent } from './calendar.component';
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

@Component({
  selector: 'smart-test-calendar-injected',
  template: '<div class="injected-calendar">injected</div>',
})
class MockInjectedComponent extends CalendarBaseComponent {
  // NgComponentOutlet passes 'cssClass' (not aliased 'class') so declare it explicitly
  override cssClass = input<string>('');
}

describe('@smartsoft001/shared-angular: CalendarComponent', () => {
  describe('without token', () => {
    let fixture: ComponentFixture<CalendarComponent>;
    let component: CalendarComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render smart-calendar-standard by default (no token provided)', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-calendar-standard',
      );

      expect(standard).toBeTruthy();
    });

    it('should propagate cssClass input via class alias', () => {
      fixture.componentRef.setInput('class', 'passed-class');
      fixture.detectChanges();

      expect(component.cssClass()).toBe('passed-class');
    });

    it('should propagate options input', () => {
      fixture.componentRef.setInput('options', { view: 'week' });
      fixture.detectChanges();

      expect(component.options()).toEqual({ view: 'week' });
    });

    it('should propagate events input', () => {
      const events = [
        { id: 1, start: new Date(2026, 0, 15), title: 'Meeting' },
      ];
      fixture.componentRef.setInput('events', events);
      fixture.detectChanges();

      expect(component.events()).toEqual(events);
    });

    it('should propagate value as a model input', () => {
      const date = new Date(2026, 5, 10);
      fixture.componentRef.setInput('value', date);
      fixture.detectChanges();

      expect(component.value()).toEqual(date);
    });

    it('should propagate referenceDate input', () => {
      const refDate = new Date(2027, 3, 1);
      fixture.componentRef.setInput('referenceDate', refDate);
      fixture.detectChanges();

      expect(component.referenceDate()).toEqual(refDate);
    });
  });

  describe('with CALENDAR_STANDARD_COMPONENT_TOKEN', () => {
    let fixture: ComponentFixture<CalendarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CalendarComponent, MockInjectedComponent],
        providers: [
          {
            provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
            useValue: MockInjectedComponent,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarComponent);
      fixture.detectChanges();
    });

    it('should render injected component when CALENDAR_STANDARD_COMPONENT_TOKEN is provided', () => {
      const injected = fixture.nativeElement.querySelector(
        'div.injected-calendar',
      );

      expect(injected).toBeTruthy();
    });

    it('should not render smart-calendar-standard when token is provided', () => {
      const standard = fixture.nativeElement.querySelector(
        'smart-calendar-standard',
      );

      expect(standard).toBeNull();
    });
  });
});
