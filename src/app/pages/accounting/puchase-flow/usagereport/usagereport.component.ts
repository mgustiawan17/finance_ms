import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { baseUrlCss, checkUrlCSS, baseUrlCssLuar } from '../../../baseurlCSS';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { RadioButton } from 'primeng/radiobutton';
import { UsagereportService } from './usagereport.service';
import { param } from 'jquery';

@Component({
  selector: 'app-usagereport',
  templateUrl: './usagereport.component.html',
  styleUrl: './usagereport.component.scss',
  providers: [MessageService, UsagereportService],
})
export class UsagereportComponent implements OnInit {
  selectedYear: Date | null = null;
  selectedMonth: any;
  years: number[];
  month: number[];
  dateRange: any;
  showDateRangeForm = true;
  showYearForm = true;
  showMonthForm = true;
  yearDate: any;
  monthDate: any;
  selectedCategory: any = null;

  categories: any[] = [
    { name: 'Pemakaian', key: 'Pemakaian' },
    { name: 'Pembelian', key: 'Penjualan' },
  ];

  TableUsageReport: any;
  UsageTableReport: any;

  constructor(
    private route: Router,
    private httpService: UsagereportService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.selectedCategory = this.categories[1];
    $('#tableUsageReport').attr('hidden', 'hidden');
  }

  formatDateYear(date: Date | null): string {
    return date ? `${date.getFullYear()}` : '';
  }

  formatDateMonth(date: Date | null): string {
    return date ? `${(date.getMonth() + 1).toString().padStart(2, '0')}` : '';
  }

  onYearSelect(event: Date): void {
    this.selectedYear = event;
    this.yearDate = this.formatDateYear(this.selectedYear);

    // Reinitialize the DataTable with the new data
    if (this.TableUsageReport) {
      this.TableUsageReport.destroy();
    }
  }

  onMonthSelect(event: Date): void {
    this.selectedMonth = event;
    this.monthDate = this.formatDateMonth(this.selectedMonth);

    // Reinitialize the DataTable with the new data
    if (this.TableUsageReport) {
      this.TableUsageReport.destroy();
    }
  }

  getCommand() {
    $('#tableUsageReport').removeAttr('hidden');
    this.UsageReport();
  }

  UsageReport() {
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_21_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_21_data_ajax';
    }
    this.TableUsageReport = $('#usageReport').DataTable();
    this.TableUsageReport.destroy();
    this.UsageTableReport = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 2,
          param1: this.yearDate,
          param2: this.monthDate,
          param3: this.selectedCategory.key,
        },
      },
      columns: [
        {
          title: 'Nama Dept',
          data: 'JnsTrn',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Gudang',
          data: 'KdGudang',
        },
        {
          title: 'Kd Dept Mesin',
          data: 'KdDeptMesin',
          className: 'dt-body-center',
        },
        {
          title: 'Sub Kd Mesin',
          data: 'SubKdMesin',
          className: 'dt-body-center',
        },
        {
          title: 'Kel Mesin',
          data: 'KelMesin',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal',
          data: 'Tgl',
          className: 'dt-body-center',
        },
        {
          title: 'No Bukti',
          data: 'NoBukti',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Dept',
          data: 'NamaDept',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Group',
          data: 'NamaGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Sub Group',
          data: 'NamaSubGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Barang',
          data: 'KdBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Barang',
          data: 'NamaBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Brand',
          data: 'Brand',
          className: 'dt-body-center',
        },
        {
          title: 'Qty',
          data: 'Qty',
          className: 'dt-body-center',
          // render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Satuan Pakai',
          data: 'SatuanPakai',
          className: 'dt-body-center',
        },
        {
          title: 'HPTRN',
          data: 'HPTRN',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Nilai',
          data: 'Nilai',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
      ],
    };
    this.TableUsageReport = $('#usageReport').DataTable(this.UsageTableReport);
  }
}
