import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { EntryCalendar } from './interfaces/entry-calendar.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  form: FormGroup;
  dataStream$ = new Subject<EntryCalendar>();

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar) {
    const startDate = moment();
    this.form = this.fb.group({
      startDate: [startDate, Validators.required],
      daysNumber: [0, [Validators.required, Validators.min(0)]],
      countryCode: ['', Validators.required]
    });
  }

  renderCalendar() {
    if (!this.form.valid) {
      this.snackbar.open('The input data is incorrect', 'Close');
      return;
    }
    this.dataStream$.next(this.form.value);
  }
}
