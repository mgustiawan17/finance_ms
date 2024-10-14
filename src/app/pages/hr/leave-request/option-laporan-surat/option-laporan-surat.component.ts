import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-option-laporan-surat',
  templateUrl: './option-laporan-surat.component.html',
  styleUrl: './option-laporan-surat.component.scss',
})
export class OptionLaporanSuratComponent implements OnInit {
  rangeDates: Date[] | undefined;
  cities!: City[];
  selectedCities!: City[];
  TableReportSuratCuti: any;
  ReportSuratTableCuti: any;

  TableReportSuratIzin: any;
  ReportSuratTableIzin: any;

  TableReportSuratDinas: any;
  ReportSuratTableDinas: any;

  TableReportSuratLembur: any;
  ReportSuratTableLembur: any;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.ReportSuratCuti();
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }

  getCommand() {
    if ($('#listletter').val() == 'SC') {
      this.ReportSuratCuti();
    } else if ($('#listletter').val() == 'SI') {
      this.ReportSuratIzin();
    } else if ($('#listletter').val() == 'SD') {
      this.ReportSuratDinas();
    } else if ($('#listletter').val() == 'SL') {
      this.ReportSuratLembur();
    }
  }

  ReportSuratCuti() {
    $('#tableReportSuratCuti').removeAttr('hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    // var status = {
    //   1: { state: 'success' },
    //   2: { state: 'danger' },
    // };
    // var url;
    // if (checkUrl()) {
    //   url = baseUrl + 'Settings/Setting_Ajax';
    // } else {
    //   url = baseUrlLuar + 'Settings/Setting_Ajax';
    // }
    this.TableReportSuratCuti = $('#ReportSuratCuti').DataTable();
    this.TableReportSuratCuti.destroy();
    this.ReportSuratTableCuti = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      // ajax: {
      //   // url: url,
      //   type: 'POST',
      //   dataType: 'JSON',
      //   data: {
      //     code: 12,
      //   },
      // },
      columns: [
        {
          title: 'No Surat',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Section',
          data: '',
        },
        {
          title: 'Register',
          data: '',
        },
        {
          title: 'Nama',
          data: '',
        },
        {
          title: 'Ins',
          data: '',
        },
        {
          title: 'Dari',
          data: '',
        },
        {
          title: 'Sampai',
          data: '',
        },
        {
          title: 'Keterangan',
          data: '',
        },
        {
          title: 'Jenis',
          data: '',
          className: '',
        },
        {
          title: 'Status Approve',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Approve',
          data: '',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: '',
          className: '',
        },
      ],
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   $('td button#edit', row).bind('click', () => {});
      // },
    };
    this.TableReportSuratCuti = $('#ReportSuratCuti').DataTable(
      this.ReportSuratTableCuti
    );
  }

  ReportSuratIzin() {
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').removeAttr('hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    // var status = {
    //   1: { state: 'success' },
    //   2: { state: 'danger' },
    // };
    // var url;
    // if (checkUrl()) {
    //   url = baseUrl + 'Settings/Setting_Ajax';
    // } else {
    //   url = baseUrlLuar + 'Settings/Setting_Ajax';
    // }
    this.TableReportSuratIzin = $('#ReportSuratIzin').DataTable();
    this.TableReportSuratIzin.destroy();
    this.ReportSuratTableIzin = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      // ajax: {
      //   // url: url,
      //   type: 'POST',
      //   dataType: 'JSON',
      //   data: {
      //     code: 12,
      //   },
      // },
      columns: [
        {
          title: 'No Surat',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Register',
          data: '',
        },
        {
          title: 'Nama',
          data: '',
        },
        {
          title: 'Dept - Sect',
          data: '',
        },
        {
          title: 'Ins',
          data: '',
        },
        {
          title: 'Dari',
          data: '',
        },
        {
          title: 'Sampai',
          data: '',
        },
        {
          title: 'Keterangan',
          data: '',
        },
        {
          title: 'Kategori',
          data: '',
          className: '',
        },
        {
          title: 'Status Approve',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Approve',
          data: '',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: '',
          className: '',
        },
      ],
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   $('td button#edit', row).bind('click', () => {});
      // },
    };
    this.TableReportSuratIzin = $('#ReportSuratIzin').DataTable(
      this.ReportSuratTableIzin
    );
  }

  ReportSuratDinas() {
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').removeAttr('hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    // var status = {
    //   1: { state: 'success' },
    //   2: { state: 'danger' },
    // };
    // var url;
    // if (checkUrl()) {
    //   url = baseUrl + 'Settings/Setting_Ajax';
    // } else {
    //   url = baseUrlLuar + 'Settings/Setting_Ajax';
    // }
    this.TableReportSuratDinas = $('#ReportSuratDinas').DataTable();
    this.TableReportSuratDinas.destroy();
    this.ReportSuratTableDinas = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      // ajax: {
      //   // url: url,
      //   type: 'POST',
      //   dataType: 'JSON',
      //   data: {
      //     code: 12,
      //   },
      // },
      columns: [
        {
          title: 'No Surat',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Register',
          data: '',
        },
        {
          title: 'Nama',
          data: '',
        },
        {
          title: 'Dept - Sect',
          data: '',
        },
        {
          title: 'Ins',
          data: '',
          className: '',
        },
        {
          title: 'Dari',
          data: '',
        },
        {
          title: 'Sampai',
          data: '',
        },
        {
          title: 'Keterangan',
          data: '',
        },
        {
          title: 'Status Approve',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Approve',
          data: '',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: '',
          className: '',
        },
      ],
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   $('td button#edit', row).bind('click', () => {});
      // },
    };
    this.TableReportSuratDinas = $('#ReportSuratDinas').DataTable(
      this.ReportSuratTableDinas
    );
  }

  ReportSuratLembur() {
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').removeAttr('hidden');
    // var status = {
    //   1: { state: 'success' },
    //   2: { state: 'danger' },
    // };
    // var url;
    // if (checkUrl()) {
    //   url = baseUrl + 'Settings/Setting_Ajax';
    // } else {
    //   url = baseUrlLuar + 'Settings/Setting_Ajax';
    // }
    this.TableReportSuratLembur = $('#ReportSuratLembur').DataTable();
    this.TableReportSuratLembur.destroy();
    this.ReportSuratTableLembur = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      // ajax: {
      //   // url: url,
      //   type: 'POST',
      //   dataType: 'JSON',
      //   data: {
      //     code: 12,
      //   },
      // },
      columns: [
        {
          title: 'No Surat',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Dept - Sect',
          data: '',
        },
        {
          title: 'Register',
          data: '',
        },
        {
          title: 'Nama',
          data: '',
        },
        {
          title: 'Ins',
          data: '',
        },
        {
          title: 'Tanggal Kerja',
          data: '',
        },
        {
          title: 'Mulai',
          data: '',
        },
        {
          title: 'Selesai',
          data: '',
        },
        {
          title: 'Keterangan',
          data: '',
          className: '',
        },
        {
          title: 'Status Approve',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Approve',
          data: '',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: '',
          className: '',
        },
      ],
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   $('td button#edit', row).bind('click', () => {});
      // },
    };
    this.TableReportSuratLembur = $('#ReportSuratLembur').DataTable(
      this.ReportSuratTableLembur
    );
  }
}
