import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { OptionLaporanSuratService } from './option-laporan-surat.service';
import { MessageService } from 'primeng/api';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';

@Component({
  selector: 'app-option-laporan-surat',
  templateUrl: './option-laporan-surat.component.html',
  styleUrl: './option-laporan-surat.component.scss',
  providers: [OptionLaporanSuratService, MessageService],
})
export class OptionLaporanSuratComponent implements OnInit {
  optionListDepartmentHR: any;
  selectedDept: any;
  selectedDeptSect: any;
  loading: boolean = false;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  surat: any = '';
  suratOption: any[] = [
    { label: 'Surat Cuti', value: 'SC' },
    { label: 'Surat Izin', value: 'SI' },
    { label: 'Surat Dinas', value: 'SD' },
    { label: 'Surat Lembur', value: 'SL' },
  ];
  selectedSurat: any;
  TableReportSuratCuti: any;
  ReportSuratTableCuti: any;
  TableReportSuratIzin: any;
  ReportSuratTableIzin: any;
  TableReportSuratDinas: any;
  ReportSuratTableDinas: any;
  TableReportSuratLembur: any;
  ReportSuratTableLembur: any;
  TableReportSuratLemburPergroup: any;
  ReportSuratTableLemburPergroup: any;
  GroupCode: any;

  constructor(
    private messageService: MessageService,
    private httpService: OptionLaporanSuratService
  ) {
    this.GroupCode = localStorage.getItem('currentGroupCode');
  }

  ngOnInit(): void {
    this.filterSuratOptions();
    this.getDepartment();
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    $('#tableReportSuratLemburPerGroup').attr('hidden', 'hidden');
  }

  filterSuratOptions() {
    if (this.GroupCode === 'CSS-006') {
      this.suratOption = this.suratOption.filter(
        (option) => option.value !== 'SC'
      );
    }
  }

  onChangeDepartment(selectedDept: any[]) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
  }

  onChangeSurat(selectedSurat: any) {
    console.log(selectedSurat);
    this.selectedSurat = selectedSurat;
  }

  onDateSelect(event: any) {
    console.log('Selected date range:', this.selectedPeriode);
    // Ensure the dates are processed correctly without time information
  }

  getDeptIds() {
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  getDepartment() {
    this.optionListDepartmentHR = [];
    this.httpService
      .GetDeptSect(
        '4',
        localStorage.getItem('currentGroupCode'),
        localStorage.getItem('currentDeptName'),
        localStorage.getItem('currentSectName')
      )
      .subscribe(
        (data) => {
          const department = data.map((item: any) => {
            return {
              label: item.DSName,
              departmentId: item.DeptCode,
              sectionId: item.SectCode,
              departmentName: item.DeptName,
              sectionName: item.SectName,
              DSCode: item.DSCode,
            };
          });
          this.optionListDepartmentHR = department;
        },
        (error) => {
          // Handle error
        }
      );
  }

  getCommand() {
    if (this.selectedSurat == 'SC') {
      this.ReportSuratCuti();
    } else if (this.selectedSurat == 'SI') {
      this.ReportSuratIzin();
    } else if (this.selectedSurat == 'SD') {
      this.ReportSuratDinas();
    } else if (this.selectedSurat == 'SL') {
      this.ReportSuratLembur();
    }
  }

  getCommandpergroup() {
    if (this.selectedSurat == 'SL') {
      this.ReportSuratLemburPergroup();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Fitur Tersebut dipake untuk Lembur!',
      });
    }
  }

  ReportSuratCuti() {
    $('#tableReportSuratCuti').removeAttr('hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');

    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    const deptString = this.getDeptIds().join(',');
    this.TableReportSuratCuti = $('#ReportSuratCuti').DataTable();
    this.TableReportSuratCuti.destroy();
    this.ReportSuratTableCuti = {
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
          code: 107,
          param4: tanggalAwal,
          param5: tanggalAkhir,
          param8: deptString,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
        },
        {
          title: 'Dept - Sect',
          data: 'DeptSect',
        },
        {
          title: 'Register',
          data: 'RegNo',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Ins',
          data: 'Company',
        },
        {
          title: 'Dari',
          data: 'DT1',
        },
        {
          title: 'Sampai',
          data: 'DT2',
        },
        {
          title: 'Keterangan',
          data: 'Note',
        },
        {
          title: 'Jenis',
          data: 'CategoryLR',
          className: 'dt-body-center',
        },
        {
          title: 'Status Approve 1',
          data: 'StatusAppr1',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 1',
          data: 'TglAppr1',
          className: '',
        },
        {
          title: 'Status Approve 2',
          data: 'StatusAppr2',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 2',
          data: 'TglAppr2',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: 'CreateDate',
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

    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    const deptString = this.getDeptIds().join(',');
    this.TableReportSuratIzin = $('#ReportSuratIzin').DataTable();
    this.TableReportSuratIzin.destroy();
    this.ReportSuratTableIzin = {
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
          code: 412,
          param4: tanggalAwal,
          param5: tanggalAkhir,
          param8: deptString,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
        },
        {
          title: 'Register',
          data: 'RegNo',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Dept - Sect',
          data: 'DeptSect',
        },
        {
          title: 'Ins',
          data: 'Company',
        },
        {
          title: 'Dari',
          data: 'DT1',
        },
        {
          title: 'Sampai',
          data: 'DT2',
        },
        {
          title: 'Keterangan',
          data: 'Note',
        },
        {
          title: 'Kategori',
          data: 'CategoryLR',
          className: '',
        },
        {
          title: 'Status Approve 1',
          data: 'StatusAppr1',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 1',
          data: 'TglAppr1',
          className: '',
        },
        {
          title: 'Status Approve 2',
          data: 'StatusAppr2',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 2',
          data: 'TglAppr2',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: 'CreateDate',
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

    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    const deptString = this.getDeptIds().join(',');
    this.TableReportSuratDinas = $('#ReportSuratDinas').DataTable();
    this.TableReportSuratDinas.destroy();
    this.ReportSuratTableDinas = {
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
          code: 315,
          param4: tanggalAwal,
          param5: tanggalAkhir,
          param8: deptString,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
        },
        {
          title: 'Register',
          data: 'RegNo',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Dept - Sect',
          data: 'DeptSect',
        },
        {
          title: 'Ins',
          data: 'Company',
        },
        {
          title: 'Dari',
          data: 'DT1',
        },
        {
          title: 'Sampai',
          data: 'DT2',
        },
        {
          title: 'Keterangan',
          data: 'Note',
        },
        {
          title: 'Status Approve 1',
          data: 'StatusAppr1',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 1',
          data: 'TglAppr1',
          className: '',
        },
        {
          title: 'Status Approve 2',
          data: 'StatusAppr2',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 2',
          data: 'TglAppr2',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: 'CreateDate',
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

    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    const deptString = this.getDeptIds().join(',');
    const Ins = 'CSS';
    this.TableReportSuratLembur = $('#ReportSuratLembur').DataTable();
    this.TableReportSuratLembur.destroy();
    this.ReportSuratTableLembur = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      buttons: [
        {
          extend: 'excel',
          title: 'Laporan Lembur Detail',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        {
          text: 'Excel For Upload',
          title: '',
          extend: 'excel',
          exportOptions: {
            columns: [14, 15, 16, 17, 18, 19, 20, 21, 22],
          },
        },
        {
          extend: 'pdf',
          title: 'Laporan Lembur Detail',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        {
          extend: 'print',
          title: 'Laporan Lembur Detail',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        {
          extend: 'csv',
          title: 'Laporan Lembur Detail',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
      ],
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 211,
          param4: tanggalAwal,
          param5: tanggalAkhir,
          param8: deptString,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
        },
        {
          title: 'Dept - Sect',
          data: 'DeptSect',
        },
        {
          title: 'Register',
          data: 'RegNo',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Ins',
          data: 'Company',
        },
        {
          title: 'Tanggal Kerja',
          data: 'Workdate',
        },
        {
          title: 'Mulai',
          data: 'DT1',
        },
        {
          title: 'Selesai',
          data: 'DT2',
        },
        {
          title: 'Keterangan',
          data: 'Note',
          className: '',
        },
        {
          title: 'Status Approve 1',
          data: 'StatusAppr1',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 1',
          data: 'TglAppr1',
          className: '',
        },
        {
          title: 'Status Approve 2',
          data: 'StatusAppr2',
          className: 'dt-body-center',
          render: function (data: any) {
            if (data === '3.1') {
              return 'Open';
            } else if (data === '3.2') {
              return 'Approve';
            } else if (data === '3.3') {
              return 'Reject';
            }
          },
        },
        {
          title: 'Tanggal Approve 2',
          data: 'TglAppr2',
          className: '',
        },
        {
          title: 'Tanggal Input',
          data: 'CreateDate',
          className: '',
        },
        // For Excel Upload
        {
          title: 'emCode',
          data: 'RegNo',
        },
        {
          title: 'dateWork',
          data: 'Workdate',
          render: function (data: any) {
            return moment(data).isValid()
              ? moment(data).format('DD/MM/YYYY')
              : '-';
          },
        },
        {
          title: 'dateFo',
          data: 'DT1',
          render: function (data: any) {
            return moment(data).isValid()
              ? moment(data).format('DD/MM/YYYY')
              : '-';
          },
        },
        {
          title: 'timeFo',
          data: 'DT1',
          render: function (data: any) {
            return moment(data).isValid() ? moment(data).format('HH:mm') : '-';
          },
        },
        {
          title: 'dateTo',
          data: 'DT2',
          render: function (data: any) {
            return moment(data).isValid()
              ? moment(data).format('DD/MM/YYYY')
              : '-';
          },
        },
        {
          title: 'timeTo',
          data: 'DT2',
          render: function (data: any) {
            return moment(data).isValid() ? moment(data).format('HH:mm') : '-';
          },
        },
        {
          title: 'CombinationCode',
          data: null,
          render: function (data: any) {
            return '';
          },
        },
        {
          title: 'CombinationName',
          data: null,
          render: function (data: any) {
            return '';
          },
        },
        {
          title: 'citCode',
          data: 'OTCriteria',
        },
      ],
      columnDefs: [
        {
          targets: 14,
          visible: false,
        },
        {
          targets: 15,
          visible: false,
        },
        {
          targets: 16,
          visible: false,
        },
        {
          targets: 17,
          visible: false,
        },
        {
          targets: 18,
          visible: false,
        },
        {
          targets: 19,
          visible: false,
        },
        {
          targets: 20,
          visible: false,
        },
        {
          targets: 21,
          visible: false,
        },
        {
          targets: 22,
          visible: false,
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

  ReportSuratLemburPergroup() {
    $('#tableReportSuratCuti').attr('hidden', 'hidden');
    $('#tableReportSuratIzin').attr('hidden', 'hidden');
    $('#tableReportSuratDinas').attr('hidden', 'hidden');
    $('#tableReportSuratLembur').attr('hidden', 'hidden');
    $('#tableReportSuratLemburPerGroup').removeAttr('hidden');
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
    this.TableReportSuratLemburPergroup = $(
      '#ReportSuratTableLemburPergroup'
    ).DataTable();
    this.TableReportSuratLemburPergroup.destroy();
    this.ReportSuratTableLemburPergroup = {
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
          title: 'Section',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Lama Lembur',
          data: '',
          className: 'dt-body-center',
        },
        {
          title: 'Detail',
          data: '',
          className: 'dt-body-center',
        },
      ],
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   $('td button#edit', row).bind('click', () => {});
      // },
    };
    this.TableReportSuratLemburPergroup = $(
      '#ReportSuratTableLemburPergroup'
    ).DataTable(this.ReportSuratTableLemburPergroup);
  }
}
