import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    const startDate = moment();
    this.form = this.fb.group({
      startDate,
    });
  }

}
