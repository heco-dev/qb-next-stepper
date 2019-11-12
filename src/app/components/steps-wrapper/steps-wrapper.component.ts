import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-steps-wrapper',
  templateUrl: './steps-wrapper.component.html',
  styleUrls: ['./steps-wrapper.component.css']
})
export class StepsWrapperComponent implements OnInit {

  smallScreen: boolean;
  isLinear = false;

  formGroup2: FormGroup;
  formGroup1: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {
    
    this.formGroup1 = this._formBuilder.group({});
    this.formGroup2 = this._formBuilder.group({});

    this.loadVertialOrHorizontalStepper();

  }

  loadVertialOrHorizontalStepper() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).pipe(
      take(1)
    )
      .subscribe(result => {
        this.smallScreen = result.matches;
      });
  }

  setFormGroup(fg: FormGroup, id: number) {

    if (id === 1) {
      this.formGroup1 = fg;
    }

    if (id === 2) {
      this.formGroup2 = fg;
    }

  }

  ngOnInit() {

  }
}
