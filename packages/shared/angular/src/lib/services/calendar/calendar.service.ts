import { Injectable } from '@angular/core';
import * as moment from 'moment';

// tslint:disable-next-line:class-name
export interface month {
    dates: moment.Moment[];
    number: string;
    monthName: string;
    year: string;
}

// tslint:disable-next-line:class-name
interface state {
    date: moment.Moment;
    calendar: month[];
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
    state: state;

    constructor() {
        this.state = {
            date: moment().add(2, 'year'),
            calendar: [
                {
                    dates: null,
                    monthName: null,
                    number: null,
                    year: null
                }
            ]
        };
        this.initCalendar();
    }

    setState = (nextState: Partial<state>) => {
        this.state = { ...this.state, ...nextState };
    }

    getCalendar() {
        return [...this.state.calendar];
    }

    generatePrevMonths(): void {
        const calendar = this.state.calendar;

        let date = moment(calendar[0].year + '-' + calendar[0].number + '-01');
        const dateYearAgo = date.clone().subtract(1, 'year');

        while (date.isSameOrAfter(dateYearAgo)) {
            date = date.clone().subtract(1, 'month')
            calendar.unshift(this.generateMonth(date));
        }
    }

    public generateNextMonths(): void {
        const calendar = this.state.calendar;

        const dateString = calendar[calendar.length - 1].year + '-' + calendar[calendar.length - 1].number + '-01';
        let date = moment(dateString);
        const dateYearNext = date.clone().add(1, 'year');

        while (date.isSameOrBefore(dateYearNext)) {
            date = date.clone().add(1, 'month')
            calendar.push(this.generateMonth(date));
        }
    }

    private initCalendar(): void {
        const { date } = this.state;
        const firstMonth = this.generateMonth(date);
        const calendar = [firstMonth];
        const currentDate = moment().clone();
        const dateYearAgo = currentDate.clone().subtract(2, 'year');
        while (date.isSameOrAfter(dateYearAgo)) { // creating one year calendar
            calendar.unshift(this.previousMonth());
        }

        this.state.date = moment();

        const currentMonthIndex = calendar.length - 13;
        calendar[currentMonthIndex].dates = calendar[currentMonthIndex].dates.filter(this.filterFutureDates);
        this.setState({ calendar: calendar });
    }

    private previousMonth(): month {
        const { date } = this.state;
        const newDate = date.subtract(1, 'month');
        const m = this.generateMonth(newDate);
        this.setState({ date: newDate });
        return m;
    }


    private filterFutureDates(date: moment.Moment) {
        if (!date) {
            return true;
        }
        return date.isSameOrBefore(moment());
    }

    private generateMonth(date: moment.Moment): month {
        const firstDay = moment(date).startOf('month');
        const monthName = moment(date).format('MMMM');
        const year = moment(date).format('YYYY');
        const number = moment(date).format('MM');
        const monthLength = date.daysInMonth();
        const totalDatesInMonth = this.generateMonthDates(firstDay, monthLength);
        const emptyCellsBeforeFirstDay = Array(firstDay.weekday()).fill(null);
        const dates = [...emptyCellsBeforeFirstDay, ...totalDatesInMonth];
        return {
            dates,
            monthName,
            number,
            year
        };
    }

    private generateMonthDates(firstDay: moment.Moment, length: number): moment.Moment[] {
        return Array(length).fill(null).map((v, i) => moment(firstDay).add(i, 'day'));
    }
}
