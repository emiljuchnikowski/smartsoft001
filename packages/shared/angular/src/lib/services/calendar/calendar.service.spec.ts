import { TestBed } from '@angular/core/testing';
import moment from 'moment';

import { CalendarService } from './calendar.service';

describe('angular: CalendarService', () => {
  let calendarService: CalendarService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [CalendarService],
    });

    calendarService = TestBed.inject(CalendarService);
  });

  it('should be created', () => {
    expect(calendarService).toBeTruthy();
  });

  it('should initialize state', () => {
    const calendar = calendarService.getCalendar();
    expect(Array.isArray(calendar)).toBe(true);
  });

  describe('setState', () => {
    it('overwrites part of the state', () => {
      const newDate = moment('2020-01-01');
      calendarService.setState({ date: newDate });
      expect(calendarService.state.date).toBe(newDate);
    });

    it('does not lose other state properties', () => {
      const prevCalendar = calendarService.state.calendar;
      calendarService.setState({ date: moment('2020-01-01') });
      expect(calendarService.state.calendar).toBe(prevCalendar);
    });
  });

  describe('getCalendar', () => {
    it('returns a copy of the calendar array', () => {
      const cal = calendarService.getCalendar();
      cal.push({ dates: [], monthName: 'Test', number: '01', year: '2020' });
      expect(calendarService.state.calendar.length).not.toBe(cal.length);
    });

    it('returns an array of months', () => {
      const cal = calendarService.getCalendar();
      expect(cal.every((m) => typeof m.monthName === 'string')).toBe(true);
    });
  });

  describe('generatePrevMonths', () => {
    it('adds months before the current range', () => {
      const prevLength = calendarService.state.calendar.length;
      calendarService.generatePrevMonths();
      expect(calendarService.state.calendar.length).toBeGreaterThan(prevLength);
    });
  });

  describe('generateNextMonths', () => {
    it('adds months after the current range', () => {
      const prevLength = calendarService.state.calendar.length;
      calendarService.generateNextMonths();
      expect(calendarService.state.calendar.length).toBeGreaterThan(prevLength);
    });
  });

  describe('initCalendar', () => {
    it('initializes calendar with correct data', () => {
      calendarService['initCalendar']();
      expect(Array.isArray(calendarService.state.calendar)).toBe(true);
    });
  });

  describe('filterFutureDates', () => {
    it('passes non-future dates', () => {
      const today = moment();
      expect(calendarService['filterFutureDates'](today)).toBe(true);
    });

    it('filters out future dates', () => {
      const future = moment().add(1, 'day');
      expect(calendarService['filterFutureDates'](future)).toBe(false);
    });

    it('passes null', () => {
      expect(calendarService['filterFutureDates'](null as any)).toBe(true);
    });
  });

  describe('generateMonth', () => {
    it('generates a month with correct properties', () => {
      const date = moment('2020-01-01');
      const m = calendarService['generateMonth'](date);
      expect(m.monthName).toBe('January');
    });

    it('generates correct number of days in month', () => {
      const date = moment('2020-02-01');
      const m = calendarService['generateMonth'](date);
      // February 2020 had 29 days
      expect(m.dates.filter((d) => d instanceof moment).length).toBe(29);
    });
  });
});
