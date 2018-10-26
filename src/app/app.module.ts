import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatNouisliderModule } from 'mat-nouislider';
import { MatNouisliderModule } from '../../projects/mat-nouislider/src/public_api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatNouisliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
