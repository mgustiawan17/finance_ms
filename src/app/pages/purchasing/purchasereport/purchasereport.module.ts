import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PurchaseReportComponent } from './purchasereport.component';
// import DataTable from 'datatables.net-dt';

//module NGX-Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

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
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [PurchaseReportComponent],
  imports: [
    CommonModule,
    FormsModule, 
    InlineSVGModule,
    NgbTooltipModule,
    NgxDaterangepickerMd,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: PurchaseReportComponent,
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
    TableModule,
    ToolbarModule,
    MessagesModule
  ],
})
export class PurchaseReportModule {}
