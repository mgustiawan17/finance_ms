import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenu1Component } from './dropdown-menu1/dropdown-menu1.component';
import { DropdownMenu2Component } from './dropdown-menu2/dropdown-menu2.component';
import { DropdownMenu3Component } from './dropdown-menu3/dropdown-menu3.component';
import { DropdownMenu4Component } from './dropdown-menu4/dropdown-menu4.component';


@NgModule({
  declarations: [
    DropdownMenu1Component,
    DropdownMenu2Component,
    DropdownMenu3Component,
    DropdownMenu4Component,
  ],
  imports: [CommonModule],
  exports: [
    DropdownMenu1Component,
    DropdownMenu2Component,
    DropdownMenu3Component,
    DropdownMenu4Component,
  ],
})
export class DropdownMenusModule {}
