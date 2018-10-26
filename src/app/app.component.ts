import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  hasTooltip1 = true;
  step1 = 1;
  value1 = 50;
  value2 = [30, 70];

  constructor(private fb: FormBuilder) {}
}
