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
import { PoService } from './po.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss'],
  providers: [PoService, MessageService],
})
export class PoComponent implements OnInit {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  showTable: any;
  busy: any;
  table: any;
  f!: string;
  formGroup: FormGroup;
  checked: boolean = false;
  loading: boolean = false;
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
  tablePO: any;
  ListtablePO: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  displayRejectModal: boolean = false;
  param1: number = 0;
  selectednoOP: any;
  selectedItem: any = {};
  isCollapsed: boolean = true;

  constructor(
    private layout: LayoutService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: Router,
    private httpService: PoService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
    this.currentRegno = localStorage.getItem('currentRegister');
    this.currentUser = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
    this.valuecompanyOptions = this.currentIns;
  }

  ngOnInit(): void {
    this.getTablePOOpen();
    // this.getTablePOApprove();
    // this.getTablePOReject();
    this.checked = false; // Default state
    this.param1 = 0; // Default param1 value
    // this.getTablePOOpen();
    // $('#tablePO').attr('hidden', 'hidden');
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    $('#tablePO').removeAttr('hidden');
    if (this.selectedStatus == 0) {
      this.getTablePOOpen();
    } else if (this.selectedStatus == 1) {
      this.getTablePOApprove();
    } else if (this.selectedStatus == 2) {
      this.getTablePOReject();
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

  onSwitchChange(event: any) {
    // this.checked = value;
    this.param1 = this.checked ? 1 : 0;
    console.log('Show All:', this.param1);
    this.getTablePOOpen();
    // this.getTablePOApprove();
    // this.getTablePOReject();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  formatNumber(data: number): string {
    return data.toLocaleString('en-US');
  }

  getTablePOOpen() {
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

    this.tablePO = $('#listtabelPO').DataTable();
    this.tablePO.destroy();
    this.ListtablePO = {
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
          code: 6,
          company: this.valuecompanyOptions,
          param1: this.param1,
          param2: 0,
          param3: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 250,
          render: function () {
            return (
              '<button id="detailOpen" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '<Button id="approveOpen" class="approveOpen m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t<i class="fa fa-check"></i>\t\t\t</Button>' +
              '\t\t\t<Button id="rejectOpen"data-toggle="modal" data-target="#modalReject" class="rejectOpen m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t<i class="fa fa-times"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No OP', data: 'NoOP' },
        { title: 'OP Date', data: 'TGLOP', className: 'dt-body-center' },
        {
          title: 'Name Supplier',
          data: 'NamaSupp',
          className: 'dt-body-center',
        },
        { title: 'Currency', data: 'Currency' },
        {
          title: 'Amount',
          data: 'Amount',
          render: (data: number) => this.formatNumber(data),
        },
        {
          title: 'PPN',
          data: 'PPN',
          render: (data: number) => this.formatNumber(data),
        },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailOpen', row).bind('click', () => {
          this.selectednoOP = data;
          const NoOP = this.selectednoOP.NoOP;
          this.DetailPO(NoOP);
          this.displayModal = true;
        });
        $('#approveOpen', row).bind('click', () => {
          this.selectednoOP = data;
          this.ApprovePO(1, this.selectednoOP.NoOP, this.currentUser);
          // this.getTablePOOpen();
        });
        $('#rejectOpen', row).bind('click', () => {
          this.openEditDialog(data);
          // this.getTablePOOpen();
          // this.displayRejectModal = true;
          // this.selectednoOP = data;
          // this.RejectPO(2, this.selectednoOP.NoOP, this.currentUser, '');
        });
      },
    };
    this.tablePO = $('#listtabelPO').DataTable(this.ListtablePO);
  }

  getTablePOApprove() {
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

    this.tablePO = $('#listtabelPO').DataTable();
    this.tablePO.destroy();
    this.ListtablePO = {
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
          code: 6,
          company: this.valuecompanyOptions,
          param1: this.param1,
          param2: 1,
          param3: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 250,
          render: function () {
            return (
              '<button id="detailAppr" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '\t\t\t<Button id="rejectAppr" data-toggle="modal" data-target="#modalReject" class="rejectOpen m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Reject">\t\t\t<i class="fa fa-times"></i>\t\t\t</Button>\t\t\t' +
              '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No OP', data: 'NoOP' },
        { title: 'OP Date', data: 'TGLOP', className: 'dt-body-center' },
        {
          title: 'Name Supplier',
          data: 'NamaSupp',
          className: 'dt-body-center',
        },
        { title: 'Currency', data: 'Currency' },
        {
          title: 'Amount',
          data: 'Amount',
          render: (data: number) => this.formatNumber(data),
        },
        {
          title: 'PPN',
          data: 'PPN',
          render: (data: number) => this.formatNumber(data),
        },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailAppr', row).bind('click', () => {
          this.selectednoOP = data;
          const NoOP = this.selectednoOP.NoOP;
          this.DetailPO(NoOP);
          this.displayModal = true;
        });
        $('#rejectAppr', row).bind('click', () => {
          this.openEditDialog(data);
          // this.getTablePOApprove();
          // this.selectednoOP = data;
          // this.RejectPO(2, this.selectednoOP.NoOP, this.currentUser, '');
        });
        $('#open', row).bind('click', () => {
          this.selectednoOP = data;
          this.OpenPO(0, this.selectednoOP.NoOP, this.currentUser);
          // this.getTablePOApprove();
        });
      },
    };
    this.tablePO = $('#listtabelPO').DataTable(this.ListtablePO);
  }

  getTablePOReject() {
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

    this.tablePO = $('#listtabelPO').DataTable();
    this.tablePO.destroy();
    this.ListtablePO = {
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
          code: 6,
          company: this.valuecompanyOptions,
          param1: this.param1,
          param2: 2,
          param3: this.currentUser,
        },
      },
      columns: [
        {
          title: 'Action',
          data: '',
          className: 'dt-body-center',
          width: 250,
          render: function () {
            return (
              '<button id="detailReject" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail"><i class="bi bi-three-dots"></i></button>' +
              '<Button id="approveReject" class="approveOpen m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Approve">\t\t\t<i class="fa fa-check"></i>\t\t\t</Button>' +
              '\t\t\t<Button id="open" data-toggle="modal" data-target="#modalOpen" class="open m-portlet__nav-link btn m-btn m-btn–hover-info m-btn–icon m-btn–icon-only m-btn–pill btn-outline-info" title="Open">\t\t\t<i class="bi bi-unlock-fill"></i>\t\t\t</Button>\t\t\t'
            );
          },
        },
        { title: 'No OP', data: 'NoOP' },
        { title: 'OP Date', data: 'TGLOP', className: 'dt-body-center' },
        {
          title: 'Name Supplier',
          data: 'NamaSupp',
          className: 'dt-body-center',
        },
        { title: 'Currency', data: 'Currency' },
        {
          title: 'Amount',
          data: 'Amount',
          render: (data: number) => this.formatNumber(data),
        },
        {
          title: 'PPN',
          data: 'PPN',
          render: (data: number) => this.formatNumber(data),
        },
        { title: 'User ID', data: 'USER_ID' },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detailReject', row).bind('click', () => {
          this.selectednoOP = data;
          const NoOP = this.selectednoOP.NoOP;
          this.DetailPO(NoOP);
          this.displayModal = true;
        });
        $('#approveReject', row).bind('click', () => {
          this.selectednoOP = data;
          this.ApprovePO(1, this.selectednoOP.NoOP, this.currentUser);
          // this.getTablePOReject();
        });
        $('#open', row).bind('click', () => {
          this.selectednoOP = data;
          this.OpenPO(0, this.selectednoOP.NoOP, this.currentUser);
          // this.getTablePOReject();
        });
      },
    };
    this.tablePO = $('#listtabelPO').DataTable(this.ListtablePO);
  }

  DetailPO(noOP: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Pembelian/SP002';
    } else {
      url = baseUrlLuar + 'Pembelian/SP002';
    }
    const params = {
      code: 7,
      company: this.valuecompanyOptions,
      param1: noOP,
    };
    this.cols = [
      { field: 'NoOP', header: 'No OP' },
      { field: 'KdBrg', header: 'Kode Barang' },
      { field: 'NamaBrg', header: 'Nama Barang' },
      { field: 'QtyOP', header: 'Qty OP' },
      { field: 'SatuanBeli', header: 'Satuan Beli' },
      { field: 'Stok', header: 'Stok' },
      { field: 'SatuanPakai', header: 'Satuan Pakai' },
      { field: 'CURRENCY', header: 'Currency' },
      { field: 'KURS', header: 'Kurs' },
      { field: 'HRGSATUAN', header: 'Hrg Satuan' },
      { field: 'Nilai_Disc1', header: 'Nilai Disc 1' },
      { field: 'Nilai_Disc2', header: 'Nilai Disc 2' },
      { field: 'Nilai_PPN', header: 'Nilai PPN' },
      { field: 'SUBTOTAL', header: 'Sub Total' },
      { field: 'Ket', header: 'Ket' },
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

  ApprovePO(param1: any, param2: any, param3: any) {
    this.httpService
      .UpdateStatusApprove(param1, param2, param3, this.valuecompanyOptions)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Approve PO Berhasil',
            });
            // setTimeout(() => {
            //   window.location.reload();
            //   // this.displayModal = false;
            //   // $('#tableListCuti').attr('hidden', 'hidden');
            // }, 1000);
            // this.getTableLeave();
            if (this.selectedStatus == 0) {
              this.getTablePOOpen();
            } else if (this.selectedStatus == 1) {
              this.getTablePOApprove();
            } else if (this.selectedStatus == 2) {
              this.getTablePOReject();
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Approve PO',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Approve PO',
          });
        },
        () => {}
      );
  }

  OpenPO(param1: any, param2: any, param3: any) {
    this.httpService
      .UpdateStatusApprove(param1, param2, param3, this.valuecompanyOptions)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Open PO Berhasil',
            });
            // setTimeout(() => {
            //   window.location.reload();
            //   // this.displayModal = false;
            //   // $('#tableListCuti').attr('hidden', 'hidden');
            // }, 1000);
            // this.getTableLeave();
            if (this.selectedStatus == 0) {
              this.getTablePOOpen();
            } else if (this.selectedStatus == 1) {
              this.getTablePOApprove();
            } else if (this.selectedStatus == 2) {
              this.getTablePOReject();
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Open PO',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Open PO',
          });
        },
        () => {}
      );
  }

  Kembali() {
    this.displayRejectModal = false;
  }

  openEditDialog(item: any) {
    this.selectedItem = item; // Simpan item yang dipilih
    this.displayRejectModal = true; // Tampilkan modal dialog untuk edit
  }

  InsRejectPO() {
    const noPO: string = $('#noOP').val() as string;
    const keterangan: string = $('#keterangan').val() as string;
    this.httpService
      .UpdateStatusReject(
        '2',
        noPO,
        this.currentUser,
        keterangan,
        this.valuecompanyOptions
      )
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reject PO Berhasil',
            });
            // setTimeout(() => {
            //   window.location.reload();
            //   // this.displayModal = false;
            //   // $('#tableListCuti').attr('hidden', 'hidden');
            // }, 1000);
            if (this.selectedStatus == 0) {
              this.getTablePOOpen();
            } else if (this.selectedStatus == 1) {
              this.getTablePOApprove();
            } else if (this.selectedStatus == 2) {
              this.getTablePOReject();
            }
            this.displayRejectModal = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Reject PO',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Reject PO',
          });
        },
        () => {}
      );
  }
}
