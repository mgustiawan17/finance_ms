import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { ReturkontrabonService } from './returkontrabon.service';

@Component({
  selector: 'app-returkontrabon',
  templateUrl: './returkontrabon.component.html',
  styleUrl: './returkontrabon.component.scss',
  providers: [MessageService, ReturkontrabonService],
})
export class ReturkontrabonComponent implements OnInit {
  optionListSupplier: any;
  selectedSupplier: any = {};

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ReturkontrabonService: ReturkontrabonService
  ) {}

  ngOnInit(): void {}

  onChangeSupplier(selectedSupplier: any) {
    console.log(selectedSupplier);
  }
}
