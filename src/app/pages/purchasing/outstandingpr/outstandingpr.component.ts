import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { OutstandingPRService } from './outstandingpr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';
// import 'datatables.net-dt';
declare var $: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-outstandingpr',
  templateUrl: './outstandingpr.component.html',
  styleUrl: './outstandingpr.component.scss',
  providers: [OutstandingPRService, MessageService]
})
export class OutStandingPRComponent implements OnInit {
  public datePickerValue: Date = new Date()
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  checkedAll: boolean = false;
  dateRange: any;
  selectedGroupCodeSubGroup: any;
  barang: string = '';
  jumlah: number = 0;
  showCustomerFilterForm: boolean = false;
  busy: any;
  table: any;
  showTable: any;
  dataTable: any;
  listdataTable: any;
  firstDate: any;
  endDate: any;

  selectedOption: string;
  selectedPeriode: any;
  selectedUser: any;

  optionListPIC: any

  buttonOptions: any[] = [{ label: 'Without Periode', value: '3'},{ label: 'Periode', value: '1' },{ label: 'Periode Approve', value: '2'}];
  selectedButton: string = '';

  checkAllPIC= 'All';

  selectedBTB: any;

  constructor(private layout: LayoutService, private cdRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private httpService: OutstandingPRService,  private httpClient: HttpClient,  private messageService: MessageService ) {

  }
  ngOnInit(): void {
    this.getPIC();
  }
  ngAfterViewInit() {

  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  formatDatePeriode(date: Date): string {
    // Ubah format tanggal menjadi "yyyy-mm-dd"
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tambahkan leading zero jika perlu
    const day = ('0' + date.getDate()).slice(-2); // Tambahkan leading zero jika perlu
    return `${year}-${month}-${day}`;
  }

  onChangeButton(selectedButton: any){
    if (selectedButton === '3') {
      $('.selectPeriode').attr('hidden', true);
      $('#selectPeriode').attr('hidden', true);
      $('#cardOutStandingPRperiode').attr('hidden', true);
      $('#cardOutStandingPRnonperiode').attr('hidden', true);
        // $('.year-picker').attr('hidden', true);
        // $('#yearpicker').attr('hidden', true);
      } else if (selectedButton === '1') {
        $('.selectPeriode').removeAttr('hidden', 'hidden');
        $('#selectPeriode').removeAttr('hidden', 'hidden');
        $('#cardOutStandingPRperiode').attr('hidden', true);
        $('#cardOutStandingPRnonperiode').attr('hidden', true);
        // $('.year-picker').removeAttr('hidden', 'hidden');
        // $('#yearpicker').removeAttr('hidden', 'hidden');
      } else if (selectedButton === '2'){
        $('.selectPeriode').removeAttr('hidden', 'hidden');
        $('#selectPeriode').removeAttr('hidden', 'hidden');
        $('#cardOutStandingPRperiode').attr('hidden', true);
        $('#cardOutStandingPRnonperiode').attr('hidden', true);
        // $('.year-picker').removeAttr('hidden', 'hidden');
        // $('#yearpicker').removeAttr('hidden', 'hidden');
      } else {
        $('.selectPeriode').attr('hidden', true);
        $('#selectPeriode').attr('hidden', true);
        $('#cardOutStandingPRperiode').attr('hidden', true);
        $('#cardOutStandingPRnonperiode').attr('hidden', true);
        // $('.year-picker').attr('hidden', true);
        // $('#yearpicker').attr('hidden', true);
      }
      console.log('Nilai yang dipilih:', selectedButton);
  }
  onChangeCheck(checkedAll:any){
    if (checkedAll === true) {
      // Saat checkbox "All" dicentang, tambahkan "All" ke dalam selectedUser
      this.selectedUser = 'All';
      $('#cardOutStandingPRperiode').attr('hidden', true);
      $('#cardOutStandingPRnonperiode').attr('hidden', true);
    } else {
      // Saat checkbox "All" tidak dicentang, kosongkan selectedUser
      this.selectedUser = '';
      $('#cardOutStandingPRperiode').attr('hidden', true);
      $('#cardOutStandingPRnonperiode').attr('hidden', true);
    }
    console.log(this.selectedUser)
  }

  getPIC(){
    this.optionListPIC = [];
    this.httpService.getDD3('')
      .subscribe(
        data => {
            const PIC = data.map((item: any) => {
                return {
                    label: item.MC_Desc,
                    value: item.MC_Desc
                };
            });
            this.optionListPIC = PIC;
        },
        error => {
            // Handle error
        }
      );
  }

  selectPeriodDay(days: number) {
    console.log(`Selected period: ${days} days`);
  }

  selectPeriod(years: number) {
    console.log(`Selected period: ${years} years`);
  }

  validateSelectionPeriode(): boolean {
    if(!this.selectedUser) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add User' });
        return false;
    }
    if (!this.selectedPeriode) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
        return false;
    }
    return true;
  }
  validateSelectionWithoutPeriode(): boolean {
    if(!this.selectedUser) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add User' });
        return false;
    }
    return true;
  }

  getDataTablePeriode(){
    var url;
    if (checkUrl()) {
        url = baseUrl + '';
    } else {
        url = baseUrlLuar + '';
    }
    if(this.selectedUser === 'All'){
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPRperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code:'',
          param1:'',
          param2: '',
          param4: '',
          param5: ''
          },
      },
      buttons: [
        {
            extend: 'copy',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'csv',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'print',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        }
      ],
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').attr('hidden', true);
    } else  {
      const selectedUserString = this.selectedUser.join(',');
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPRperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code: '',
          param1: '',
          param3: '',
          param4: '',
          param5: ''
          },
      },
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').attr('hidden', true);
    }
  }
  getDataTablePeriodeApprove(){
    var url;
    if (checkUrl()) {
        url = baseUrl + '';
    } else {
        url = baseUrlLuar + '';
    }
    if(this.selectedUser === 'All'){
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPRperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code: '',
          param1: '',
          param2: '',
          param4: '',
          param5: ''
          },
      },
      buttons: [
        {
            extend: 'copy',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'csv',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'print',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        }
      ],
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').attr('hidden', true);
    } else {
      const selectedUserString = this.selectedUser.join(',');
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPRperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code: '',
          param1: '',
          param3: '',
          param4: '',
          param5: ''
          },
      },
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').attr('hidden', true);
    }
  }
  getDataTableWithoutPeriode(){
    var url;
    if (checkUrl()) {
        url = baseUrl + '';
    } else {
        url = baseUrlLuar + '';
    }
    if(this.selectedUser === 'All'){
      this.dataTable = $('#tabelOutStandingPRnonperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code: '',
          param1: '',
          param2: ''
          },
      },
      buttons: [
        {
            extend: 'copy',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'csv',
            title: function () {
              return 'Outstanding PR';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'print',
            title: function () {
              return 'Outstanding PR';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        }
      ],
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRnonperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').attr('hidden', true);
  } else {
    const selectedUserString = this.selectedUser.join(',');
    this.dataTable = $('#tabelOutStandingPRnonperiode').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
          code: '',
          param1: '',
          param3: ''
          },
      },
      columns: [
          {
          title: 'No BPP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Tanggal Approve',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Department',
          data: ''
          },
          {
          title: 'Kode Barang',
          data: ''
          },
          {
          title: 'Nama Barang',
          data: ''
          },
          {
          title: 'Nama Sub Group',
          data: ''
          },
          {
          title: 'Brand',
          data: ''
          },
          {
          title: 'QTY PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa PR',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Approve 1',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square-fill"></i>';
              } else {
                  return '';
              }
          }
          },
          {
          title: 'Approve 2',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                return '<i class="bi bi-check-square-fill"></i>';
            } else {
                return '';
            }
          }
          },
          {
          title: 'Durasi',
          data: ''
          },
          {
          title: 'Warna Durasi',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'RED') {
                return '<button class="btn btn-danger"><i class="bi bi-hourglass-split"></i></button>';
            } else if (data === 'YELLOW') {
                return ' <button class="btn btn-warning"><i class="bi bi-hourglass-split"></i></button>';
            } else {
                return ' <button class="btn btn-success"><i class="bi bi-hourglass-split"></i></button>';
            }
          }
          },
          {
          title: 'Nama Supplier',
          data: ''
          },
          {
          title: 'Harga Satuan',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Satuan',
          data: ''
          },
          {
          title: 'Tanggal Beli',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              var day = date.getDate().toString().padStart(2, '0');
              var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              var year = date.getFullYear();
              return `${day}/${month}/${year}`;
          }
          },
          {
          title: 'Remark',
          data: ''
          },
          {
          title: 'PIC PR',
          data: ''
          },
      ],
      };
    this.dataTable = $('#tabelOutStandingPRnonperiode').DataTable(this.listdataTable);
    $('#labelOutStandingPR').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRnonperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPRperiode').attr('hidden', true);
  }
  }


  showDataTable() {
    this.configLoading = true
        setTimeout(() => {
          if(this.selectedButton === '1'){
            if(this.validateSelectionPeriode()){
              this.getDataTablePeriode();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
            }
          } else if (this.selectedButton === '2'){
            if(this.validateSelectionPeriode()){
              this.getDataTablePeriodeApprove();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
            }
          } else if (this.selectedButton === '3'){
            if(this.validateSelectionWithoutPeriode()){
              this.getDataTableWithoutPeriode();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please input data!' });
          }
            this.configLoading = false
        }, 500);
  }

}
