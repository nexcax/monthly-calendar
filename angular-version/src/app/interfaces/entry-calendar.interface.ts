import * as moment from 'moment';

export interface EntryCalendar {
  startDate: moment.Moment;
  daysNumber: number;
  countryCode: string;
}
