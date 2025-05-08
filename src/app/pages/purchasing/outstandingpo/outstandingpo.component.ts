import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { OutstandingPOService } from './outstandingpo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
// import 'datatables.net-dt';
declare var $: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-outstandingpo',
  templateUrl: './outstandingpo.component.html',
  styleUrl: './outstandingpo.component.scss',
  providers: [OutstandingPOService,MessageService]
})
export class OutStandingPOComponent implements OnInit {
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

  buttonOptions: any[] = [{ label: 'Without Periode', value: '2'},{ label: 'Periode', value: '1' }];
  selectedButton: string = '';

  checkAllPIC= '2';

  constructor(private layout: LayoutService, private cdRef: ChangeDetectorRef, private httpService: OutstandingPOService, private httpClient: HttpClient, private messageService: MessageService ) {

  }

  ngOnInit() {
  this.getPIC()
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
    if (selectedButton === '2') {
      $('.selectPeriode').attr('hidden', true);
      $('#selectPeriode').attr('hidden', true);
        $('#cardOutStandingPOperiode').attr('hidden', true);
        $('#cardOutStandingPOnonperiode').attr('hidden', true);
        // $('.year-picker').attr('hidden', true);
        // $('#yearpicker').attr('hidden', true);
      } else if (selectedButton === '1') {
        $('.selectPeriode').removeAttr('hidden', 'hidden');
        $('#selectPeriode').removeAttr('hidden', 'hidden');
        $('#cardOutStandingPOperiode').attr('hidden', true);
        $('#cardOutStandingPOnonperiode').attr('hidden', true);
        // $('.year-picker').removeAttr('hidden', 'hidden');
        // $('#yearpicker').removeAttr('hidden', 'hidden');
      } else {
        $('.selectPeriode').attr('hidden', true);
        $('#selectPeriode').attr('hidden', true);
        $('#cardOutStandingPOperiode').attr('hidden', true);
        $('#cardOutStandingPOnonperiode').attr('hidden', true);
        // $('.year-picker').attr('hidden', true);
        // $('#yearpicker').attr('hidden', true);
      }
      console.log('Nilai yang dipilih:', selectedButton);
  }
  onChangeCheck(checkedAll:any){
    if (checkedAll === true) {
      // Saat checkbox "All" dicentang, tambahkan "All" ke dalam selectedUser
      this.selectedUser = '2';
      $('#cardOutStandingPOperiode').attr('hidden', true);
      $('#cardOutStandingPOnonperiode').attr('hidden', true);
    } else {
      // Saat checkbox "All" tidak dicentang, kosongkan selectedUser
      this.selectedUser = '';
      $('#cardOutStandingPOperiode').attr('hidden', true);
      $('#cardOutStandingPOnonperiode').attr('hidden', true);
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

  getDataTablePeriode(){
    var url;
    if (checkUrl()) {
        url = baseUrl + '';
    } else {
        url = baseUrlLuar + '';
    }
    if(this.selectedUser === '2'){
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPOperiode').DataTable();
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
                return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            title: function () {
              return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'csv',
            title: function () {
              return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            title: function () {
              return 'Outstanding PO';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'print',
            title: function () {
              return 'Outstanding PO';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        }
      ],
      columns: [
          {
          title: 'No OP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              return date.toLocaleDateString('id-ID');
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Approve',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square"></i>';
              } else {
                  return '';
              }
          }
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
          title: 'Satuan Pakai',
          data: ''
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'BTB',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'PIC',
          data: ''
          },
          {
          title: 'Approver',
          data: ''
          }
      ],
      };
    this.dataTable = $('#tabelOutStandingPOperiode').DataTable(this.listdataTable);
    $('#cardOutStandingPOperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPOnonperiode').attr('hidden', true);
    } else  {
      const selectedUserString = this.selectedUser.join(',');
      const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
      const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
      this.firstDate = firstDate;
      this.endDate = endDate;
      this.dataTable = $('#tabelOutStandingPOperiode').DataTable();
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
          param2: '',
          param3: '',
          param4: '',
          param5: ''
          },
      },
      columns: [
          {
          title: 'No OP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              return date.toLocaleDateString('id-ID');
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Approve',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square"></i>';
              } else {
                  return '';
              }
          }
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
          title: 'Satuan Pakai',
          data: ''
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'BTB',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'PIC',
          data: ''
          },
          {
          title: 'Approver',
          data: ''
          }
      ],
      };
    this.dataTable = $('#tabelOutStandingPOperiode').DataTable(this.listdataTable);
    $('#cardOutStandingPOperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPOnonperiode').attr('hidden', true);
    }
  }
  getDataTableWithoutPeriode(){
    var url;
    if (checkUrl()) {
        url = baseUrl + '';
    } else {
        url = baseUrlLuar + '';
    }
    if(this.selectedUser === '2'){
      this.dataTable = $('#tabelOutStandingPOnonperiode').DataTable();
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
                return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'excel',
            title: function () {
              return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'csv',
            title: function () {
              return 'Outstanding PO';
            },
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'pdf',
            title: function () {
              return 'Outstanding PO';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
            extend: 'print',
            title: function () {
              return 'Outstanding PO';
            },
            orientation: 'landscape',
            exportOptions: {
                columns: ':visible'
            }
        }
      ],
      columns: [
          {
          title: 'No OP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              return date.toLocaleDateString('id-ID');
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Approve',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square"></i>';
              } else {
                  return '';
              }
          }
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
          title: 'Satuan Pakai',
          data: ''
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'BTB',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'PIC',
          data: ''
          },
          {
          title: 'Approver',
          data: ''
          }
      ],
      };
    this.dataTable = $('#tabelOutStandingPOnonperiode').DataTable(this.listdataTable);
    $('#cardOutStandingPOnonperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPOperiode').attr('hidden', true);
    } else {
    const selectedUserString = this.selectedUser.join(',');
    this.dataTable = $('#tabelOutStandingPOnonperiode').DataTable();
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
          param2: '',
          param3: ''
          },
      },
      columns: [
        {
          title: 'No OP',
          data: ''
          },
          {
          title: 'Tanggal',
          data: '',
          render: function(data:any, type:any, row:any) {
              var date = new Date(data);
              return date.toLocaleDateString('id-ID');
          }
          // className: 'dt-body-center',
          },
          {
          title: 'Approve',
          data: '',
          className: 'dt-body-center',
          render: function (data: string) {
            if (data === 'Approved') {
                  return '<i class="bi bi-check-square"></i>';
              } else {
                  return '';
              }
          }
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
          title: 'Satuan Pakai',
          data: ''
          },
          {
          title: 'QTY OP',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'BTB',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'Sisa',
          data: '',
          render: $.fn.dataTable.render.number(',', '.' , 2)
          },
          {
          title: 'PIC',
          data: ''
          },
          {
          title: 'Approver',
          data: ''
          }
      ],
      };
    this.dataTable = $('#tabelOutStandingPOnonperiode').DataTable(this.listdataTable);
    $('#cardOutStandingPOnonperiode').removeAttr('hidden', 'hidden');
    $('#cardOutStandingPOperiode').attr('hidden', true);
  }
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
  validateSelection(): boolean {
    if(!this.selectedUser) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add User' });
        return false;
    }
    if(!this.selectedButton) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Data' });
        return false;
  }
    return true;
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
