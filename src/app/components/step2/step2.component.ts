import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {

  formGroup: FormGroup;
  @Output() formGroupOut = new EventEmitter<FormGroup>();

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.formGroup = this._formBuilder.group({
      stepLabel: 'Distributor',
      secondCtrl: ['', Validators.required]
    });

    this.formGroupOut.emit(this.formGroup);
  }

}
