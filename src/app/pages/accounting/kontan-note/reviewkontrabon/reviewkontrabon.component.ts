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
import { ReviewkontrabonService } from './reviewkontrabon.service';

@Component({
  selector: 'app-reviewkontrabon',
  templateUrl: './reviewkontrabon.component.html',
  styleUrl: './reviewkontrabon.component.scss',
  providers: [MessageService, ReviewkontrabonService],
})
export class ReviewkontrabonComponent implements OnInit {
  optionListGroup: any;
  selectedGroup: any = {};
  selectedYear: any;
  selectedMonth: any;
  years: number[];
  month: number[];
  dateRange: any;
  showDateRangeForm = true;
  showYearForm = true;
  showMonthForm = true;
  yearDate: any;
  monthDate: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ReviewkontrabonService: ReviewkontrabonService
  ) {}

  ngOnInit(): void {}

  onChangeGroup(selectedGroup: any) {
    console.log(selectedGroup);
  }
}
