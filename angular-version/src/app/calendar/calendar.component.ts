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

    // calculate all days for the calendars
    while (current.toDate().getTime() <= end.toDate().getTime()) {
      if (!(current.format('YYYY-MMMM') in calendarData)) {
        calendarData[current.format('YYYY-MMMM')] = [];
        for (let i = 0; i < current.day(); i++) {
          calendarData[current.format('YYYY-MMMM')].push({
            disabled: true,
            dayNumber: '',
            month: current.clone().add(i, 'days').format('M'),
            isWeekend: [0, 6].indexOf(current.clone().add(i, 'days').day()) >= 0 ? true : false
          });
        }
      }
      calendarData[current.format('YYYY-MMMM')].push({
        disabled: false,
        dayNumber: current.format('D'),
        month: current.format('M'),
        isWeekend: [0, 6].indexOf(current.day()) >= 0 ? true : false
      });
      incrementDay++;
      current = start.clone().add(incrementDay, 'days');
    }

    this.calendars = Object.keys(calendarData);
    this.calendarData = calendarData;
  }
}
