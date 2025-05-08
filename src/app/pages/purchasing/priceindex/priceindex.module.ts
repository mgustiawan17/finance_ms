import { NgModule } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PriceIndexComponent } from './priceindex.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, RouteConfigLoadStart } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

//module PrimeNG
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup'
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@NgModule({
  declarations: [PriceIndexComponent],
  imports: [
    CommonModule,
    FormsModule, 
    InlineSVGModule,
    NgbTooltipModule,
    NgxDaterangepickerMd,
    NgxSpinnerModule,
    DataTablesModule,
    MultiSelectModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PriceIndexComponent,
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
    ToastModule,
    DialogModule,
    ChartModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
})
export class PriceIndexModule {}
