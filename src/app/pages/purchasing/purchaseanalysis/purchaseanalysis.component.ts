import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { NgxSpinnerService } from 'ngx-spinner';
// import DataTable from 'datatables.net-dt';

declare var $: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-purchaseanalysis',
  templateUrl: './purchaseanalysis.component.html',
})
export class PurchaseAnalysisComponent implements OnInit {
  public datePickerValue: Date = new Date()
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  dateRange: any;
  selectedCompany: any;
  selectedGroupsBy: any;
  selectedGroupCodeSubGroup: any;
  barang: string = '';
  jumlah: number = 0;
  showCustomerFilterForm: boolean = false;
  busy: any;
  table: any;
  showTable: any;

  companies: any[] = [
    { id: 1, name: 'Famatex Toha' },
    { id: 2, name: 'Famatex Cipadung' },
    // ...
  ];

  groupcodes_subgroups: any[] = [
    { id: 1, name: 'Fixed Assets-Factory Inventory Assets' },
    { id: 2, name: 'Fixed Assets-Machinery Assets' },
    { id: 3, name: 'Fixed Assets-Project Assets' },
    { id: 4, name: 'Fixed Assets-Fixed Assets' },
    { id: 5, name: 'Yarn-Denim Yarn' },
    { id: 6, name: 'Yarn-Polyester Yarn' },
    { id: 7, name: 'Costs-Costs' },
    { id: 8, name: 'Costs-Technical Equipment Costs' },
    { id: 9, name: 'Costs-Office Supplies Costs' },
    { id: 10, name: 'Costs-Fuel Costs' },
    { id: 11, name: 'Costs-Building Material Costs' },
    { id: 12, name: 'Costs-Pharmaceutical Costs' },
    { id: 13, name: 'Costs-Wastewater Treatment Costs' },
    { id: 14, name: 'Costs-Vehicle Costs' },
    { id: 15, name: 'Costs-Computer Costs' },
    { id: 16, name: 'Costs-Electricity Costs' },
    { id: 17, name: 'Costs-Factory Costs' },
    { id: 18, name: 'Costs-Lubricant Costs' },
    { id: 19, name: 'Costs-Software Maintenance Costs' },
    { id: 20, name: 'Costs-Project Costs' },
    { id: 21, name: 'Costs-Household Costs' },
    { id: 22, name: 'Packaging-Packaging' },
    { id: 23, name: 'Greige-Greige Fabric' },
    { id: 24, name: 'Services-Services' },
    { id: 25, name: 'Services-Vehicle Repair Services' },
    { id: 26, name: 'Services-Spare Parts Repair Services' },
    { id: 27, name: 'Services-Project Services' },
    { id: 28, name: 'Services-Rental Services' },
    { id: 29, name: 'Denim Chemicals-Denim Dye Chemicals' },
    { id: 30, name: 'Denim Chemicals-Denim Auxiliary Chemicals' },
    { id: 31, name: 'Denim Chemicals-Denim Sizing Chemicals' },
    { id: 32, name: 'Chemicals-Dye Chemicals' },
    { id: 33, name: 'Chemicals-Auxiliary Chemicals' },
    { id: 34, name: 'Chemicals-Sizing Chemicals' },
    { id: 35, name: 'Repairs-Repairs' },
    { id: 36, name: 'Repairs-Building Repairs' },
    { id: 37, name: 'Repairs-Vehicle Repairs' },
    { id: 38, name: 'Repairs-IT Device Repairs' },
    { id: 39, name: 'Spare Parts-Spare Parts' },
    { id: 40, name: 'Spare Parts-Bearing Spare Parts' },
    { id: 41, name: 'Spare Parts-Vanbelt Spare Parts' },
    // ...
  ];

  selectedBTB: any;

  constructor(private layout: LayoutService, private cdRef: ChangeDetectorRef, private spinner: NgxSpinnerService ) { }
  ngOnInit(): void {
    this.model = this.layout.getConfig();
    $('#datepicker').datepicker();
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  submitBTBForm(): void {
    console.log('Formulir BTB dikirim:', this.selectedCompany, this.selectedBTB);
    this.showTable = true;
  }

  onDateRangeChange(event: any): void {
    console.log('Date Range:', event);
  }
  
  toggleCustomerFilterForm() {
    this.showCustomerFilterForm = !this.showCustomerFilterForm;
  }
  
  selectPeriodDay(days: number) {
    console.log(`Selected period: ${days} days`);
  }

  selectPeriod(years: number) {
    console.log(`Selected period: ${years} years`);
  }

  tahun() {
    var a = new Date();
    var b = $('#tahun').datepicker({
        todayHighlight: !0,
        autoclose: !0,
        viewMode: "years",
        minViewMode: "years",
        format: "yyyy",
        orientation: "bottom"
    })
    $("#tahun").datepicker().datepicker("setDate", new Date("yyyy"));
  }
  ngAfterViewInit() {
    // let table = new DataTable('#tabelGoodsReceipt');
  }
  getGoodsReceipt() {
    this.spinner.show();
    var data;
    var me = this;
    data = {}
    this.table = $('#tabelGoodsReceipt').DataTable({
      scrollY: "50vh",
      scrollX: !0,
      scrollCollapse: !0,
      paging: false,
      destroy: true,
      columnDefs: [
        { targets: [0], visible: true },
      ],
      buttons: [
        'copy',
        {
          extend: 'excel',
          title: 'Table Goods Receipt',
          orientation: 'Landscape',
          pageSize: 'A4'
        },
        {
          extend: 'pdf',
          title: 'Table Goods Receipt',
          orientation: 'Landscape',
          pageSize: 'A4'
        },
        {
          extend: 'print',
          title: 'Table Goods Receipt',
          orientation: 'Landscape',
          pageSize: 'A4'
        },
        {
          extend: 'csv',
          title: 'Table Goods Receipt',
          orientation: 'Landscape',
          pageSize: 'A4'
        }
      ],
      columns: [
        {
            title: "BTB Date",
            data: ""
        },
        {
            title: "NO OP",
            data: ""
        },
        {
            title: "TOP X CODE",
            data: ""
        },
        {
            title: "BPP CODE",
            data: ""
        },
        {
            title: "SUPPLIER CODE",
            data: ""
        },
        {
            title: "SUPPLIER NAME",
            data: ""
        },
        {
            title: "NO BTB",
            data: ""
        },
        {
            title: "DEPT CODE",
            data: ""
        },
        {
            title: "DEPT NAME",
            data: ""
        },
        {
            title: "ITEM CODE",
            data: ""
        },
        {
            title: "BRAND",
            data: ""
        },
        {
            title: "ITEM NAME",
            data: ""
        },
        {
            title: "GROUP",
            data: ""
        },
        {
            title: "SUB GROUP",
            data: ""
        },
        {
            title: "KEL CODE",
            data: ""
        },
        {
            title: "QTY BTB SB",
            data: ""
        },
        {
            title: "PURCHASE UNIT",
            data: ""
        },
        {
            title: "QTY BTB SP",
            data: ""
        },
        {
            title: "CURRENCY",
            data: ""
        },
        {
            title: "CURS",
            data: ""
        },
        {
            title: "PRICE UNIT",
            data: ""
        },
        {
            title: "CURR PRICE UNIT",
            data: ""
        },
        {
            title: "QC 1",
            data: ""
        },
        {
            title: "DPP VALUE",
            data: ""
        },
        ],
        initComplete: function(settings: any, json: any) {
          me.spinner.hide();
        }
      });
  
      this.busy = this.table = $("#tabelGoodsReceipt").DataTable(this.showTable);
      $('#GoodsReceipt').removeAttr('hidden');
    }
  
    showDataTable() {
      this.showTable = true;
      this.getGoodsReceipt();
    }
}
