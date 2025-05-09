import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { LayoutService } from '../../../_metronic/layout';
import { InventoryUsageService } from './inventoryusage.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { ChartData, ChartConfiguration } from 'chart.js';

let pieChart: typeof Chart | null = null;

declare var $: any;
declare var Chart: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-inventoryusage',
  templateUrl: './inventoryusage.component.html',
  styleUrl: './inventoryusage.component.scss',
  providers: [InventoryUsageService, MessageService],
})
export class InventoryUsageComponent implements OnInit, AfterViewInit {
  activeTab: Tabs = 'Header';
  resetLoading = false;
  messages: Message[] = [];
  rangeDates: Date[] | undefined;
  date: Date[] | undefined;
  year: Date[] | undefined;
  selectedPeriode: Date[] = [];
  selectedMonth: Date = new Date();
  selected1Year: any;
  selected3Year: any;
  selectedType: any;
  selectedQuarter: any;

  listdataTable: any;
  dataTable: any;
  chart: any;
  table: any
  busy: any

  currentCompany: any;
  loading: boolean = false;
  configLoading: boolean = false;
  selectedGroupBy: any;
  groupValue: any[] = [];
  selectedGroup: string[] = [];
  deptValue: any[] = [];
  // selectedDept = [];
  selectedDept: string[] = [];
  lineChart: typeof Chart | null = null;

  isChecked: boolean = false;
  selectedmesin: string = '0';

  chooseData: any[] = [
    { label: 'Periode', value: '0' },
    { label: '1 Y', value: '1' },
    { label: '3 Y', value: '2' },
    { label: 'Q <-> Q', value: '3' },
  ];
  valuechooseData: string = '0';

  ChartTableOptions: any[] = [
    { label: 'Chart', value:'0', icon: 'pi pi-chart-line'},
    { label: 'Table', value:'1', icon: 'pi pi-table'}
  ]
  valueChartTable: string = '1';

  groupby = [
    { name: 'Departement', value: 'Departemen'},
    { name: 'Barang', value: 'Barang'},
  ]

  constructor(
    private el: ElementRef,
    private httpService: InventoryUsageService,
    private layout: LayoutService,
    private messageService: MessageService,
    private http: HttpClient,
    private route: Router,
    private cd: ChangeDetectorRef
  ) {}

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
      this.resetLoading = true;
      this.layout.refreshConfigToDefault();
  }

  ngOnInit(): void {
    this.getDept();
    this.getGroup();
    this.messages = [{ severity: 'info', detail: 'Nilai pada Grafik telah dibagi dengan 1.000.000 untuk kemudahan pembacaan' }];
  }

  ngAfterViewInit() {
    this.handleChange('0');
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  checkUrl(): boolean {
    return true;
  }

  toggleMesin() {
    this.selectedmesin = this.isChecked ? '1' : '0';
    console.log('Checkbox status:', this.isChecked);
    console.log('Nilai selectedmesin:', this.selectedmesin);
  }

  formatDateYear(date: Date): string {
    const year = date.getFullYear();
    return `${year}`;
  }

  formatDate3Year(date: Date): string [] {
  const currentYear = date.getFullYear();
  return [(currentYear - 2).toString(), (currentYear - 1).toString(), currentYear.toString()];
  }

  formatDateMonth(date: Date): { year: string, month: string } {
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return { month, year };
  }

  formatDatePeriode(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onYearChange(event: any): void {
    console.log('Selected Year:', event);
  }

  showChart() {
    if (this.valuechooseData === '0') {
      if (this.valueChartTable === '0') {
        $('#ChartPeriodeNoMesin').removeAttr('hidden');
        $('#Chart1YearDepartement').attr('hidden', 'hidden');
        $('#Table1YearDepartement').attr('hidden', 'hidden');
        $('#Table3YearDepartement').attr('hidden', true);
        $('#TablePeriodeNoMesin').attr('hidden', true);
      } else if (this.valueChartTable === '1') {
        $('#TablePeriodeNoMesin').removeAttr('hidden');
        $('#Chart1YearDepartement').attr('hidden', 'hidden');
        $('#ChartPeriodeNoMesin').attr('hidden', 'hidden');
        $('#Chart3YearDepartement').attr('hidden', true);
        $('#Table1YearDepartement').attr('hidden', true);
      }
    } else if (this.valuechooseData === '1') {
      if (this.valueChartTable === '0') {
        $('#Chart1YearDepartement').removeAttr('hidden');
        $('#Table1YearDepartement').attr('hidden', 'hidden');
        $('#ChartPeriodeNoMesin').attr('hidden', 'hidden');
        $('#Table3YearDepartement').attr('hidden', true);
        $('#TablePeriodeNoMesin').attr('hidden', true);
      } else if (this.valueChartTable === '1') {
        $('#Table1YearDepartement').removeAttr('hidden');
        $('#Chart1YearDepartement').attr('hidden', 'hidden');
        $('#ChartPeriodeNoMesin').attr('hidden', 'hidden');
        $('#Chart3YearDepartement').attr('hidden', true);
      }
    } else if ( this.valuechooseData === '2') {
      if (this.valueChartTable === '0') {
        $('#Chart3YearDepartement').removeAttr('hidden');
        $('#Table3YearDepartement').attr('hidden', 'hidden');
        $('#Chart1YearDepartement').attr('hidden', true);
        $('#TablePeriodeNoMesin').attr('hidden', true);
      } else if (this.valueChartTable === '1') {
        $('#Chart3YearDepartement').attr('hidden', 'hidden');
        $('#ChartPeriodeNoMesin').attr('hidden', 'hidden');
        $('#Table3YearDepartement').removeAttr('hidden');
        $('#Table1YearDepartement').attr('hidden', true);
      }
    } else if ( this.valuechooseData === '3') {
      if (this.valueChartTable === '0') {
        $('#Chart3YearDepartement').attr('hidden', true);
        $('#Table3YearDepartement').attr('hidden', true);
        $('#Chart1YearDepartement').attr('hidden', true);
        $('#TablePeriodeNoMesin').attr('hidden', true);
      } else if (this.valueChartTable === '1') {
        $('#Chart3YearDepartement').attr('hidden', 'hidden');
        $('#ChartPeriodeNoMesin').attr('hidden', 'hidden');
        $('#Table3YearDepartement').removeAttr('hidden');
        $('#Table1YearDepartement').attr('hidden', true);
      }
    } else {
      $('#Chart1YearDepartement').attr('hidden', 'hidden');
      $('#Chart3YearDepartement').attr('hidden', 'hidden');
      $('#Table1YearDepartement').attr('hidden', 'hidden');
      $('#Table3YearDepartement').attr('hidden', 'hidden');
    }
  }

  onGroupChange(event: any): void {
    console.log('Selected Group:', event.value);
  }

  onGroupByChange(selectedGroupBy: string): void {
    console.log('Selected Group:', selectedGroupBy);
    if (this.valuechooseData === '3') {
      if (this.selectedGroupBy === 'Departemen') {
        $('#ChartTable').attr('hidden', true);
      } else if (this.selectedGroupBy === "Barang") {
        $('#ChartTable').attr('hidden', true);
      }
    } else {
      if (this.selectedGroupBy === 'Departemen') {
        $('#ChartTable').removeAttr('hidden');
      } else if (this.selectedGroupBy === "Barang") {
        $('#ChartTable').attr('hidden', true);
      }
    }
  }

  getDept() {
    this.deptValue = [];
    this.httpService.getDEPT('').subscribe(
      data => {
        const department = data.map((item: any) => {
          return {
            label: item.NamaDept,
            value: item.KdDept,
          };
        });
        this.deptValue = department;
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  getGroup() {
    this.groupValue = [];
    this.httpService.getGROUPS('').subscribe(
      data => {
        const group = data.map((item: any) => {
          return {
            label: item.NamaGroup,
            value: item.KdGroup,
          };
        });
        this.groupValue = group;
      },
      error => {
        console.error('Error', error);
      }
    );
  }

  handleChange(newValue: any) {
    if (newValue === '0') {
      $('.1y').attr('hidden', true);
      $('#1y').attr('hidden', true);
      $('.3y').attr('hidden', true);
      $('#3y').attr('hidden', true);
      $('.quarter').attr('hidden', true);
      $('#quarter').attr('hidden', true);
      $('.groupby').attr('hidden', true);
      $('#groupby').attr('hidden', true);
      $('#ChartTable').attr('hidden', true);
      $('#Table1YearDepartement').attr('hidden', true);
      $('#Table1YearBarang').attr('hidden', true);
      $('#Table3YearDepartement').attr('hidden', true);
      $('#Table3YearBarang').attr('hidden', true);
      $('#TableQuartalDepartement').attr('hidden', true);
      $('#TableQuartalBarang').attr('hidden', true);
      $('#Chart1YearDepartement').attr('hidden', true);
      $('#Chart3YearDepartement').attr('hidden', true);
      $('.mesin').removeAttr('hidden');
      $('#mesin').removeAttr('hidden');
      $('.periode').removeAttr('hidden');
      $('#periode').removeAttr('hidden');
      this.selectedDept=[];
      this.selectedGroup=[];
      this.selectedGroupBy=[];
    } else if (newValue === '1') {
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.3y').attr('hidden', true);
      $('#3y').attr('hidden', true);
      $('.quarter').attr('hidden', true);
      $('#quarter').attr('hidden', true);
      $('.mesin').attr('hidden', true);
      $('#mesin').attr('hidden', true);
      $('#TableQuartalDepartement').attr('hidden', true);
      $('#TableQuartalBarang').attr('hidden', true);
      $('#TablePeriodeNoMesin').attr('hidden', true);
      $('#TablePeriodeMesin').attr('hidden', true);
      $('#Table3YearDepartement').attr('hidden', true);
      $('#Table3YearBarang').attr('hidden', true);
      $('#Chart3YearDepartement').attr('hidden', true);
      $('.groupby').removeAttr('hidden');
      $('#groupby').removeAttr('hidden');
      $('.1y').removeAttr('hidden');
      $('#1y').removeAttr('hidden');
      this.selectedDept=[];
      this.selectedGroup=[];
      this.selectedGroupBy=[];
    } else if (newValue === '2') {
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.1y').attr('hidden', true);
      $('#1y').attr('hidden', true);
      $('.quarter').attr('hidden', true);
      $('#quarter').attr('hidden', true);
      $('.mesin').attr('hidden', true);
      $('#mesin').attr('hidden', true);
      $('#TablePeriodeNoMesin').attr('hidden', true);
      $('#TablePeriodeMesin').attr('hidden', true);
      $('#Table1YearDepartement').attr('hidden', true);
      $('#Table1YearBarang').attr('hidden', true);
      $('#TableQuartalDepartement').attr('hidden', true);
      $('#TableQuartalBarang').attr('hidden', true);
      $('#Chart1YearDepartement').attr('hidden', true);
      $('#Chart3YearDepartement').attr('hidden', true);
      $('.3y').removeAttr('hidden');
      $('#3y').removeAttr('hidden');
      $('.groupby').removeAttr('hidden');
      $('#groupby').removeAttr('hidden');
      this.selectedDept=[];
      this.selectedGroup=[];
      this.selectedGroupBy=[];
    } else if (newValue === '3') {
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.1y').attr('hidden', true);
      $('#1y').attr('hidden', true);
      $('.3y').attr('hidden', true);
      $('#3y').attr('hidden', true);
      $('.mesin').attr('hidden', true);
      $('#mesin').attr('hidden', true);
      $('#ChartTable').attr('hidden', true);
      $('#Chart1YearDepartement').attr('hidden', true);
      $('#Chart3YearDepartement').attr('hidden', true);
      $('#Table3YearDepartement').attr('hidden', true);
      $('#Table3YearBarang').attr('hidden', true);
      $('.groupby').removeAttr('hidden');
      $('#groupby').removeAttr('hidden');
      $('.quarter').removeAttr('hidden');
      $('#quarter').removeAttr('hidden');
      this.selectedDept=[];
      this.selectedGroup=[];
      this.selectedGroupBy=[];
    } else {
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.1y').attr('hidden', true);
      $('#1y').attr('hidden', true);
      $('.3y').attr('hidden', true);
      $('#3y').attr('hidden', true);
      $('.mesin').attr('hidden', true);
      $('#mesin').attr('hidden', true);
      $('.quarter').attr('hidden', true);
      $('#quarter').attr('hidden', true);
      $('.groupby').attr('hidden', true);
      $('#groupby').attr('hidden', true);
      $('#ChartTable').attr('hidden', true);
      $('#TablePeriodeNoMesin').attr('hidden', true);
      $('#TablePeriodeMesin').attr('hidden', true);
      $('#Table1YearDepartement').attr('hidden', true);
      $('#Table1YearBarang').attr('hidden', true);
      $('#Table3YearDepartement').attr('hidden', true);
      $('#Table3YearBarang').attr('hidden', true);
      $('#TableQuartalDepartement').attr('hidden', true);
      $('#TableQuartalBarang').attr('hidden', true);
    }
  }

  validateForm(): boolean {
    let isValid = true;

    if (this.valuechooseData === '0' && (!this.selectedPeriode || this.selectedPeriode.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Periode' });
      isValid = false;
    }

    if (this.valuechooseData === '1' && (!this.selected1Year || this.selected1Year.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Year for 1 Year data' });
      isValid = false;
    }

    if (this.valuechooseData === '2' && (!this.selected3Year || this.selected3Year.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Year for 3 Year data' });
      isValid = false;
    }

    if (this.valuechooseData === '3' && (!this.selectedQuarter || this.selectedQuarter.length === 0)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Quarter for Quartal data' });
      isValid = false;
    }

    if (this.valuechooseData !== '0' && !this.valuechooseData) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Choose Data' });
      isValid = false;
    }

    if (this.valuechooseData === '1' || this.valuechooseData === '2' || this.valuechooseData === '3') {
      if (!this.selectedGroupBy || this.selectedGroupBy.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select GroupBy' });
        isValid = false;
      }
    }

    if (!this.selectedDept || this.selectedDept.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one Department' });
      isValid = false;
    }

    if (!this.selectedGroup || this.selectedGroup.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one Group' });
      isValid = false;
    }

    return isValid;
  }

  getTableInventoryPeriode() {
    let url: string;
    let pieChart: typeof Chart | null = null;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);

    const formatPrice = (price: any) => {
      return parseFloat(price).toLocaleString('id-ID');
    }

    const calculateTotal = (column: any, columnIndex: number) => {
      const sum = column.data().reduce((acc: number, curr: string) => {
        const value = parseFloat(curr);
        return isNaN(value) ? acc : acc + value;
      }, 0);

      let total: string;
      if (columnIndex === 5 || columnIndex === 6) {
        total = formatPrice(sum.toFixed(2));
      } else {
        total = sum.toFixed(2);
      }

      $(column.footer()).html(total);

      const theadColumnWidth = $(column.header()).css('width');
      $(column.footer()).css('width', theadColumnWidth);
    };

    if (this.selectedmesin === '0') {
      $('#TablePeriodeMesin').attr('hidden', true);
      $('#TablePeriodeNoMesin').removeAttr('hidden', 'hidden');

      this.listdataTable = {
          destroy: true,
          paging: true,
          scrollY: '60vh',
          scrollX: true,
          scrollCollapse: true,
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
                  param5: '',
                  param6: '',
              },
          },
          columns: [
            { title: 'Product Name', data: '' },
            { title: 'Brand', data: '' },
            { title: 'Sub Group Name', data: '' },
            { title: 'Unit of Use', data: '' },
            { title: 'Qty', data: '' },
            { title: 'Price', data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
            },
            { title: 'Value', data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
            },
          ],
          buttons: [
            {
              extend: 'copy',
              title: 'Inventory Usage Data',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'excel',
              title: 'Inventory Usage Data',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'csv',
              title: 'Inventory Usage Data',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'pdf',
              title: 'Inventory Usage Data',
              orientation: 'landscape',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'print',
              title: 'Inventory Usage Data',
              orientation: 'landscape',
              exportOptions: {
                columns: ':visible'
              }
            }
          ],

        initComplete: function(this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function(this: any) {
              const column = this;
              const columnIndex = column.index();

              const columnWidth = $(column.header()).css('width');
              columnWidths.push(columnWidth);

              if (columnIndex === 6 || columnIndex === 6) {
                  calculateTotal(column, columnIndex);
              }
          });

          $('#TableInventory3YDept tfoot tr th').each(function(this: HTMLElement, index: number) {
              $(this).css('width', columnWidths[index]);
          });

          $('#TableInventory3YDept tbody tr:first-child td').each(function(this: HTMLElement, index: number) {
              const theadColumnWidth = columnWidths[index];
              $(this).css('width', theadColumnWidth);
          });
      }
      };
      this.dataTable = $('#TableInventoryPeriodeNoMesin').DataTable(this.listdataTable);

    } else if (this.selectedmesin === '1') {
        $('#TablePeriodeMesin').removeAttr('hidden', 'hidden');
        $('#TablePeriodeNoMesin').attr('hidden', true);

        this.listdataTable = {
            destroy: true,
            paging: true,
            scrollY: '60vh',
            scrollX: true,
            scrollCollapse: true,
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
                  param5: '',
                  param6: '',
                },
            },
            columns: [
                { title: 'Product Name', data: '' },
                { title: 'Brand', data: '' },
                { title: 'Sub Group Name', data: '' },
                { title: 'Machine Name', data: '' },
                { title: 'Unit of Use', data: '' },
                { title: 'Qty', data: '' },
                { title: 'Price', data: '',
                  render: $.fn.dataTable.render.number(',', '.', 2)
                },
                { title: 'Value', data: '',
                  render: $.fn.dataTable.render.number(',', '.', 2)
                },
              ],
              buttons: [
                {
                  extend: 'copy',
                  title: 'Inventory Usage Data',
                  exportOptions: {
                    columns: ':visible'
                  }
                },
                {
                  extend: 'excel',
                  title: 'Inventory Usage Data',
                  exportOptions: {
                    columns: ':visible'
                  }
                },
                {
                  extend: 'csv',
                  title: 'Inventory Usage Data',
                  exportOptions: {
                    columns: ':visible'
                  }
                },
                {
                  extend: 'pdf',
                  title: 'Inventory Usage Data',
                  orientation: 'landscape',
                  exportOptions: {
                    columns: ':visible'
                  }
                },
                {
                  extend: 'print',
                  title: 'Inventory Usage Data',
                  orientation: 'landscape',
                  exportOptions: {
                    columns: ':visible'
                  }
                }
              ],
            initComplete: function(this: any) {
              const api = this.api();

              const columnWidths: string[] = [];

              api.columns().every(function(this: any) {
                  const column = this;
                  const columnIndex = column.index();

                  const columnWidth = $(column.header()).css('width');
                  columnWidths.push(columnWidth);

                  if (columnIndex === 7 || columnIndex === 7) {
                      calculateTotal(column, columnIndex);
                  }
              });

              setTimeout(function(){
                $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
              }, 350);
          }
        };
        this.dataTable = $('#TableInventoryPeriodeMesin').DataTable(this.listdataTable);
    }
  }

  getTableInventory1Y() {
    let url: string;
    let lineChart: typeof Chart | null = null;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    const formatPrice = (price: any) => {
      return parseFloat(price).toLocaleString('id-ID');
    }

    const calculateTotal = (column: any, columnIndex: number) => {
      const sum = column
          .data()
          .reduce((acc: number, curr: string) => {
              const value = parseFloat(curr);
              return isNaN(value) ? acc : acc + value;
          }, 0);

        let total: string;
        if (columnIndex >=2 && columnIndex <= 35) {
            total = formatPrice(sum.toFixed(2));
        } else {
            total = sum.toFixed(2);
        }

        $(column.footer()).html(total);

        const theadColumnWidth = $(column.header()).css('width');
        $(column.footer()).css('width', theadColumnWidth);
    };

    const initializeLineChart = (labels: string[], departmentData: number[][]) => {
      const canvas = document.getElementById('myLineChart') as HTMLCanvasElement | null;
      if (!canvas) {
          console.error('Canvas element not found');
          return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          console.error('Unable to get canvas context');
          return;
      }

      if (lineChart) {
          lineChart.destroy();
          lineChart = null;
      }

      const colorsWithOpacity = [
        '#DF1A56', '#EE2743', '#F15F22', '#FAA71D', '#FDE500',
        '#93C83E', '#5FBB47', '#9C3E97', '#33AC71', '#0D6B4B',
        '#35CBE5', '#00A1E9', '#3B7DDD', '#0054A5', '#783F8E',
        '#612F83', '#A6093D', '#D5245A', '#D23061', '#F24277'
      ];

      const datasets = departmentData.map((data, index) => {
        const color = colorsWithOpacity[index % colorsWithOpacity.length];
        const opacity = '33';
        const rgbaColor = color + opacity;
        return {
          label: labels[index],
          data: data.map((value) => value / 1000000), // Membagi nilai dengan jutaan
          fill: true,
          borderColor: color,
          backgroundColor: rgbaColor,
          borderWidth: 2,
        };
      });

      const chartData = {
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          datasets: datasets
      };

      lineChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  title: {
                      display: true,
                      text: `Inventory Summary by Department`
                  }
              }
          }
      });
    };

    const completeCallback = (json: any) => {
      if (json && json.data) {
          const data = json.data;
          if (Array.isArray(data) && data.length > 0) {
              const departmentData: number[][] = [];
              const labels: string[] = [];
              for (let i = 0; i < data.length; i++) {
                  const department = data[i];
                  const departmentValues: number[] = [];
                  for (let j = 2; j <= 13; j++) {
                      departmentValues.push(parseFloat(department[Object.keys(department)[j]]));
                  }
                  departmentData.push(departmentValues);
                  labels.push(department.NamaDept);
              }
              initializeLineChart(labels, departmentData);
          } else {
              console.error('Data received is empty or not an array');
          }
      } else {
          console.error('Invalid response received from the server');
      }
    };

    if (this.selectedGroupBy === 'Departemen') {
      const yearDate = this.formatDateYear(this.selected1Year);
      this.dataTable = $('#TableInventory1YDept').DataTable();
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
            param5: '',
            param6: '',
          },
      },
      columns: [
        { title: 'KODE DEPT', data: '' },
        { title: 'NAMA DEPT', data: '' },
        { title: 'JAN', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'FEB', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'MAR', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'APR', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'MAY', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'JUN', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'JUL', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'AUG', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'SEP', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'OCT', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'NOV', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'DEC', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'TOTAL', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
        { title: 'AVG', data: '',
          render: $.fn.dataTable.render.number(',', '.', 2)
        },
      ],
      buttons: [
        {
          extend: 'copy',
          title: 'Inventory Usage Data',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'excel',
          title: 'Inventory Usage Data',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'csv',
          title: 'Inventory Usage Data',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'pdf',
          title: 'Inventory Usage Data',
          orientation: 'landscape',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'print',
          title: 'Inventory Usage Data',
          orientation: 'landscape',
          exportOptions: {
            columns: ':visible'
          }
        }
      ],
      initComplete: function (this: any) {
        const api = this.api();

        const columnWidths: string[] = [];

        api.columns().every(function (this: any) {
          const column = this;
          const columnIndex = column.index();

          const columnWidth = $(column.header()).css('width');
          columnWidths.push(columnWidth);

          if (columnIndex >= 2 && columnIndex <= 14) {
            calculateTotal(column, columnIndex);
          }
        });

        $('#TableInventory1YDept tfoot tr th').each(function (
          this: HTMLElement,
          index: number
        ) {
          $(this).css('width', columnWidths[index]);
        });

        $('#TableInventory1YDept tbody tr:first-child td').each(function (
          this: HTMLElement,
          index: number
        ) {
          const theadColumnWidth = columnWidths[index];
          $(this).css('width', theadColumnWidth);
        });

        setTimeout(function(){
          $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        }, 350);

        completeCallback(api.ajax.json());
      },
    };
      this.busy = this.table = $('#TableInventory1YDept').DataTable(this.listdataTable);
      $('#Table1YearDepartement').removeAttr('hidden', 'hidden');
      $('#Table1YearBarang').attr('hidden', true);

    } else if (this.selectedGroupBy === 'Barang') {
      const yearDate = this.formatDateYear(this.selected1Year);
      this.dataTable = $('#TableInventory1YBrg').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: true,
        scrollCollapse: true,
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
            param5: '',
            param6: '',
          },
        },
        columns: [
          { title: 'ITEM CODE', data: '' },
          { title: 'NAMA BARANG', data: '' },
          { title: 'BRAND', data: '' },
          { title: 'SUBGROUP NAME', data: '' },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'TOTAL QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'TOTAL NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'AVG QTY', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
          { title: 'AVG NILAI', data: '',
            render: $.fn.dataTable.render.number(',', '.', 2)
          },
        ],
        buttons: [
          {
            extend: 'copy',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'excel',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csv',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdf',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function (this: any) {
            const column = this;
            const columnIndex = column.index();

            const columnWidth = $(column.header()).css('width');
            columnWidths.push(columnWidth);

            if (columnIndex >= 2 && columnIndex <= 14) {
              calculateTotal(column, columnIndex);
            }
          });

          $('#TableInventory1YDept tfoot tr th').each(function (
            this: HTMLElement,
            index: number
          ) {
            $(this).css('width', columnWidths[index]);
          });

          $('#TableInventory1YDept tbody tr:first-child td').each(function (
            this: HTMLElement,
            index: number
          ) {
            const theadColumnWidth = columnWidths[index];
            $(this).css('width', theadColumnWidth);
          });

          setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          }, 350);

          completeCallback(api.ajax.json());
        },
      };
      this.busy = this.table = $('#TableInventory1YBrg').DataTable(this.listdataTable);
      $('#Table1YearDepartement').attr('hidden', true);
      $('#Table1YearBarang').removeAttr('hidden', 'hidden');
    }
  }

  generateColumns3YDept(years: string[]): object[] {
    const formatPrice = (price: any): string => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const columns: {
      title: string;
      data: string;
      render?: (data: any, type: any, row: any) => string | number;
    }[] = [
          { title: 'DEPT CODE', data: '' },
          { title: 'NAME DEPT', data: '' }
          ];

    years.forEach((year) => {
      columns.push({
        title: `${year}`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
    });

    return columns;
  }

  generateColumns3YBrg(years: string[]): object[] {
    const formatPrice = (price: any): string => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const columns: {
      title: string;
      data: string;
      render?: (data: any, type: any, row: any) => string | number;
    }[] = [
      { title: 'ITEM CODE', data: '' },
      { title: 'ITEM NAME', data: '' },
      { title: 'BRAND', data: '' },
    ];

    years.forEach((year) => {
      columns.push({
        title: `QTY`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `NILAI`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
    });

    return columns;
  }

  private createTableHeaders3Y(years: string[]): string {
    let headerRow1 =
      '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">ITEM CODE</th><th rowspan="2" style="text-align: center; vertical-align: middle;">ITEM NAME</th><th rowspan="2" style="text-align: center; vertical-align: middle;">BRAND</th>';
    let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
    years.forEach((year) => {
      headerRow1 += `<th colspan="2" style="text-align: center;">${year}</th>`;
      headerRow2 += `<th style="text-align: center;">N ${year}</th><th style="text-align: center;">Q ${year}</th>`;
    });
    headerRow1 += '</tr>';
    headerRow2 += '</tr>';

    return headerRow1 + headerRow2;
  }

  initialize3YLineChart(
    years: string[],
    departmentLabels: string[],
    departmentData: number[][]
  ) {
    const canvas = document.getElementById(
      'LineChart3Y'
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context');
      return;
    }
    const clearChart = () => {
      if (this.lineChart) {
        this.lineChart.destroy();
        this.lineChart = null;
      }
    };

    clearChart();

    const colorsWithOpacity = [
      '#DF1A56',
      '#EE2743',
      '#F15F22',
      '#FAA71D',
      '#FDE500',
      '#93C83E',
      '#5FBB47',
      '#9C3E97',
      '#33AC71',
      '#0D6B4B',
      '#35CBE5',
      '#00A1E9',
      '#3B7DDD',
      '#0054A5',
      '#783F8E',
      '#612F83',
      '#A6093D',
      '#D5245A',
      '#D23061',
      '#F24277',
    ];

    const formatToIDR = (value: any) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2
      }).format(value);
    };

    const datasets = departmentData.map((data, index) => {
      const color = colorsWithOpacity[index % colorsWithOpacity.length];
      const opacity = '33';
      const rgbaColor = color + opacity;
      return {
        label: departmentLabels[index],
        data: data.map((value) => value / 1000000),
        fill: true,
        borderColor: color,
        backgroundColor: rgbaColor,
        borderWidth: 2,
      };
    });

    const chartData: ChartData<'line'> = {
      labels: years,
      datasets: datasets,
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Inventory Summary by Department',
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value: any) {
                return formatToIDR(value); // Memformat nilai di sumbu y ke IDR
              },
            },
          },
        },
      },
    };

    this.lineChart = new Chart(ctx, config);
  }

  getTableInventory3Y() {
    let url: string;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    const formatPrice = (price: any): string => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const calculateTotal = (column: any, columnIndex: number) => {
      const sum = column.data().reduce((acc: number, curr: string) => {
        const value = parseFloat(curr);
        return isNaN(value) ? acc : acc + value;
      }, 0);

      let total: string;
      if (columnIndex >= 2 && columnIndex <= 10) {
        total = formatPrice(sum.toFixed(2));
      } else {
        total = sum.toFixed(2);
      }

      $(column.footer()).html(total);

      const theadColumnWidth = $(column.header()).css('width');
      $(column.footer()).css('width', theadColumnWidth);
    };

    const completeCallback = (json: any) => {
      if (json && json.data) {
        const data = json.data;
        if (Array.isArray(data) && data.length > 0) {
          const departmentData: number[][] = [];
          const departmentLabels: string[] = [];
          const years = this.formatDate3Year(this.selected3Year);

          data.forEach((department: any) => {
            const departmentValues: number[] = years.map((year) =>
              parseFloat(department[`N${year}`])
            );
            departmentData.push(departmentValues);
            departmentLabels.push(department.NamaDept);
          });

          this.initialize3YLineChart(years, departmentLabels, departmentData);
        } else {
          console.error('Data received is empty or not an array');
        }
      } else {
        console.error('Invalid response received from the server');
      }
    };

    if (this.selectedGroupBy === 'Departemen') {
      const years = this.formatDate3Year(this.selected3Year);
      const columns = this.generateColumns3YDept(years);
      this.dataTable = $('#TableInventory3YDept').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: true,
        scrollCollapse: true,
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
            param5: '',
            param6: '',
          },
        },
        columns: columns,
        buttons: [
          {
            extend: 'copy',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'excel',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csv',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdf',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function (this: any) {
            const column = this;
            const columnIndex = column.index();

            const columnWidth = $(column.header()).css('width');
            columnWidths.push(columnWidth);

            if (columnIndex >= 2 && columnIndex <= 10) {
              calculateTotal(column, columnIndex);
            }
          });

          $('#TableInventory3YDept tfoot tr th').each(function (
            this: HTMLElement,
            index: number
          ) {
            $(this).css('width', columnWidths[index]);
          });

          $('#TableInventory3YDept tbody tr:first-child td').each(function (
            this: HTMLElement,
            index: number
          ) {
            const theadColumnWidth = columnWidths[index];
            $(this).css('width', theadColumnWidth);
          });

          setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          }, 350);

          completeCallback(api.ajax.json());
        },
      };

      this.busy = this.table = $('#TableInventory3YDept').DataTable(
        this.listdataTable
      );
      $('#Table3YearDepartement').removeAttr('hidden', 'hidden');
      $('#Table3YearBarang').attr('hidden', true);
    } else if (this.selectedGroupBy === 'Barang') {
      const years = this.formatDate3Year(this.selected3Year);
      const columns = this.generateColumns3YBrg(years);
      const theadElement = document.querySelector('#TableInventory3YBrg thead');
      if (theadElement) {
        theadElement.innerHTML = this.createTableHeaders3Y(years);
      }
      this.dataTable = $('#TableInventory3YBrg').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: true,
        scrollCollapse: true,
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
            param5: '',
            param6: '',
          },
        },
        columns: columns,
        buttons: [
          {
            extend: 'copy',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'excel',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csv',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdf',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function (this: any) {
            const column = this;
            const columnIndex = column.index();

            const columnWidth = $(column.header()).css('width');
            columnWidths.push(columnWidth);

            if (columnIndex >= 3 && columnIndex <= 10) {
              calculateTotal(column, columnIndex);
            }
          });

          $('#TableInventory3YBrg tfoot tr th').each(function (
            this: HTMLElement,
            index: number
          ) {
            $(this).css('width', columnWidths[index]);
          });

          $('#TableInventory3YBrg tbody tr:first-child td').each(function (
            this: HTMLElement,
            index: number
          ) {
            const theadColumnWidth = columnWidths[index];
            $(this).css('width', theadColumnWidth);
          });

          setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          }, 350);
        },
      };
      this.busy = this.table = $('#TableInventory3YBrg').DataTable(
        this.listdataTable
      );
      $('#Table3YearDepartement').attr('hidden', true);
      $('#Table3YearBarang').removeAttr('hidden', 'hidden');
    }
  }

  generateColumnsQuartalDept(years: string[]): object[] {
    const formatPrice = (price: any) => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const columns: {
      title: string;
      data: string;
      render?: (data: any, type: any, row: any) => string | number;
    }[] = [
      { title: 'DEPT CODE', data: '' },
      { title: 'DEPT NAME', data: '' },
    ];

    years.forEach((year) => {
      columns.push({
        title: `Q 1`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `Q 2`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `Q 3`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `Q 4`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
    });
    return columns;
  }

  generateColumnsQuartalBrg(years: string[]): object[] {
    const formatPrice = (price: any) => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const columns: {
      title: string;
      data: string;
      render?: (data: any, type: any, row: any) => string | number;
    }[] = [
      { title: 'ITEM CODE', data: '' },
      { title: 'ITEM NAME', data: '' },
      { title: 'BRAND', data: '' },
    ];

    years.forEach((year) => {
      columns.push({
        title: `NILAI 1`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `NILAI 2`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `NILAI 3`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `NILAI 4`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `QTY1`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `QTY2`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `QTY3`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
      columns.push({
        title: `QTY4`,
        data: ``,
      render: $.fn.dataTable.render.number(',', '.', 2)
      });
    });

    return columns;
  }

  private createTableHeadersQuartalDept(years: string[]): string {
    let headerRow1 =
      '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">DEPT CODE</th><th rowspan="2" style="text-align: center; vertical-align: middle;">NAME CODE</th>';
    let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
    years.forEach((year) => {
      headerRow1 += `<th colspan="4" style="text-align: center;">${year}</th>`;
      headerRow2 += `<th style="text-align: center;">N1 ${year}</th>
                       <th style="text-align: center;">N2 ${year}</th>
                       <th style="text-align: center;">N3 ${year}</th>
                       <th style="text-align: center;">N4 ${year}</th>`;
    });
    headerRow1 += '</tr>';
    headerRow2 += '</tr>';

    return headerRow1 + headerRow2;
  }

  private createTableHeadersQuartalBrg(years: string[]): string {
    let headerRow1 =
      '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">ITEM CODE</th><th rowspan="2" style="text-align: center; vertical-align: middle;">ITEM NAME</th><th rowspan="2" style="text-align: center; vertical-align: middle;">BRAND</th>';
    let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
    years.forEach((year) => {
      headerRow1 += `<th colspan="8" style="text-align: center;">${year}</th>`;
      headerRow2 += `<th style="text-align: center;">N1 ${year}</th><th style="text-align: center;">N2 ${year}</th><th style="text-align: center;">N3 ${year}</th><th style="text-align: center;">N4 ${year}</th>
                       <th style="text-align: center;">Q1 ${year}</th><th style="text-align: center;">Q2 ${year}</th><th style="text-align: center;">Q3 ${year}</th><th style="text-align: center;">Q4 ${year}</th>`;
    });
    headerRow1 += '</tr>';
    headerRow2 += '</tr>';

    return headerRow1 + headerRow2;
  }

  getTableInventoryQuartal() {
    let url: string;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    const formatPrice = (price: any) => {
      return parseFloat(price).toLocaleString('id-ID');
    };

    const calculateTotal = (column: any, columnIndex: number) => {
      const sum = column.data().reduce((acc: number, curr: string) => {
        const value = parseFloat(curr);
        return isNaN(value) ? acc : acc + value;
      }, 0);

      let total: string;
      if (columnIndex >= 2 && columnIndex <= 26) {
        total = formatPrice(sum.toFixed(2));
      } else {
        total = sum.toFixed(2);
      }

      $(column.footer()).html(total);

      const theadColumnWidth = $(column.header()).css('width');
      $(column.footer()).css('width', theadColumnWidth);
    };

    if (this.selectedGroupBy === 'Departemen') {
      const years = this.formatDate3Year(this.selectedQuarter);
      const columns = this.generateColumnsQuartalDept(years);

      const theadElement = document.querySelector(
        '#TableInventoryQuartalDept thead'
      );
      if (theadElement) {
        theadElement.innerHTML = this.createTableHeadersQuartalDept(years);
      }

      this.dataTable = $('#TableInventoryQuartalDept').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: true,
        scrollCollapse: true,
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
            param5: '',
            param6: '',
          },
        },
        columns: columns,
        buttons: [
          {
            extend: 'copy',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'excel',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csv',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdf',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function (this: any) {
            const column = this;
            const columnIndex = column.index();

            const columnWidth = $(column.header()).css('width');
            columnWidths.push(columnWidth);

            if (columnIndex >= 2 && columnIndex <= 13) {
              calculateTotal(column, columnIndex);
            }
          });

          $('#TableInventoryQuartalDept tfoot tr th').each(function (
            this: HTMLElement,
            index: number
          ) {
            $(this).css('width', columnWidths[index]);
          });

          $('#TableInventoryQuartalDept tbody tr:first-child td').each(
            function (this: HTMLElement, index: number) {
              const theadColumnWidth = columnWidths[index];
              $(this).css('width', theadColumnWidth);
            }
          );

          setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          }, 350);
        },
      };
      this.busy = this.table = $('#TableInventoryQuartalDept').DataTable(
        this.listdataTable
      );
      $('#TableQuartalDepartement').removeAttr('hidden', 'hidden');
      $('#TableQuartalBarang').attr('hidden', true);
      $('#TablePeriodeNoMesin').attr('hidden', true);
      $('#TablePeriodeMesin').attr('hidden', true);
      $('#Table1YearDepartement').attr('hidden', true);
      $('#Table3YearDepartement').attr('hidden', true);
    } else if (this.selectedGroupBy === 'Barang') {
      const years = this.formatDate3Year(this.selectedQuarter);
      const columns = this.generateColumnsQuartalBrg(years);

      const theadElement = document.querySelector(
        '#TableInventoryQuartalBrg thead'
      );
      if (theadElement) {
        theadElement.innerHTML = this.createTableHeadersQuartalBrg(years);
      }

      this.dataTable = $('#TableInventoryQuartalBrg').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: true,
        scrollCollapse: true,
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
            param5: '',
            param6: '',
          },
        },
        columns: columns,
        buttons: [
          {
            extend: 'copy',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'excel',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csv',
            title: 'Inventory Usage Data',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdf',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            title: 'Inventory Usage Data',
            orientation: 'landscape',
            exportOptions: {
              columns: ':visible'
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api();

          const columnWidths: string[] = [];

          api.columns().every(function (this: any) {
            const column = this;
            const columnIndex = column.index();

            const columnWidth = $(column.header()).css('width');
            columnWidths.push(columnWidth);

            if (columnIndex >= 3 && columnIndex <= 26) {
              calculateTotal(column, columnIndex);
            }
          });

          $('#TableInventoryQuartalBrg tfoot tr th').each(function (
            this: HTMLElement,
            index: number
          ) {
            $(this).css('width', columnWidths[index]);
          });

          $('#TableInventoryQuartalBrg tbody tr:first-child td').each(function (
            this: HTMLElement,
            index: number
          ) {
            const theadColumnWidth = columnWidths[index];
            $(this).css('width', theadColumnWidth);
          });

          setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          }, 350);
        },
      };
      this.busy = this.table = $('#TableInventoryQuartalBrg').DataTable(
        this.listdataTable
      );
      $('#TableQuartalDepartement').attr('hidden', true);
      $('#TableQuartalBarang').removeAttr('hidden', 'hidden');
    }
  }

  showDataTable() {
    if (!this.validateForm()) {
      return;
    }
    this.configLoading = true;
    setTimeout(() => {
      this.configLoading = false;
      if (this.valuechooseData === '0') {
        this.getTableInventoryPeriode();
        $('#ChartPeriodeNoMesin').attr('hidden', true);
        $('#Chart1YearDepartement').attr('hidden', true);
        $('#Chart3YearDepartement').attr('hidden', true);

      } else if (this.valuechooseData === '1') {
        if (this.selectedGroupBy === 'Departemen') {
          if (this.valueChartTable === '0') {
            this.getTableInventory1Y();
            $('#Table1YearDepartement').removeAttr('hidden', 'hidden');
            $('#Chart1YearDepartement').removeAttr('hidden', 'hidden');
            $('#Table1YearDepartement').attr('hidden', true);
          } else if (this.valueChartTable === '1') {
            this.getTableInventory1Y();
            $('#Chart1YearDepartement').attr('hidden', true);
            $('#Chart3YearDepartement').attr('hidden', true);
            $('#ChartPeriodeNoMesin').attr('hidden', true);
          }
          $('#Table3YearBarang').attr('hidden', true);
          $('#ChartTable').removeAttr('hidden');
        } else if (this.selectedGroupBy === 'Barang') {
          this.getTableInventory1Y();
          $('#Table1YearBarang').removeAttr('hidden', 'hidden');
          $('#Chart1YearDepartement').attr('hidden', true);
          $('#Chart1YearDepartement').attr('hidden', true);
          $('#ChartTable').attr('hidden', true);
        }
      } else if (this.valuechooseData === '2') {
        if (this.selectedGroupBy === 'Departemen') {
          if (this.valueChartTable === '0') {
            this.getTableInventory3Y();
            $('#Table3YearDepartement').removeAttr('hidden', 'hidden');
            $('#Chart3YearDepartement').removeAttr('hidden', 'hidden');
            $('#Table3YearDepartement').attr('hidden', true);
          } else if (this.valueChartTable === '1') {
            this.getTableInventory3Y();
            $('#Chart1YearDepartement').attr('hidden', true);
            $('#Chart3YearDepartement').attr('hidden', true);
            $('#ChartPeriodeNoMesin').attr('hidden', true);
          }
          $('#Table3YearBarang').attr('hidden', true);
          $('#ChartTable').removeAttr('hidden');
        } else if (this.selectedGroupBy === 'Barang') {
          this.getTableInventory3Y();
          $('#Table3YearBarang').removeAttr('hidden', 'hidden');
          $('#Table3YearDepartement').attr('hidden', true);
          $('#Chart3YearDepartement').attr('hidden', true);
          $('#ChartTable').attr('hidden', true);
        }
      } else if (this.valuechooseData === '3') {
        this.getTableInventoryQuartal();
      }
    }, 500);
  }
}
