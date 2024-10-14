import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecurityManagementComponent } from './secum.component';
import { WidgetsModule } from '../../../_metronic/partials/content/widgets/widgets.module';
import { FormsModule } from '@angular/forms';

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
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [SecurityManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SecurityManagementComponent,
      },
    ]),
    WidgetsModule,
    FormsModule,
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
    InputTextModule,
    CheckboxModule
  ],
})
export class SecurityManagementModule {}
