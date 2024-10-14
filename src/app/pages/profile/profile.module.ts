import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { Select2Module } from 'ng-select2-component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ModalsModule } from 'src/app/_metronic/partials';


// import { Select2Module } from 'ng-select2-component';
// import { WidgetsModule } from '../../../_metronic/partials';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
      },
    ]),
    NgSelectModule,
    FormsModule,
    Select2Module,
    MatRadioModule,
    ModalsModule
    // WidgetsModule,
  ],
})
export class ProfileModule {}
