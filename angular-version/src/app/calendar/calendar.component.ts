import {
  Component,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { EntryCalendar } from '../interfaces/entry-calendar.interface';
// import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements AfterViewInit {
  @Input() dataStream$: Subject<EntryCalendar>;
  calendarData: any[] = [];
  calendars: any[] = [];
  holidays = [
    'May 29',
    'June 14',
    'July 4',
    'September 4',
    'September 11',
    'October 31',
    'November 11',
    'November 23',
    'December 25',
    'December 31'
  ];

  constructor() {}

  ngAfterViewInit() {
    this.dataStream$.subscribe((data: EntryCalendar) => {
      this.buildCalendar(data);
    });
  }

  buildCalendar(entryData: EntryCalendar) {
    const calendarData: any = {};
    const date = entryData.startDate;
    let current = date.clone();
    const end = date.clone().add(entryData.daysNumber, 'days');
    let incrementDay = 0;
    const start = date.clone();
    const formatKey = 'MMMM YYYY';

    // calculate all days for the calendars
    let lastMonth = current.clone();
    let lastPrintedDate = current.clone();
    while (current.toDate().getTime() < end.toDate().getTime()) {
      if (lastMonth.format(formatKey) !== current.format(formatKey)) {
        // complete the last disabled days in the month
        for (let i = lastMonth.clone().endOf('month').day(); i < 6; i++) {
          const lastWeekDay = (calendarData[lastMonth.format(formatKey)][calendarData[lastMonth.format(formatKey)].length - 1].weekDay);
          calendarData[lastMonth.format(formatKey)].push({
            disabled: true,
            dayNumber: '',
            isHoliday: false,
            weekDay: lastWeekDay + 1
          });
        }
        lastMonth = current.clone();
      }
      // initial days disabled
      if (!(current.format(formatKey) in calendarData)) {
        calendarData[current.format(formatKey)] = [];
        for (let i = 0; i < current.day(); i++) {
          calendarData[current.format(formatKey)].push({
            disabled: true,
            dayNumber: '',
            isHoliday: false,
            weekDay: current.clone().day() - current.clone().subtract(i, 'days').day()
          });
        }
      }
      // regular days
      calendarData[current.format(formatKey)].push({
        disabled: false,
        dayNumber: current.format('D'),
        isHoliday: this.isHoliday(current.format(formatKey), current.format('D')),
        weekDay: current.day()
      });
      lastPrintedDate = current;
      incrementDay++;
      current = start.clone().add(incrementDay, 'days');
    }
    // end of month control for disabled days
    if (lastPrintedDate.day() < 6) {
      for (let i = lastPrintedDate.day(); i < 6; i++) {
        const lastWeekDay =
          calendarData[lastPrintedDate.format(formatKey)][calendarData[lastPrintedDate.format(formatKey)].length - 1].weekDay;
        calendarData[lastPrintedDate.format(formatKey)].push({
          disabled: true,
          dayNumber: '',
          isHoliday: false,
          weekDay: lastWeekDay + 1
        });
      }
    }

    this.calendars = Object.keys(calendarData);
    this.calendarData = calendarData;
  }

  isHoliday(monthYear: string, dayNumber: any) {
    const month = monthYear.split(' ')[0].trim();
    if (this.holidays.includes(`${month} ${dayNumber}`)) {
      return true;
    } else {
      return false;
    }
  }

}
