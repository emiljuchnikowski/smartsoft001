import { CalendarService } from './calendar.service';

describe('@smartsoft001/react: CalendarService', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('initCalendar', () => {
    it('should start the calendar two years before the current month when both moment() calls share a millisecond', () => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 9, 8, 12, 0, 0, 0));

      const calendar = new CalendarService().getCalendar();

      expect(calendar[0].year).toBe('2024');
      expect(calendar[0].number).toBe('10');
    });

    it('should start the calendar two years before the current month on the last day of a month', () => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 2, 31, 12, 0, 0, 0));

      const calendar = new CalendarService().getCalendar();

      expect(calendar[0].year).toBe('2024');
      expect(calendar[0].number).toBe('03');
    });

    it('should start the calendar two years before the current month when moment() calls are milliseconds apart', () => {
      const now = new Date(2026, 9, 8, 12, 0, 0, 0).getTime();
      jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(now)
        .mockReturnValue(now + 3);

      const calendar = new CalendarService().getCalendar();

      expect(calendar[0].year).toBe('2024');
      expect(calendar[0].number).toBe('10');
    });
  });
});
