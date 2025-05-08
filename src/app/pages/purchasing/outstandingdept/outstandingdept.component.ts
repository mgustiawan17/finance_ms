import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { OutstandingDeptService } from './outstandingdept.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';

declare var $: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-outstandingdept',
  templateUrl: './outstandingdept.component.html',
  providers : [OutstandingDeptService, MessageService]
})
export class OutStandingDeptComponent implements OnInit, AfterViewInit {
  @ViewChild('form', { static: true }) form: NgForm;

  activeTab: Tabs = 'Header';
  model: any;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  isChecked: boolean = false;
  selectedBTB: any;
  selectedSupplier: any;
  barang: string = '';
  jumlah: number = 0;
  tableData: any[];
  showTable: any;
  busy: any;
  table: any;
  selectedDepartment: any;
  tableDetail: any;
  informationTable: any;
  informationTableDetail: any;

  selectedDept: any;

  optionListDepartment: any

  checkboxItems = [
    { id: 'filtercustomer', label: 'Rejected', checked: false },
  ];

    constructor(private layout: LayoutService, private cdRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private httpService: OutstandingDeptService,  private httpClient: HttpClient, private messageService: MessageService ) {
    }
    ngOnInit(): void {
        this.model = this.layout.getConfig();
        // $('#datepicker').datepicker();

        this.getDepartment();
    }

    setActiveTab(tab: Tabs) {
        this.activeTab = tab;
    }

    resetPreview(): void {
        this.resetLoading = true;
        this.layout.refreshConfigToDefault();
    }

    ngAfterViewInit() {
        // let table = new DataTable('#tabelOutStandingDept');
    }

    onChangeCheck(isChecked:any){
        if (isChecked === true) {
          $('#cardOutStandingDept').attr('hidden', true);
        } else {
          $('#cardOutStandingDept').attr('hidden', true);
        }
      }

    getDepartment(){
        this.optionListDepartment = [];
        this.httpService.getDD3('','')
          .subscribe(
            data => {
                const department = data.map((item: any) => {
                    return {
                        label: item.NamaDept,
                        value: item.KdDept
                    };
                });
                this.optionListDepartment = department;
            },
            error => {
                // Handle error
            }
          );
    }

    getOutStandingDept() {
        var url;
        if (checkUrl()) {
            url = baseUrl + '';
        } else {
            url = baseUrlLuar + '';
        }
        const value = this.isChecked ? 'rejected' : 'open';
        const selectedDeptString = this.selectedDept.join(',');
        this.table = $("#tabelOutStandingDept").DataTable();
        this.informationTable = {
            destroy: true,
            paging: true,
            scrollY: "50vh",
            scrollX: !0,
            scrollCollapse: !0,
            fixedHeader: {
                header: true,
            },
            lengthMenu: [10, 20, 50, 100, 200],
            dom: 'Bfrltip',
            ajax: {
                url: url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                code: '',
                param1: '',
                param2: '',
                },
            },
            buttons: [
                {
                    extend: 'copy',
                    title: function () {
                        return 'Outstanding Dept';
                    },
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'excel',
                    title: function () {
                        return 'Outstanding Dept';
                    },
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'csv',
                    title: function () {
                        return 'Outstanding Dept';
                    },
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'pdf',
                    title: function () {
                        return 'Outstanding Dept';
                    },
                    orientation: 'landscape',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'print',
                    title: function () {
                        return 'Outstanding Dept';
                    },
                    orientation: 'landscape',
                    exportOptions: {
                        columns: ':visible'
                    }
                }
            ],
            columnDefs: [],
            columns: [
                {
                    title: "NoBPP",
                    data: ""
                },
                {
                    title: "Date",
                    data: "",
                    render: function(data:any, type:any, row:any) {
                        var date = new Date(data);
                        return date.toLocaleDateString('id-ID');
                    }
                },
                {
                    title: "Department",
                    data: ""
                },
                {
                    title: "Approve 1",
                    data: "",
                },
                {
                    title: "Approval 1 Date",
                    data: "",
                    render: function(data:any, type:any, row:any) {
                        var date = new Date(data);
                        return date.toLocaleDateString('id-ID');
                    }
                },
                {
                    title: "Approve 2",
                    data: "",
                },
                {
                    title: "Approval 2 Date",
                    data: "",
                    render: function(data:any, type:any, row:any) {
                        var date = new Date(data);
                        return date.toLocaleDateString('id-ID');
                    }
                },
                {
                    title: "Kode Barang",
                    data: ""
                },
                {
                    title: "Nama Barang",
                    data: ""
                },
                {
                    title: "Satuan",
                    data: ""
                },
                {
                    title: "Qty PR",
                    data: "",
                    render: $.fn.dataTable.render.number(',', '.', 2)
                },
                {
                    title: "Qty OP",
                    data: "",
                    render: $.fn.dataTable.render.number(',', '.', 2)
                },
                {
                    title: "Qty BTB",
                    data: "",
                    render: $.fn.dataTable.render.number(',', '.', 2)
                },
            ],
            // rowCallback: (row: Node, data: any[] | Object, index: number) => {
            // $('td button#detail', row).bind('click', () => {
            //     this.getDetailOutStandingDept(data);
            //     });
            // }
        };
        this.table = $("#tabelOutStandingDept").DataTable(this.informationTable);
        $('#cardOutStandingDept').removeAttr('hidden');
    }

    validateSelection(): boolean {
        if(!this.selectedDept) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
            return false;
        }
        return true;
    }

    showData(){
        this.configLoading = true
        setTimeout(() => {
            if(this.validateSelection()){
                this.getOutStandingDept();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
            }
            this.configLoading = false
        },500);

    }

    getDetailOutStandingDept(result: any) {
            var data = {};
            if (result.someCondition) {
                this.tableDetail = $("#tabelDetailOutStandingDept").DataTable({
                    ajax: {},
                    destroy: true,
                    dom: "Bfrtip",
                    columnDefs: [],
                    buttons: [
                        'copy',
                        {
                            extend: 'excel',
                            title: 'Outstanding Per Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'pdf',
                            title: 'Outstanding Per Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'print',
                            title: 'Outstanding Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'csv',
                            title: 'Outstanding Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        }
                    ],
                    columns: [
                        { title: "Date", data: "" },
                        { title: "Supplier Name", data: "" },
                        { title: "Qty", data: "" },
                        { title: "Unit", data: "" }
                    ],
                    success: function (data: any) {
                    },
                });
            } else {
                this.tableDetail = $("#tabelDetailOutStandingDept").DataTable({
                    ajax: {},
                    destroy: true,
                    dom: "Bfrtip",
                    columnDefs: [],
                    buttons: [
                        'copy',
                        {
                            extend: 'excel',
                            title: 'Outstanding Per Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'pdf',
                            title: 'Outstanding Per Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'print',
                            title: 'Outstanding Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        },
                        {
                            extend: 'csv',
                            title: 'Outstanding Dept (Detail)',
                            orientation: 'Landscape',
                            pageSize: 'A4'
                        }
                    ],
                    columns: [
                        { title: "Date", data: "" },
                        { title: "Supplier Name", data: "" },
                        { title: "Qty", data: "" },
                        { title: "Unit", data: "" }
                    ],
                    success: function (data: any) {
                    },
                }).destroy();
            }
    }

}

