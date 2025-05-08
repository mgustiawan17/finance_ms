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
import { baseUrlCss, checkUrlCSS, baseUrlCssLuar } from '../../../baseurlCSS';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { ReportbtbService } from './reportbtb.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-reportbtb',
  templateUrl: './reportbtb.component.html',
  styleUrl: './reportbtb.component.scss',
  providers: [MessageService, ReportbtbService],
})
export class ReportbtbComponent implements OnInit {
  dateRange: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  optionListGroup: any;
  selectedGroup: any = {};
  TableReportBTB: any;
  ReportTableBTB: any;

  constructor(
    private route: Router,
    private httpService: ReportbtbService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getGroup();
    $('#tableReportBTB').attr('hidden', 'hidden');
  }

  onChangeGroup(selectedGroup: any) {
    console.log(selectedGroup);
    this.selectedGroup = selectedGroup;
  }

  getGroupIds() {
    return this.selectedGroup.map((group: any) => group.code);
  }

  getGroup() {
    this.optionListGroup = [];
    this.httpService.SP_21_data_group('4').subscribe(
      (data) => {
        const group = data.map((item: any) => {
          return {
            code: item.KdGroup,
            label: item.NamaGroup,
          };
        });
        this.optionListGroup = group;
      },
      (error) => {}
    );
  }

  getCommand() {
    $('#tableReportBTB').removeAttr('hidden');
    this.ReportBTB();
  }

  ReportBTB() {
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_21_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_21_data_ajax';
    }
    const GroupString = this.getGroupIds().join(',');
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    this.TableReportBTB = $('#reportBTB').DataTable();
    this.TableReportBTB.destroy();
    this.ReportTableBTB = {
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
          code: 3,
          param1: tanggalAwal,
          param2: tanggalAkhir,
          param3: GroupString,
        },
      },
      columns: [
        {
          title: 'Tanggal BTB',
          data: 'TGLBTB',
          className: 'dt-body-center',
        },
        {
          title: 'No OP',
          data: 'NoOP',
        },
        {
          title: 'Kd Top X',
          data: 'KdTOPx',
          className: 'dt-body-center',
        },
        {
          title: 'No BPP',
          data: 'NoBPP',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Supp',
          data: 'KdSupp',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Supp',
          data: 'NamaSupp',
          className: 'dt-body-center',
        },
        {
          title: 'No BTB',
          data: 'NoBTB',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Dept',
          data: 'KdDept',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Dept',
          data: 'NamaDept',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Barang',
          data: 'KdBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Brand',
          data: 'Brand',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Barang',
          data: 'NamaBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Group',
          data: 'grup',
          className: 'dt-body-center',
        },
        {
          title: 'Sub Group',
          data: 'subGrup',
          className: 'dt-body-center',
        },
        {
          title: 'Kd Kel',
          data: 'KdKel',
          className: 'dt-body-center',
        },
        {
          title: 'Qty BTB SB',
          data: 'QtyBTB_SB',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Satuan Beli',
          data: 'SatuanBeli',
          className: 'dt-body-center',
        },
        {
          title: 'QTY BTB SP',
          data: 'QtyBTB_SP',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Currency',
          data: 'Currency',
          className: 'dt-body-center',
        },
        {
          title: 'Kurs',
          data: 'Kurs',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Harga Satuan',
          data: 'HrgSatuan',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Harga Satuan CURR',
          data: 'HrgSatuanCURR',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Harga Satuan OC1',
          data: 'OC1',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Harga Satuan OC2',
          data: 'OC2',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Nilai DPP',
          data: 'Nilai_DPP',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
      ],
    };
    this.TableReportBTB = $('#reportBTB').DataTable(this.ReportTableBTB);
  }
}
