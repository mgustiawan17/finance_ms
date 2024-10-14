import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { NgForm, FormControl, FormGroup } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from './leave.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
  providers: [LeaveService, MessageService],
})
export class LeaveComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  model: any;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  busy: any;
  tableLeave: any;
  ListtableLeave: any;
  tablePermission: any;
  tableOvertime: any;
  tableOffice: any;
  showTable: any;
  formGroup: FormGroup;
  daterangepickerOptions: any = {};
  f!: string;
  rangeDates: Date[] | undefined;
  loading: boolean = false;
  selectedPermit: any;

  StatusOptions: any[] = [
    { name: 'Open', value: '3.1' },
    { name: 'Approved', value: '3.2' },
    { name: 'Rejected', value: '3.3' },
  ];
  valuecompanyOptions: string = '';
  valuestatusOptions: string = '';
  selectedCompany: any;
  selectedStatus: any = '3.1';
  dateRange: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  currentRegno: any;
  currentUser: any;
  currentIns: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  isCollapsed: boolean = true;

  constructor(
    private layout: LayoutService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: Router,
    private httpService: LeaveService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
    this.currentRegno = localStorage.getItem('currentRegister');
    this.currentUser = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
    this.valuecompanyOptions = this.currentIns;
  }

  ngOnInit(): void {
    this.getTableLeaveOpen();
    // this.getTableLeaveReject();
    // this.getTableLeaveApprove();
    // this.getOfficeLetter();
    // this.getOvertimeLetter();
    // this.getPermissionLetter();
    // this.selectedStatus === 3.1;

    // $('#tableCuti').attr('hidden', 'hidden');
    $('#tableIzin').attr('hidden', 'hidden');
    $('#tableLembur').attr('hidden', 'hidden');
    $('#tableDinas').attr('hidden', 'hidden');
  }

  onChangeCompany(selectedCompany: string) {
    console.log(selectedCompany);
    this.selectedCompany = selectedCompany;
  }

  onChangeStatus(selectedStatus: any) {
    console.log(selectedStatus);
    this.selectedStatus = selectedStatus.value;
  }

  onDateSelect(event: any) {
    console.log('Selected date range:', this.selectedPeriode);
    // Ensure the dates are processed correctly without time information
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    $('#tableCuti').removeAttr('hidden');
    // $('#tableIzin').removeAttr('hidden');
    // $('#tableLembur').removeAttr('hidden');
    // $('#tableDinas').removeAttr('hidden');
    if (this.selectedStatus == 3.1) {
      this.getTableLeaveOpen();
    } else if (this.selectedStatus == 3.2) {
      this.getTableLeaveApprove();
    } else if (this.selectedStatus == 3.3) {
      this.getTableLeaveReject();
    }
  }

  getTableLeaveOpen() {
    this.spinner.show();

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

    this.tableLeave = $('#tabelListLeaveLetter').DataTable();
    this.tableLeave.destroy();
    this.ListtableLeave = {
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
          code: 7,
          param5: this.selectedStatus,
          regNo: this.currentRegno,
          company: this.valuecompanyOptions,
          userid: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: 'null',
          className: 'dt-body-center',
          width: 250,
          render: function (data: any, type: any, row: any) {
            console.log(row);
            var permitName = row.PermitName;
            if (permitName === 'Lembur' || permitName === 'Dinas') {
              return (
                '<button id="detailOpen" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
                '<button id="approve" class="approve m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t\t\t\t\t<i class="fa fa-check"></i>\t\t\t\t\t\t</Button>' +
                '\t\t\t\t\t\t<button id="reject" class="reject m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t\t\t\t\t<i class="fa fa-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
              );
            } else {
              return (
                '<button id="approve" class="approve m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t\t\t\t\t<i class="fa fa-check"></i>\t\t\t\t\t\t</Button>' +
                '\t\t\t\t\t\t<button id="reject" class="reject m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t\t\t\t\t<i class="fa fa-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
              );
            }
          },
        },
        { title: 'Letter', data: 'PermitName', className: 'dt-body-center' },
        { title: 'Letter No', data: 'PermitNo', className: 'dt-body-center' },
        { title: 'Section', data: 'SectionName', className: 'dt-body-center' },
        { title: 'Register', data: 'RegNo', className: 'dt-body-center' },
        { title: 'Name', data: 'EmployeeName' },
        { title: 'From', data: 'DT1', className: 'dt-body-center' },
        { title: 'To', data: 'DT2', className: 'dt-body-center' },
        { title: 'Description', data: 'Note' },
        // { title: 'Approval Status', data: '' },
        // { title: 'Approval Date', data: '' },
        // { title: 'Approval Status 2', data: '' },
        // { title: 'Approval Date 2', data: '' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailOpen', row).bind('click', () => {
          this.selectedPermit = data;
          const PermitNo = this.selectedPermit.PermitNo;
          this.Detail(PermitNo);
          this.displayModal = true;
        });
        $('#approve', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Approve('3.2', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Approve('3.2', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Approve('3.2', 3, this.selectedPermit.PermitNo);
          }
        });
        $('#reject', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Reject('3.3', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Reject('3.3', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Reject('3.3', 3, this.selectedPermit.PermitNo);
          }
        });
      },
    };
    this.tableLeave = $('#tabelListLeaveLetter').DataTable(this.ListtableLeave);
    // initComplete: function (settings: any, json: any) {
    //   me.spinner.hide();
    // },
    // $('ListLeaveLetter').removeAttr('hidden');
  }

  getTableLeaveApprove() {
    this.spinner.show();

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

    this.tableLeave = $('#tabelListLeaveLetter').DataTable();
    this.tableLeave.destroy();
    this.ListtableLeave = {
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
          code: 7,
          param5: this.selectedStatus,
          regNo: this.currentRegno,
          company: this.valuecompanyOptions,
          userid: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: 'null',
          className: 'dt-body-center',
          width: 250,
          render: function (data: any, type: any, row: any) {
            console.log(row);
            var permitName = row.PermitName;
            if (permitName === 'Lembur' || permitName === 'Dinas') {
              return (
                '<button id="detailAppr" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
                '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t' +
                '\t\t\t\t\t\t<button id="reject" class="reject m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t\t\t\t\t<i class="fa fa-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
              );
            } else {
              return (
                '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t' +
                '\t\t\t\t\t\t<button id="reject" class="reject m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t\t\t\t\t<i class="fa fa-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
              );
            }
          },
        },
        { title: 'Letter', data: 'PermitName', className: 'dt-body-center' },
        { title: 'Letter No', data: 'PermitNo', className: 'dt-body-center' },
        { title: 'Section', data: 'SectionName', className: 'dt-body-center' },
        { title: 'Register', data: 'RegNo', className: 'dt-body-center' },
        { title: 'Name', data: 'EmployeeName' },
        { title: 'From', data: 'DT1', className: 'dt-body-center' },
        { title: 'To', data: 'DT2', className: 'dt-body-center' },
        { title: 'Description', data: 'Note' },
        // { title: 'Approval Status', data: '' },
        // { title: 'Approval Date', data: '' },
        // { title: 'Approval Status 2', data: '' },
        // { title: 'Approval Date 2', data: '' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailAppr', row).bind('click', () => {
          this.selectedPermit = data;
          const PermitNo = this.selectedPermit.PermitNo;
          this.Detail(PermitNo);
          this.displayModal = true;
        });
        $('#open', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Open('3.1', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Open('3.1', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Open('3.1', 3, this.selectedPermit.PermitNo);
          }
        });
        $('#reject', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Reject('3.3', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Reject('3.3', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Reject('3.3', 3, this.selectedPermit.PermitNo);
          }
        });
      },
    };
    this.tableLeave = $('#tabelListLeaveLetter').DataTable(this.ListtableLeave);
    // initComplete: function (settings: any, json: any) {
    //   me.spinner.hide();
    // },
    // $('ListLeaveLetter').removeAttr('hidden');
  }

  getTableLeaveReject() {
    this.spinner.show();

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

    this.tableLeave = $('#tabelListLeaveLetter').DataTable();
    this.tableLeave.destroy();
    this.ListtableLeave = {
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
          code: 7,
          param5: this.selectedStatus,
          regNo: this.currentRegno,
          company: this.valuecompanyOptions,
          userid: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: 'null',
          className: 'dt-body-center',
          width: 250,
          render: function (data: any, type: any, row: any) {
            console.log(row);
            var permitName = row.PermitName;
            if (permitName === 'Lembur' || permitName === 'Dinas') {
              return (
                '<button id="detailReject" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
                '<button id="approve" class="approve m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t\t\t\t\t<i class="fa fa-check"></i>\t\t\t\t\t\t</Button>' +
                '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
              );
            } else {
              return (
                '<button id="approve" class="approve m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t\t\t\t\t<i class="fa fa-check"></i>\t\t\t\t\t\t</Button>' +
                '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
              );
            }
          },
        },
        { title: 'Letter', data: 'PermitName', className: 'dt-body-center' },
        { title: 'Letter No', data: 'PermitNo', className: 'dt-body-center' },
        { title: 'Section', data: 'SectionName', className: 'dt-body-center' },
        { title: 'Register', data: 'RegNo', className: 'dt-body-center' },
        { title: 'Name', data: 'EmployeeName' },
        { title: 'From', data: 'DT1', className: 'dt-body-center' },
        { title: 'To', data: 'DT2', className: 'dt-body-center' },
        { title: 'Description', data: 'Note' },
        // { title: 'Approval Status', data: '' },
        // { title: 'Approval Date', data: '' },
        // { title: 'Approval Status 2', data: '' },
        // { title: 'Approval Date 2', data: '' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailReject', row).bind('click', () => {
          this.selectedPermit = data;
          const PermitNo = this.selectedPermit.PermitNo;
          this.Detail(PermitNo);
          this.displayModal = true;
        });
        $('#approve', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Approve('3.2', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Approve('3.2', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Approve('3.2', 3, this.selectedPermit.PermitNo);
          }
        });
        $('#open', row).bind('click', () => {
          this.selectedPermit = data;
          if (this.selectedPermit.UrutanAppr === 1) {
            this.Open('3.1', 1, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 2) {
            this.Open('3.1', 2, this.selectedPermit.PermitNo);
          }
          if (this.selectedPermit.UrutanAppr === 3) {
            this.Open('3.1', 3, this.selectedPermit.PermitNo);
          }
        });
      },
    };
    this.tableLeave = $('#tabelListLeaveLetter').DataTable(this.ListtableLeave);
    // initComplete: function (settings: any, json: any) {
    //   me.spinner.hide();
    // },
    // $('ListLeaveLetter').removeAttr('hidden');
  }

  Detail(permitno: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_stat';
    } else {
      url = baseUrlLuar + 'Permit/Permit_stat';
    }
    const params = {
      code: 6,
      param1: 'SL',
      permitno: permitno,
    };
    this.cols = [
      { field: 'PermitNo', header: 'No Surat' },
      { field: 'DT1', header: 'Tanggal Awal' },
      { field: 'DT2', header: 'Tanggal Akhir' },
      { field: 'RegNo', header: 'Register' },
      { field: 'EmployeeName', header: 'Name' },
      // { field: 'action', header: 'Action' },
    ];

    this.httpClient.post<any>(url, params).subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.items = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          this.items = data.data;
        } else {
          console.error('Unexpected data format:', data);
          this.items = [];
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.items = [];
      }
    );
  }

  Open(Status: any, param: any, permitno: any) {
    this.httpService.UpdateStatus(permitno, param, Status).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Approve Berhasil',
          });
          // setTimeout(() => {
          //   window.location.reload();
          //   // this.displayModal = false;
          //   // $('#tableListCuti').attr('hidden', 'hidden');
          // }, 1000);
          if (this.selectedStatus == 3.1) {
            this.getTableLeaveOpen();
          } else if (this.selectedStatus == 3.2) {
            this.getTableLeaveApprove();
          } else if (this.selectedStatus == 3.3) {
            this.getTableLeaveReject();
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Approve',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal Approve',
        });
      },
      () => {}
    );
  }

  Approve(Status: any, param: any, permitno: any) {
    this.httpService.UpdateStatus(permitno, param, Status).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Approve Berhasil',
          });
          // setTimeout(() => {
          //   window.location.reload();
          //   // this.displayModal = false;
          //   // $('#tableListCuti').attr('hidden', 'hidden');
          // }, 1000);
          if (this.selectedStatus == 3.1) {
            this.getTableLeaveOpen();
          } else if (this.selectedStatus == 3.2) {
            this.getTableLeaveApprove();
          } else if (this.selectedStatus == 3.3) {
            this.getTableLeaveReject();
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Approve',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal Approve',
        });
      },
      () => {}
    );
  }

  Reject(Status: any, param: any, permitno: any) {
    this.httpService.UpdateStatus(permitno, param, Status).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reject Berhasil',
          });
          // setTimeout(() => {
          //   window.location.reload();
          //   // this.displayModal = false;
          //   // $('#tableListCuti').attr('hidden', 'hidden');
          // }, 1000);
          if (this.selectedStatus == 3.1) {
            this.getTableLeaveOpen();
          } else if (this.selectedStatus == 3.2) {
            this.getTableLeaveApprove();
          } else if (this.selectedStatus == 3.3) {
            this.getTableLeaveReject();
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Reject',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal Reject',
        });
      },
      () => {}
    );
  }
}
