import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { OutStandingPRComponent } from './outstandingpr.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatDatepickerModule } from '@angular/material/datepicker';


//module PrimeNG
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup'
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [OutStandingPRComponent],
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
        component: OutStandingPRComponent,
      },
    ]),
    RadioButtonModule,
    SelectButtonModule,
    CalendarModule,
    ButtonModule,
    ButtonGroupModule,
    ToggleButtonModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    ToastModule
  ],
})
export class OutStandingPRModule {}
