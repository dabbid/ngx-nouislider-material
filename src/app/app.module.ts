import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatNouisliderModule } from 'mat-nouislider';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatNouisliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
