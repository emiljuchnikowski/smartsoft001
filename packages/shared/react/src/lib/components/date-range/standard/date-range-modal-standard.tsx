import { Fragment } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartDateRangeModalProps } from '../date-range.types';
import { useDateRangeModal } from '../use-date-range-modal';

function filterButtonClasses(selected: boolean): string {
  return cn(
    'smart:px-3 smart:py-1.5 smart:rounded-full smart:text-sm smart:text-center smart:font-medium smart:cursor-pointer',
    selected
      ? 'smart:bg-indigo-600 smart:text-white'
      : 'smart:bg-gray-100 smart:text-gray-700 smart:dark:bg-gray-800 smart:dark:text-gray-300',
  );
}

/**
 * The date-range picker modal: a scrollable calendar of the months around
 * today. Rendered inline by `<SmartDateRangeStandard>`; it is `fixed`
 * positioned, and a backdrop click or the close button dismisses it.
 */
export function SmartDateRangeModalStandard(props: SmartDateRangeModalProps) {
  const { showFilterBtns = false, restrictSelectionTo = 0 } = props;
  const t = useTranslate();
  const {
    elementRef,
    calendar,
    dateForm,
    selectedButtonName,
    isSelectionInRestrictedRange,
    selectToday,
    selectYesterday,
    selectLastSevenDays,
    selectLastThirtyDays,
    selectThisMonth,
    selectLastMonth,
    onDayClick,
    isInRange,
    isSelectionStart,
    isSelectionEnd,
    isStartAndEndDateSame,
    dismissPage,
    applyDates,
  } = useDateRangeModal(props);

  return (
    <>
      <div
        className="smart:fixed smart:inset-0 smart:bg-black/50 smart:z-40"
        onClick={dismissPage}
      />
      <div
        ref={elementRef}
        className="smart:fixed smart:inset-x-4 smart:top-16 smart:bottom-4 smart:z-50 smart:rounded-xl smart:bg-white smart:shadow-xl smart:flex smart:flex-col smart:dark:bg-gray-900"
      >
        <div className="smart:flex smart:items-center smart:justify-between smart:px-4 smart:py-3 smart:border-b smart:border-gray-200 smart:dark:border-gray-700">
          <span className="smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
            {dateForm.dateFrom
              ? dateForm.dateFrom + ' - ' + dateForm.dateTo
              : ''}
          </span>
          <button
            type="button"
            className="smart:text-gray-400 smart:hover:text-gray-600 smart:p-1 smart:rounded smart:dark:text-gray-500 smart:dark:hover:text-gray-300"
            onClick={dismissPage}
          >
            <svg
              className="smart:size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {showFilterBtns && (
          <div className="smart:grid smart:grid-rows-2 smart:grid-cols-3 smart:w-full smart:mx-auto smart:gap-x-2.5 smart:gap-y-2 smart:p-4">
            <button
              type="button"
              onClick={selectToday}
              className={filterButtonClasses(selectedButtonName === 'Today')}
            >
              {t('CALENDAR.Today')}
            </button>

            <button
              type="button"
              onClick={selectLastSevenDays}
              className={filterButtonClasses(
                selectedButtonName === 'LastSevenDays',
              )}
            >
              {t('CALENDAR.LastSevenDays')}
            </button>

            <button
              type="button"
              onClick={selectThisMonth}
              className={filterButtonClasses(
                selectedButtonName === 'ThisMonth',
              )}
            >
              {t('CALENDAR.ThisMonth')}
            </button>

            <button
              type="button"
              onClick={selectYesterday}
              className={filterButtonClasses(
                selectedButtonName === 'Yesterday',
              )}
            >
              {t('CALENDAR.Yesterday')}
            </button>

            <button
              type="button"
              onClick={selectLastThirtyDays}
              className={filterButtonClasses(
                selectedButtonName === 'LastThirtyDays',
              )}
            >
              {t('CALENDAR.LastThirtyDays')}
            </button>

            <button
              type="button"
              onClick={selectLastMonth}
              className={filterButtonClasses(
                selectedButtonName === 'LastMonth',
              )}
            >
              {t('CALENDAR.LastMonth')}
            </button>
          </div>
        )}

        <div className="smart:grid smart:grid-cols-7 smart:gap-y-2.5 smart:gap-x-px smart:items-center smart:border-b smart:border-gray-200 smart:h-8 smart:text-center smart:text-xs smart:text-gray-500 smart:bg-gray-50 smart:dark:bg-gray-800 smart:dark:border-gray-700 smart:dark:text-gray-400">
          <div>{t('CALENDAR.DAY_OF_WEEK.Sun')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Mon')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Tue')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Wed')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Thu')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Fri')}</div>
          <div>{t('CALENDAR.DAY_OF_WEEK.Sat')}</div>
        </div>

        <div className="smart:flex-1 smart:overflow-y-auto">
          {calendar.map((month) => (
            <Fragment key={month.year + '-' + month.number}>
              <p className="smart:ml-0 smart:px-4 smart:py-3 smart:text-sm smart:font-medium smart:bg-gray-50 smart:border-t smart:border-b smart:border-gray-200 smart:dark:bg-gray-800 smart:dark:border-gray-700 smart:dark:text-gray-300">
                {t('CALENDAR.MONTH.' + month.monthName)} {month.year}
              </p>
              <div className="smart:grid smart:grid-cols-7 smart:gap-y-1 smart:gap-x-px smart:items-center smart:px-1">
                {month.dates.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      'smart:h-8 smart:text-center smart:flex smart:flex-col smart:justify-center smart:items-center smart:text-sm smart:text-gray-600 smart:cursor-pointer smart:hover:bg-gray-100 smart:dark:text-gray-400 smart:dark:hover:bg-gray-800',
                      isSelectionStart(day) &&
                        'smart:bg-indigo-600 smart:text-white smart:rounded-l-lg smart:hover:bg-indigo-700',
                      isSelectionEnd(day) &&
                        'smart:bg-indigo-600 smart:text-white smart:rounded-r-lg smart:hover:bg-indigo-700',
                      isInRange(day) &&
                        'smart:bg-indigo-100 smart:dark:bg-indigo-900/30',
                      isStartAndEndDateSame() && 'smart:rounded-lg',
                    )}
                    onClick={() => onDayClick(day)}
                  >
                    {day?.date()}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>

        <div className="smart:border-t smart:border-gray-200 smart:p-4 smart:dark:border-gray-700">
          <button
            type="button"
            className="smart:w-full smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:text-white smart:shadow-xs smart:hover:bg-indigo-500 smart:focus-visible:outline-2 smart:focus-visible:outline-offset-2 smart:focus-visible:outline-indigo-600 smart:dark:bg-indigo-500 smart:dark:hover:bg-indigo-400"
            disabled={!!restrictSelectionTo && !isSelectionInRestrictedRange()}
            onClick={applyDates}
          >
            {t('select')}
          </button>
        </div>
      </div>
    </>
  );
}
