import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { Select2Module } from 'ng-select2-component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ModalsModule } from 'src/app/_metronic/partials';

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


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegisterComponent,
      },
    ]),
    NgSelectModule,
    FormsModule,
    Select2Module,
    MatRadioModule,
    ModalsModule,
    
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
    ToolbarModule
  ],
})
export class RegisterModule {}
