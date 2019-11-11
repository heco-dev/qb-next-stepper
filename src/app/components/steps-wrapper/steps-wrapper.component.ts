import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-steps-wrapper',
  templateUrl: './steps-wrapper.component.html',
  styleUrls: ['./steps-wrapper.component.css']
})
export class StepsWrapperComponent implements OnInit {

  smallScreen: boolean;
  isLinear = false;

  secondFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {
    this.firstFormGroup = this._formBuilder.group({});

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });
  }

  setFirstFormGroup(fg: FormGroup) {
    this.firstFormGroup = fg;
  }

  ngOnInit() {

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
