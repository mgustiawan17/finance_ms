import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PurchaseAnalysisComponent } from './purchaseanalysis.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [PurchaseAnalysisComponent],
  imports: [
    CommonModule,
    FormsModule, 
    InlineSVGModule,
    NgbTooltipModule,
    NgxDaterangepickerMd,
    MatDatepickerModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PurchaseAnalysisComponent,
      },
    ]),
  ],
})
export class PurchaseAnalysisModule {}
