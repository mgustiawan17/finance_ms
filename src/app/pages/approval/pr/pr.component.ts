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
import { PrService } from './pr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr',
  templateUrl: './pr.component.html',
  styleUrls: ['./pr.component.scss'],
  providers: [PrService, MessageService],
})
export class PrComponent implements OnInit {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  selectedSupplier: any;
  showTable: any;
  busy: any;
  table: any;
  formGroup: FormGroup;
  f!: string;
  loading: boolean = false;

  companyOptions: any[] = [
    { label: 'Famatex Cipadung', value: 'F2' },
    { label: 'Famatex Toha', value: 'F1' },
  ];
  StatusOptions: any[] = [
    { name: 'Open', value: '0' },
    { name: 'Approved', value: '1' },
    { name: 'Rejected', value: '2' },
  ];
  valuecompanyOptions: string = '';
  valuestatusOptions: string = '';
  selectedCompany: any;
  selectedStatus: any;
  dateRange: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  currentRegno: any;
  currentUser: any;
  currentIns: any;
  tablePR: any;
  ListtablePR: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  displayRejectModal: boolean = false;
  selectednoBPP: any;
  selectedItem: any = {};
  isCollapsed: boolean = true;

  constructor(
    private layout: LayoutService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private httpService: PrService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
    this.currentRegno = localStorage.getItem('currentRegister');
    this.currentUser = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
    this.valuecompanyOptions = this.currentIns;
  }

  ngOnInit(): void {
    this.getTablePROpen();
    // this.getTablePRApprove();
    // this.getTablePRReject();
    // $('#tablePR').attr('hidden', 'hidden');
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    $('#tablePR').removeAttr('hidden');
    if (this.selectedStatus == 0) {
      this.getTablePROpen();
    } else if (this.selectedStatus == 1) {
      this.getTablePRApprove();
    } else if (this.selectedStatus == 2) {
      this.getTablePRReject();
    }
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

  getTablePROpen() {
    this.spinner.show();
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Pembelian/SP002_AjaxCall';
    } else {
      url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
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

    this.tablePR = $('#listtabelPR').DataTable();
    this.tablePR.destroy();
    this.ListtablePR = {
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
          code: 1,
          company: this.valuecompanyOptions,
          param1: this.currentUser,
          param2: 0,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 200,
          render: function () {
            return (
              '<button id="detailOpen" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '<Button id="approveOpen" class="approveOpen m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t<i class="fa fa-check"></i>\t\t\t</Button>' +
              '\t\t\t<Button id="rejectOpen" data-toggle="modal" data-target="#modalReject" class="rejectOpen m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t<i class="fa fa-times"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No PR', data: 'NoBPP' },
        { title: 'PR Date', data: 'TGL_PR', className: 'dt-body-center' },
        {
          title: 'Department Name',
          data: 'NamaDept',
          className: 'dt-body-center',
        },
        { title: 'Name Request', data: 'ReqName' },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailOpen', row).bind('click', () => {
          this.selectednoBPP = data;
          const NoBPP = this.selectednoBPP.NoBPP;
          this.DetailPR(NoBPP);
          this.displayModal = true;
        });
        $('#approveOpen', row).bind('click', () => {
          this.selectednoBPP = data;
          this.ApprovePR(
            this.valuecompanyOptions,
            this.selectednoBPP.Approval,
            this.selectednoBPP.NoBPP
          );
        });
        $('#rejectOpen', row).bind('click', () => {
          this.openEditDialog(data);
          // this.selectednoBPP = data;
          // this.RejectPR('','','')
        });
      },
    };
    this.tablePR = $('#listtabelPR').DataTable(this.ListtablePR);
  }

  getTablePRApprove() {
    this.spinner.show();
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Pembelian/SP002_AjaxCall';
    } else {
      url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
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

    this.tablePR = $('#listtabelPR').DataTable();
    this.tablePR.destroy();
    this.ListtablePR = {
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
          code: 1,
          company: this.valuecompanyOptions,
          param1: this.currentUser,
          param2: 1,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 200,
          render: function () {
            return (
              '<button id="detailAppr" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '\t\t\t<Button id="rejectAppr" data-toggle="modal" data-target="#modalReject" class="rejectOpen m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t<i class="fa fa-times"></i>\t\t\t</Button>\t\t\t' +
              '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No PR', data: 'NoBPP' },
        { title: 'PR Date', data: 'TGL_PR', className: 'dt-body-center' },
        {
          title: 'Department Name',
          data: 'NamaDept',
          className: 'dt-body-center',
        },
        { title: 'Name Request', data: 'ReqName' },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailAppr', row).bind('click', () => {
          this.selectednoBPP = data;
          const NoBPP = this.selectednoBPP.NoBPP;
          this.DetailPR(NoBPP);
          this.displayModal = true;
        });
        $('#rejectAppr', row).bind('click', () => {
          this.openEditDialog(data);
          // this.selectednoBPP = data;
          // this.ApprovePR(
          //   this.valuecompanyOptions,
          //   this.selectednoBPP.Approval,
          //   this.selectednoBPP.NoBPP
          // );
        });
        $('#open', row).bind('click', () => {
          this.selectednoBPP = data;
          this.OpenPR(
            this.valuecompanyOptions,
            this.selectednoBPP.Approval,
            this.selectednoBPP.NoBPP
          );
        });
      },
    };
    this.tablePR = $('#listtabelPR').DataTable(this.ListtablePR);
  }

  getTablePRReject() {
    this.spinner.show();
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Pembelian/SP002_AjaxCall';
    } else {
      url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
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

    this.tablePR = $('#listtabelPR').DataTable();
    this.tablePR.destroy();
    this.ListtablePR = {
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
          code: 1,
          company: this.valuecompanyOptions,
          param1: this.currentUser,
          param2: 2,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 200,
          render: function () {
            return (
              '<button id="detailOpen" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '<Button id="approveOpen" class="approveOpen m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t<i class="fa fa-check"></i>\t\t\t</Button>' +
              '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No PR', data: 'NoBPP' },
        { title: 'PR Date', data: 'TGL_PR', className: 'dt-body-center' },
        {
          title: 'Department Name',
          data: 'NamaDept',
          className: 'dt-body-center',
        },
        { title: 'Name Request', data: 'ReqName' },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailOpen', row).bind('click', () => {
          this.selectednoBPP = data;
          const NoBPP = this.selectednoBPP.NoBPP;
          this.DetailPR(NoBPP);
          this.displayModal = true;
        });
        $('#approveOpen', row).bind('click', () => {
          this.selectednoBPP = data;
          this.ApprovePR(
            this.valuecompanyOptions,
            this.selectednoBPP.Approval,
            this.selectednoBPP.NoBPP
          );
        });
        $('#open', row).bind('click', () => {
          this.selectednoBPP = data;
          this.OpenPR(
            this.valuecompanyOptions,
            this.selectednoBPP.Approval,
            this.selectednoBPP.NoBPP
          );
        });
      },
    };
    this.tablePR = $('#listtabelPR').DataTable(this.ListtablePR);
  }

  DetailPR(noBPP: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Pembelian/SP002';
    } else {
      url = baseUrlLuar + 'Pembelian/SP002';
    }
    const params = {
      code: 2,
      company: this.valuecompanyOptions,
      param2: noBPP,
    };
    this.cols = [
      { field: 'KdBrg', header: 'Kode Barang' },
      { field: 'NamaBrg', header: 'Nama Barang' },
      { field: 'QTY', header: 'QTY' },
      { field: 'PR_UOM', header: 'PR_UOM' },
      { field: 'Notes', header: 'Notes' },
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

  ApprovePR(company: any, param1: any, param4: any) {
    this.httpService.UpdateStatusApprove(company, param1, param4).subscribe(
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
          // this.getTableLeave();
          if (this.selectedStatus == 0) {
            this.getTablePROpen();
          } else if (this.selectedStatus == 1) {
            this.getTablePRApprove();
          } else if (this.selectedStatus == 2) {
            this.getTablePRReject();
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

  OpenPR(company: any, param1: any, param4: any) {
    this.httpService.UpdateStatusOpen(company, param1, param4).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Open PR Berhasil',
          });
          // setTimeout(() => {
          //   window.location.reload();
          //   // this.displayModal = false;
          //   // $('#tableListCuti').attr('hidden', 'hidden');
          // }, 1000);
          // this.getTableLeave();
          if (this.selectedStatus == 0) {
            this.getTablePROpen();
          } else if (this.selectedStatus == 1) {
            this.getTablePRApprove();
          } else if (this.selectedStatus == 2) {
            this.getTablePRReject();
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Open PR',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal Open PR',
        });
      },
      () => {}
    );
  }

  RejectPR(company: any, param1: any, param4: any, param2: any) {
    this.httpService
      .UpdateStatusReject(company, param1, param4, param2)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reject PR Berhasil',
            });
            // setTimeout(() => {
            //   window.location.reload();
            //   // this.displayModal = false;
            //   // $('#tableListCuti').attr('hidden', 'hidden');
            // }, 1000);
            // this.getTableLeave();
            if (this.selectedStatus == 0) {
              this.getTablePROpen();
            } else if (this.selectedStatus == 1) {
              this.getTablePRApprove();
            } else if (this.selectedStatus == 2) {
              this.getTablePRReject();
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Reject PR',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Reject PR',
          });
        },
        () => {}
      );
  }

  Kembali() {
    this.displayRejectModal = false;
  }

  openEditDialog(item: any) {
    this.selectedItem = item;
    this.displayRejectModal = true;
  }

  InsRejectPR() {
    const noPR: string = $('#noBPP').val() as string;
    const Appr: string = $('#appr').val() as string;
    const keterangan: string = $('#keterangan').val() as string;
    this.httpService
      .UpdateStatusReject(this.valuecompanyOptions, Appr, noPR, keterangan)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reject PR Berhasil',
            });
            // setTimeout(() => {
            //   window.location.reload();
            //   // this.displayModal = false;
            //   // $('#tableListCuti').attr('hidden', 'hidden');
            // }, 1000);
            if (this.selectedStatus == 0) {
              this.getTablePROpen();
            } else if (this.selectedStatus == 1) {
              this.getTablePRApprove();
            } else if (this.selectedStatus == 2) {
              this.getTablePRReject();
            }
            this.displayRejectModal = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Reject PR',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Reject PR',
          });
        },
        () => {}
      );
  }
}
