import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Step1Component } from './components/step1/step1.component';
import { StepsWrapperComponent } from './components/steps-wrapper/steps-wrapper.component';
import { DemoMaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Step2Component } from './components/step2/step2.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ],
  declarations: [
    AppComponent,
    Step1Component,
    Step2Component,
    StepsWrapperComponent
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
