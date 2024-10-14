import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Pr1Component } from './pr1.component';

@NgModule({
  declarations: [Pr1Component],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    // NgxDaterangepickerMd,
    // BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: Pr1Component,
      },
    ]),
  ],
})
export class PR1Module {}
