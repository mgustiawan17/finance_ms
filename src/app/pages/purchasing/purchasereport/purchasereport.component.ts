import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, Input,ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { PurchasereportService } from './purchasereport.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MultiSelect } from 'primeng/multiselect';
import { end } from '@popperjs/core';
import { ChartData, ChartConfiguration } from 'chart.js';
import { ajax } from 'jquery';
declare var $: any;
declare var Chart: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-purchasereport',
  templateUrl: './purchasereport.component.html',
  providers: [PurchasereportService,MessageService],
  styleUrl: './purchasereport.component.scss'
})
export class PurchaseReportComponent implements OnInit, AfterViewInit {
  public datePickerValue: Date = new Date()
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('multiSelect') multiSelect!: MultiSelect;
  displayModal1: boolean = false;
  displayModal2: boolean = false;
  displayModal3: boolean = false;
  displayModal4: boolean = false;
  displayModal5: boolean = false;
  configLoading : boolean = false;
  resetLoading = false;
  messages: Message[] = [];
  dateRange: any;
  selectedGroupBy: any;
  selectedDept: any;
  selectedItemGroup: any;
  selectedButton: any;
  selectedPeriode: any;
  selectedYear: any;
  selectedModel: any;
  selectedDetail: any;
  selectedValueItem1: any;
  selectedValueItem2: any;
  selectedValueItem3: any;
  selectedValueItem4: any;
  selectedValueItem5: any;
  barang: string = '';
  kode: string;
  nama: string;
  jumlah: number = 0;
  showCustomerFilterForm = false;
  showGradeForm = true;
  busy: any;
  table: any;
  showTable: any;
  years: number[];
  tempYear1: any
  tempYear2: any
  tempYear3: any
  optionListDepartmentHR: any
  optionListGroupBy: any
  optionListItemGroup: any
  dataChart: any;
  listdataChart: any;
  dataTable: any;
  listdataTable: any;
  dataTableD: any;
  listdataTableD: any;
  currentGroupCode: any;
  firstDate: any;
  endDate: any;
  yearDate: any;
  yearDate1: any;
  yearDate2: any;
  KdGroup: any;

  kdDeptData: string[] = [];
  items: any[] = [];
  cols: any[] = [];

  buttonOptions: any[] = [{ label: 'Periode', value: '0'},{ label: '1Y', value: '1' },{ label: '3Y', value: '2'},{ label: 'Q <-> Q', value: '3'}];
  valuebuttonOptions: string = '';

  modelOptions: any[] = [{icon:'pi pi-table', label: ' Tabel', value: '1'},{icon:'pi pi-chart-bar', label: ' Chart', value: '2'}]
  valuemodelOptions: string = '1';

  selectedDropdownLogs: any[] = [];

  selectedBTB: any;

  selectedData: any;
  selectedOption: any;

  lineChart: typeof Chart | null = null;


  constructor(
    private layout: LayoutService,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private httpService: PurchasereportService,
    private httpClient: HttpClient,
    private messageService: MessageService) {
    this.currentGroupCode = localStorage.getItem("currentGroupCode");
    }

    ngOnInit() {
        this.getGroupBy();
        this.getItemGroup();
        this.getDepartment();
        this.defaultView();

        this.messages = [{ severity: 'info', detail: 'Nilai pada Grafik telah dibagi dengan 1.000.000 untuk kemudahan pembacaan' }];
    }

    setActiveTab(tab: Tabs) {
        this.activeTab = tab;
    }

    resetPreview(): void {
        this.resetLoading = true;
        this.layout.refreshConfigToDefault();
    }

    ngAfterViewInit() {

    }

    formatDatePeriode(date: Date): string {
        // Ubah format tanggal menjadi "yyyy-mm-dd"
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Tambahkan leading zero jika perlu
        const day = ('0' + date.getDate()).slice(-2); // Tambahkan leading zero jika perlu
        return `${year}-${month}-${day}`;
    }
    formatDateYear(date: Date): string{
        // Ubah format tanggal menjadi "yyyy-mm-dd"
        const year = date.getFullYear();
        return `${year}`;
    }
    formatDateYearMinus1(date: Date): string {
        // Ubah format tanggal menjadi "yyyy-mm-dd"
        const year = date.getFullYear() - 1;
        return `${year}`;
    }
    formatDateYearMinus2(date: Date): string {
        // Ubah format tanggal menjadi "yyyy-mm-dd"
        const year = date.getFullYear() - 2;
        return `${year}`;
    }
    formatDate3YearforChart(date: Date): string [] {
        const currentYear = date.getFullYear();
        return [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
    }

    onChangeButton(selectedButton: string){
        this.selectedButton = selectedButton
        if (selectedButton === '0') {
            $('.selectPeriode').removeAttr('hidden', 'hidden');
            $('#selectPeriode').removeAttr('hidden', 'hidden');
            $('.year-picker').attr('hidden', true);
            $('#yearpicker').attr('hidden', true);
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
            $('#pilihmodel').attr('hidden', true);
            $('.PilihModel').attr('hidden', true);
          } else if (selectedButton === '1') {
            $('.selectPeriode').attr('hidden', true);
            $('#selectPeriode').attr('hidden', true);
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            $('.year-picker').removeAttr('hidden', 'hidden');
            $('#yearpicker').removeAttr('hidden', 'hidden');
            this.valuemodelOptions = '1'
            $('#pilihmodel').removeAttr('hidden', 'hidden');
            $('.PilihModel').removeAttr('hidden', 'hidden');
          } else if (selectedButton === '2'){
            $('.selectPeriode').attr('hidden', true);
            $('#selectPeriode').attr('hidden', true);
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            $('.year-picker').removeAttr('hidden', 'hidden');
            $('#yearpicker').removeAttr('hidden', 'hidden');
            this.valuemodelOptions = '1'
            $('#pilihmodel').removeAttr('hidden', 'hidden');
            $('.PilihModel').removeAttr('hidden', 'hidden');
          } else if (selectedButton === '3'){
            $('.selectPeriode').attr('hidden', true);
            $('#selectPeriode').attr('hidden', true);
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            $('.year-picker').removeAttr('hidden', 'hidden');
            $('#yearpicker').removeAttr('hidden', 'hidden');
            this.valuemodelOptions = '1'
            $('#pilihmodel').attr('hidden', true);
            $('.PilihModel').attr('hidden', true);
          } else {
            $('.selectPeriode').attr('hidden', true);
            $('#selectPeriode').attr('hidden', true);
            $('.year-picker').attr('hidden', true);
            $('#yearpicker').attr('hidden', true);
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            $('#pilihmodel').attr('hidden', true);
            $('.PilihModel').attr('hidden', true);
            this.valuemodelOptions = '1'
          }
          console.log('Nilai yang dipilih:', selectedButton);
    }

    getGroupBy(){
        this.optionListGroupBy = '';
        this.httpService.getDD1('',this.currentGroupCode)
          .subscribe(
            data => {
                const groupby = data.map((item: any) => {
                    return {
                        label: item.Nama,
                        value: item.Kode
                    };
                });
                this.optionListGroupBy = groupby;
            },
            error => {
                // Handle error
            }
          );
    }
    onChangeGroupBy(selectedGroupBy: any) {
        this.selectedGroupBy = selectedGroupBy;
        if (selectedGroupBy === 'KdGroup' || selectedGroupBy === 'KdGroup+KdSubgroup' || selectedGroupBy === 'KdDept') {
            $('#pilihdata').removeAttr('hidden', 'hidden');
            $('.ItemGroup').removeAttr('hidden', 'hidden');
            $('#itemgroup').removeAttr('hidden', 'hidden');
            $('.PilihData').removeAttr('hidden', 'hidden');
            $('.Department').removeAttr('hidden', 'hidden');
            $('#department').removeAttr('hidden', 'hidden');
            $('#cardtable41').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
        } else if (selectedGroupBy === 'KdBrg' ){
            $('#pilihdata').removeAttr('hidden', 'hidden');
            $('.ItemGroup').removeAttr('hidden', 'hidden');
            $('#itemgroup').removeAttr('hidden', 'hidden');
            $('.PilihData').removeAttr('hidden', 'hidden');
            $('.Department').removeAttr('hidden', 'hidden');
            $('#department').removeAttr('hidden', 'hidden');
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
        } else if (selectedGroupBy === 'KdSupp' || selectedGroupBy === 'Supp') {
            $('#pilihdata').removeAttr('hidden', 'hidden');
            $('.PilihData').removeAttr('hidden', 'hidden');
            $('#department').attr('hidden', true);
            $('.Department').attr('hidden', true);
            $('#itemgroup').attr('hidden', true);
            $('.ItemGroup').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
        } else if (selectedGroupBy === 'NoGroup') {
            $('#pilihdata').removeAttr('hidden', 'hidden');
            $('.PilihData').removeAttr('hidden', 'hidden');
            $('#yearpicker').attr('hidden', true);
            $('.year-picker').attr('hidden', true);
            $('#department').attr('hidden', true);
            $('.Department').attr('hidden', true);
            $('#itemgroup').attr('hidden', true);
            $('.ItemGroup').attr('hidden', true);
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
        } else {
            $('#pilihdata').removeAttr('hidden', 'hidden');
            $('.ItemGroup').removeAttr('hidden', 'hidden');
            $('#itemgroup').removeAttr('hidden', 'hidden');
            $('.PilihData').removeAttr('hidden', 'hidden');
            $('.Department').removeAttr('hidden', 'hidden');
            $('#department').removeAttr('hidden', 'hidden');
            $('.table-main').attr('hidden', true);
            $('.chart-main').attr('hidden', true);
            this.valuemodelOptions = '1'
        }
        // console.log('Nilai yang dipilih:', selectedGroupBy);
    }

    getItemGroup(){
        this.optionListItemGroup = '';
        this.httpService.getDD3('')
          .subscribe(
            data => {
                const itemgroup = data.map((item: any) => {
                    return {
                        label: item.NamaGroup,
                        value: item.KdGroup
                    };
                });
                this.optionListItemGroup = itemgroup;
            },
            error => {
                // Handle error
            }
          );
    }

    getDepartment(){
        this.optionListDepartmentHR = [];
        this.httpService.getDD3('')
          .subscribe(
            data => {
                const department = data.map((item: any) => {
                    return {
                        label: item.NamaDept,
                        value: item.KdDept
                    };
                });
                this.optionListDepartmentHR = department;
            },
            error => {
                // Handle error
            }
          );
    }

    generateColumnsQuartalKdGroup(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Group', data: '' },
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalKdGroup(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Group</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="4" style="text-align: center;"></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }
    generateColumnsQuartalSubGroup(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Sub Group', data: 'NamaSubGroup' },
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ` `,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalSubGroup(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Sub Group</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="4" style="text-align: center;"></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }
    generateColumnsQuartalBarang(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Barang', data: '' },
          { title: 'Brand', data: '' },
          { title: 'Nama Sub Group', data: '' },
          { title: 'UOM', data: '' }
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `Q 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `Q 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `Q 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `Q 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalBarang(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Barang</th><th rowspan="2" style="text-align: center; vertical-align: middle;">Brand</th><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Sub Group</th><th rowspan="2" style="text-align: center; vertical-align: middle;">UOM</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="8" style="text-align: center;"></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }
    generateColumnsQuartalDept(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Department', data: '' },
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalDept(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Department</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="4" style="text-align: center;"></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }
    generateColumnsQuartalSupp(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Supplier', data: '' },
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalSupp(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Supplier</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="4" style="text-align: center;"></th></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }
    generateColumnsQuartalSuppGroup(years: string[]): object[] {
        const formatPrice = (price: any) => {
          return parseFloat(price).toLocaleString('en-US');
        };

        const columns: {
          title: string;
          data: string;
          render?: (data: any, type: any, row: any) => string | number;
        }[] = [
          { title: 'Nama Supplier', data: '' },
          { title: 'Nama Sub Group', data: '' },
        ];

        years.forEach((year) => {
          columns.push({
            title: `N 1`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 2`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 3`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
          columns.push({
            title: `N 4`,
            data: ``,
            render: (data: any, type: string): string | number => {
              if (type === 'display' || type === 'filter') {
                return formatPrice(data);
              }
              return data;
            },
          });
        });
        return columns;
    }
    private createTableHeadersQuartalSuppGroup(years: string[]): string {
        let headerRow1 =
          '<tr class="fw-bold" style="text-align: center;"><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Supplier</th><th rowspan="2" style="text-align: center; vertical-align: middle;">Nama Sub Group</th>';
        let headerRow2 = '<tr class="fw-bold" style="text-align: center;">';
        years.forEach((year) => {
          headerRow1 += `<th colspan="4" style="text-align: center;"></th>`;
          headerRow2 += `<th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>
                           <th style="text-align: center;"></th>`;
        });
        headerRow1 += '</tr>';
        headerRow2 += '</tr>';

        return headerRow1 + headerRow2;
    }


    getDataTablePeriode(){
        var url;
            if (checkUrl()) {
                url = baseUrl + '';
            } else {
                url = baseUrlLuar + '';
            }
                if(this.selectedOption === 'KdGroup'){
                    const selectedDeptString = this.selectedDept.join(',');
                    const selectedItemGroupString = this.selectedItemGroup.join(',');
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeGroupBarang').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    colReorder: true,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: selectedDeptString,
                        param3: selectedItemGroupString,
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Action',
                        data: null,
                        className: 'dt-body-center',
                        render: function (t:any) {
                            // tslint:disable-next-line: max-line-length
                            return '<button class="btn btn-info btn-sm detail-btn1">Detail</button>';
                        }
                        },
                        {
                        title: 'Nama Group',
                        data: 'NamaGroup'
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(2).footer()).html(
                            api.column(2).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(2).footer()).html(
                            numFormat(total)
                        );
                    },
                    rowCallback: (row: Node, data: any[] | Object, index: number) => {
                        $('.detail-btn1', row).bind('click', () => {
                            if (data && typeof data === 'object' && 'KdGroup' in data) {
                                this.selectedValueItem1 = data;
                                const kdGroup = this.selectedValueItem1.KdGroup;
                                this.getDetail1(kdGroup);
                                this.displayModal1 = true;
                            } else {
                                console.error('Invalid data format or KdGroup not found:', data);
                            }
                        });
                    }
                    };
                    this.dataTable = $('#TablePeriodeGroupBarang').DataTable(this.listdataTable);
                    $('.table-main').removeAttr('hidden', 'hidden');
                    $('.chart-main').removeAttr('hidden', 'hidden');
                    $('#cardtable1').removeAttr('hidden', 'hidden');
                    $('#cardtable3').attr('hidden', true);
                    $('#cardtable4').attr('hidden', true);
                    $('#cardtable2').attr('hidden', true);
                    $('#cardtable5').attr('hidden', true);
                    $('#cardtable6').attr('hidden', true);
                    $('#cardtable7').attr('hidden', true);

                    $('#cardtable11').attr('hidden', true);
                    $('#cardtable13').attr('hidden', true);
                    $('#cardtable14').attr('hidden', true);
                    $('#cardtable12').attr('hidden', true);
                    $('#cardtable15').attr('hidden', true);
                    $('#cardtable16').attr('hidden', true);
                    $('#cardtable17').attr('hidden', true);

                    $('#cardtable21').attr('hidden', true);
                    $('#cardtable23').attr('hidden', true);
                    $('#cardtable24').attr('hidden', true);
                    $('#cardtable22').attr('hidden', true);
                    $('#cardtable25').attr('hidden', true);
                    $('#cardtable26').attr('hidden', true);
                    $('#cardtable27').attr('hidden', true);

                    $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'KdGroup+KdSubgroup'){
                    const selectedDeptString = this.selectedDept.join(',');
                    const selectedItemGroupString = this.selectedItemGroup.join(',');
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeSubGroupBarang').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: selectedDeptString,
                        param3: selectedItemGroupString,
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Action',
                        data: null,
                        className: 'dt-body-center',
                        render: function (t:any) {
                            // tslint:disable-next-line: max-line-length
                            return '<button class="btn btn-info btn-sm detail-btn2">Detail</button>';
                        }
                        },
                        {
                        title: 'Nama Sub Group',
                        data: 'NamaSubGroup'
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(2).footer()).html(
                            api.column(2).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(2).footer()).html(
                            numFormat(total)
                        );
                    },
                    rowCallback: (row: Node, data: any[] | Object, index: number) => {
                        $('.detail-btn2', row).bind('click', () => {
                            if (data && typeof data === 'object' && 'SubGroup' in data) {
                            this.selectedValueItem2 = data;
                            const kdSubGroup = this.selectedValueItem2.SubGroup;
                            this.getDetail2(kdSubGroup);
                            this.displayModal2 = true;
                            console.log(this.selectedValueItem2)
                            } else {
                            console.error('Invalid data format or KdSubGroup not found:', data);
                            }
                        });
                        }
                    };
                this.dataTable = $('#TablePeriodeSubGroupBarang').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable2').removeAttr('hidden', 'hidden');
                $('#cardtable1').attr('hidden', true);
                $('#cardtable3').attr('hidden', true);
                $('#cardtable4').attr('hidden', true);
                $('#cardtable5').attr('hidden', true);
                $('#cardtable6').attr('hidden', true);
                $('#cardtable7').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'KdDept'){
                    const selectedDeptString = this.selectedDept.join(',');
                    const selectedItemGroupString = this.selectedItemGroup.join(',');
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeDepartment').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: selectedDeptString,
                        param3: selectedItemGroupString,
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Action',
                        data: null,
                        className: 'dt-body-center',
                        render: function (t:any) {
                            // tslint:disable-next-line: max-line-length
                            return '<button class="btn btn-info btn-sm detail-btn3">Detail</button>';
                        }
                        },
                        {
                        title: 'Nama Department',
                        data: 'NamaDept'
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(2).footer()).html(
                            api.column(2).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(2).footer()).html(
                            numFormat(total)
                        );
                    },
                    rowCallback: (row: Node, data: any[] | Object, index: number) => {
                        $('.detail-btn3', row).bind('click', () => {
                            if (data && typeof data === 'object' && 'KdDept' in data) {
                                this.selectedValueItem3 = data;
                                const kdDept = this.selectedValueItem3.KdDept;
                                this.getDetail3(kdDept);
                                this.displayModal3 = true;
                            } else {
                                console.error('Invalid data format or KdDept not found:', data);
                            }
                        });
                    },
                    };
                this.dataTable = $('#TablePeriodeDepartment').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable4').removeAttr('hidden', 'hidden');
                $('#cardtable5').attr('hidden', true);
                $('#cardtable6').attr('hidden', true);
                $('#cardtable7').attr('hidden', true);
                $('#cardtable1').attr('hidden', true);
                $('#cardtable2').attr('hidden', true);
                $('#cardtable3').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'KdBrg') {
                    const selectedDeptString = this.selectedDept.join(',');
                    const selectedItemGroupString = this.selectedItemGroup.join(',');
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeBarang').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: selectedDeptString,
                        param3: selectedItemGroupString,
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Nama Barang',
                        data: 'NamaBrg'
                        },
                        {
                        title: 'Brand',
                        data: 'Brand',
                        className: 'dt-body-center',
                        },
                        {
                        title: 'Nama Sub Group',
                        data: 'NamaSubGroup',
                        className: 'dt-body-center',
                        },
                        {
                        title: 'Satuan Beli',
                        data: 'SatuanBeli',
                        className: 'dt-body-center',
                        },
                        {
                        title: 'QTY',
                        data: 'QTY',
                        className: 'dt-body-center',
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(5).footer()).html(
                            api.column(5).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(5).footer()).html(
                            numFormat(total)
                        );
                    },
                    };
                this.dataTable = $('#TablePeriodeBarang').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable3').removeAttr('hidden', 'hidden');
                $('#cardtable4').attr('hidden', true);
                $('#cardtable5').attr('hidden', true);
                $('#cardtable6').attr('hidden', true);
                $('#cardtable7').attr('hidden', true);
                $('#cardtable1').attr('hidden', true);
                $('#cardtable2').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'KdSupp') {
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeSupplier').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: '',
                        param3: '',
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Nama Supplier',
                        data: 'NamaSupp'
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(1).footer()).html(
                            api.column(1).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(1).footer()).html(
                            numFormat(total)
                        );
                    },
                    };
                this.dataTable = $('#TablePeriodeSupplier').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable5').removeAttr('hidden', 'hidden');
                $('#cardtable3').attr('hidden', true);
                $('#cardtable4').attr('hidden', true);
                $('#cardtable6').attr('hidden', true);
                $('#cardtable7').attr('hidden', true);
                $('#cardtable1').attr('hidden', true);
                $('#cardtable2').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'Supp') {
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeSupplierGroupBarang').DataTable();
                    this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: '',
                        param3: '',
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Nama Supplier',
                        data: 'NamaSupp'
                        },
                        {
                        title: 'Nama Sub Group',
                        data: 'NamaSubgroup'
                        },
                        {
                        title: 'DPP',
                        data: 'DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(2).footer()).html(
                            api.column(2).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(2).footer()).html(
                            numFormat(total)
                        );
                    },
                    };
                this.dataTable = $('#TablePeriodeSupplierGroupBarang').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable6').removeAttr('hidden', 'hidden');
                $('#cardtable5').attr('hidden', true);
                $('#cardtable3').attr('hidden', true);
                $('#cardtable4').attr('hidden', true);
                $('#cardtable7').attr('hidden', true);
                $('#cardtable1').attr('hidden', true);
                $('#cardtable2').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                } else if (this.selectedOption === 'NoGroup') {
                    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
                    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
                    this.firstDate = firstDate;
                    this.endDate = endDate;
                    this.dataTable = $('#TablePeriodeNoGrouping').DataTable();
                    // this.dataTable.destroy();
                    this.listdataTable = {
                    destroy: true,
                    paging: true,
                    scrollY: '60vh',
                    scrollX: !0,
                    scrollCollapse: !0,
                    dom: 'Bfrltip',
                    lengthMenu: [10, 20, 50, 100, 200, 500],
                    ajax: {
                        url: url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                        code: 14,
                        param1: this.selectedOption,
                        param2: '',
                        param3: '',
                        param4: firstDate,
                        param5: endDate
                        },
                    },
                    buttons: [
                      {
                          extend: 'copy',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'excel',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'csv',
                          title: function () {
                            return 'Purchase Report';
                          },
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'pdf',
                          title: function () {
                            return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      },
                      {
                          extend: 'print',
                          title: function () {
                              return 'Purchase Report';
                          },
                          orientation: 'landscape',
                          exportOptions: {
                              columns: ':visible'
                          }
                      }
                    ],
                    columns: [
                        {
                        title: 'Tahun',
                        data: 'THN'
                        },
                        {
                        title: 'Tanggal BTB',
                        data: 'TGLBTB',
                        render: function(data:any, type:any, row:any) {
                            var date = new Date(data);
                            var day = date.getDate().toString().padStart(2, '0');
                            var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                            var year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        }
                        },
                        {
                        title: 'No BTB',
                        data: 'NoBTB'
                        },
                        {
                        title: 'No OP',
                        data: 'NoOP'
                        },
                        {
                        title: 'No BPP',
                        data: 'NoBPP'
                        },
                        {
                        title: 'Nama Supplier',
                        data: 'NamaSupp'
                        },
                        {
                        title: 'Nama Department',
                        data: 'NamaDept'
                        },
                        {
                        title: 'Kode Barang',
                        data: 'KdBrg'
                        },
                        {
                        title: 'Brand',
                        data: 'Brand'
                        },
                        {
                        title: 'Nama Barang',
                        data: 'NamaBrg'
                        },
                        {
                        title: 'Nama Group',
                        data: 'NamaGroup'
                        },
                        {
                        title: 'Nama Sub Group',
                        data: 'NamaSubGroup'
                        },
                        {
                        title: 'DPP',
                        data: 'Nilai_DPP',
                        className: 'dt-body-right',
                        render: $.fn.dataTable.render.number(',', '.', 2)
                        },
                    ],
                    footerCallback: function (tfoot: any, data: any, start: any, end: any, display: any) {
                        var api = this.api();
                        var total;
                        $(api.column(12).footer()).html(
                            api.column(12).data().reduce(function (a: any, b: any) {
                            return total = a + b;
                            }, 0)
                        );
                        var numFormat = $.fn.dataTable.render.number(',', '.', 2, '').display;
                        $(api.column(12).footer()).html(
                            numFormat(total)
                        );
                    },
                    };
                this.dataTable = $('#TablePeriodeNoGrouping').DataTable(this.listdataTable);
                $('.table-main').removeAttr('hidden', 'hidden');
                $('.chart-main').removeAttr('hidden', 'hidden');
                $('#cardtable7').removeAttr('hidden', 'hidden');
                $('#cardtable6').attr('hidden', true);
                $('#cardtable5').attr('hidden', true);
                $('#cardtable3').attr('hidden', true);
                $('#cardtable4').attr('hidden', true);
                $('#cardtable1').attr('hidden', true);
                $('#cardtable2').attr('hidden', true);

                $('#cardtable11').attr('hidden', true);
                $('#cardtable13').attr('hidden', true);
                $('#cardtable14').attr('hidden', true);
                $('#cardtable12').attr('hidden', true);
                $('#cardtable15').attr('hidden', true);
                $('#cardtable16').attr('hidden', true);
                $('#cardtable17').attr('hidden', true);

                $('#cardtable21').attr('hidden', true);
                $('#cardtable23').attr('hidden', true);
                $('#cardtable24').attr('hidden', true);
                $('#cardtable22').attr('hidden', true);
                $('#cardtable25').attr('hidden', true);
                $('#cardtable26').attr('hidden', true);
                $('#cardtable27').attr('hidden', true);

                $('#cardtable41').attr('hidden', true);
                }
    }
    getDataTable1Year(){
        var url;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002_AjaxCall';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
        }

            const calculateTotal = (column: any, columnIndex: number) => {
                const sum = column
                .data()
                .reduce((acc: number, curr: string) => {
                    const value = parseFloat(curr);
                    return isNaN(value) ? acc : acc + value;
                }, 0);

                const formattedSum = sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                $(column.footer()).html(formattedSum);
            };
            const initializeLineChart = (labels: string[], purchaseData: number[][]) => {
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

                clearChart();

                const colorsWithOpacity = [
                    '#DF1A56', '#EE2743', '#F15F22', '#FAA71D', '#FDE500',
                    '#93C83E', '#5FBB47', '#9C3E97', '#33AC71', '#0D6B4B',
                    '#35CBE5', '#00A1E9', '#3B7DDD', '#0054A5', '#783F8E',
                    '#612F83', '#A6093D', '#D5245A', '#D23061', '#F24277'
                ];

                const datasets = purchaseData.map((data, index) => {
                    const color = colorsWithOpacity[index % colorsWithOpacity.length];
                    const opacity = '33';
                    const rgbaColor = color + opacity;
                    return {
                        label: labels[index],
                        data: data,
                        fill: true,
                        borderColor: color,
                        backgroundColor: rgbaColor,
                        borderWidth: 2
                    }
                });

                const chartData = {
                    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                    datasets: datasets
                };

                this.lineChart = new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context:any) => {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += context.parsed.y.toLocaleString('en-US');
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    callback: (value:any) => {
                                        return value.toLocaleString('en-US');
                                    }
                                }
                            }
                        }
                    }
                });
            };

            const showChartKdGroup = (json: any) => {
                if (json && json.data) {
                    const data = json.data;
                    if (Array.isArray(data) && data.length > 0) {
                        const purchaseData: number[][] = [];
                        const labels: string[] = [];
                        for (let i = 0; i < data.length; i++) {
                            const purchase = data[i];
                            const purchaseValues: number[] = [];
                            for (let j = 2; j <= 13; j++) {
                                purchaseValues.push(parseFloat(purchase[Object.keys(purchase)[j]]) / 1000000);
                            }
                            purchaseData.push(purchaseValues);
                            labels.push(purchase.NamaGroup);
                        }
                        initializeLineChart(labels, purchaseData);
                    } else {
                        console.error('Data received is empty or not an array');
                        clearChart();
                    }
                } else {
                    console.error('Invalid response received from the server');
                    clearChart();
                }
            };
            const showChartKdSubGroup = (json: any) => {
                if (json && json.data) {
                    const data = json.data;
                    if (Array.isArray(data) && data.length > 0) {
                        const purchaseData: number[][] = [];
                        const labels: string[] = [];
                        for (let i = 0; i < data.length; i++) {
                            const purchase = data[i];
                            const purchaseValues: number[] = [];
                            for (let j = 2; j <= 13; j++) {
                                purchaseValues.push(parseFloat(purchase[Object.keys(purchase)[j]]) / 1000000);
                            }
                            purchaseData.push(purchaseValues);
                            labels.push(purchase.NamaSubGroup);
                        }
                        initializeLineChart(labels, purchaseData);
                    } else {
                        console.error('Data received is empty or not an array');
                        clearChart();
                    }
                } else {
                    console.error('Invalid response received from the server');
                    clearChart();
                }
            };
            const showChartKdDept = (json: any) => {
                if (json && json.data) {
                    const data = json.data;
                    if (Array.isArray(data) && data.length > 0) {
                        const purchaseData: number[][] = [];
                        const labels: string[] = [];
                        for (let i = 0; i < data.length; i++) {
                            const purchase = data[i];
                            const purchaseValues: number[] = [];
                            for (let j = 2; j <= 13; j++) {
                                purchaseValues.push(parseFloat(purchase[Object.keys(purchase)[j]]) / 1000000);
                            }
                            purchaseData.push(purchaseValues);
                            labels.push(purchase.NamaDept);
                        }
                        initializeLineChart(labels, purchaseData);
                    } else {
                        console.error('Data received is empty or not an array');
                        clearChart();
                    }
                } else {
                    console.error('Invalid response received from the server');
                    clearChart();
                }
            };

            const clearChart = () => {
                if (this.lineChart) {
                    this.lineChart.destroy();
                    this.lineChart = null;
                }

                const canvas = document.getElementById('myLineChart') as HTMLCanvasElement | null;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
            };

            if(this.selectedOption === 'KdGroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearGroupBarang').DataTable();
                this.dataTable.destroy();
                this.listdataTable = {
                destroy: true,
                paging: true,
                scrollY: '50vh',
                scrollX: !0,
                scrollCollapse: !0,
                dom: 'Bfrltip',
                lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                ajax: {
                    url: url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                    code: 16,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Group',
                    data: 'NamaGroup'
                    },
                    {
                    title: 'Jan',
                    data: 'JAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Feb',
                    data: 'FEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Mar',
                    data: 'MAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Apr',
                    data: 'APR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'May',
                    data: 'MAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jun',
                    data: 'JUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jul',
                    data: 'JUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Aug',
                    data: 'AUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Sep',
                    data: 'SEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Oct',
                    data: 'OCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Nov',
                    data: 'NOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Dec',
                    data: 'DEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total',
                    data: 'TOTAL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                    showChartKdGroup(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableOneYearGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable11').removeAttr('hidden', 'hidden');
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);
            } else if (this.selectedOption === 'KdGroup+KdSubgroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearSubGroupBarang').DataTable();
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
                    code: 16,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Sub Group',
                    data: 'NamaSubGroup'
                    },
                    {
                    title: 'Jan',
                    data: 'JAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Feb',
                    data: 'FEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Mar',
                    data: 'MAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Apr',
                    data: 'APR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'May',
                    data: 'MAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jun',
                    data: 'JUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jul',
                    data: 'JUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Aug',
                    data: 'AUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Sep',
                    data: 'SEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Oct',
                    data: 'OCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Nov',
                    data: 'NOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Dec',
                    data: 'DEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total',
                    data: 'TOTAL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                    showChartKdSubGroup(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableOneYearSubGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable12').removeAttr('hidden', 'hidden');
            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);
            } else if (this.selectedOption === 'KdDept'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearDepartment').DataTable();
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
                    code: 16,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Department',
                    data: 'NamaDept'
                    },
                    {
                    title: 'Jan',
                    data: 'JAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Feb',
                    data: 'FEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Mar',
                    data: 'MAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Apr',
                    data: 'APR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'May',
                    data: 'MAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jun',
                    data: 'JUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jul',
                    data: 'JUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Aug',
                    data: 'AUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Sep',
                    data: 'SEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Oct',
                    data: 'OCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Nov',
                    data: 'NOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Dec',
                    data: 'DEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total',
                    data: 'TOTAL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                    showChartKdDept(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableOneYearDepartment').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable14').removeAttr('hidden', 'hidden');
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);
            } else if (this.selectedOption === 'KdBrg') {
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearBarang').DataTable();
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
                    code: 16,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Barang',
                    data: 'NamaBrg'
                    },
                    {
                    title: 'Brand',
                    data: 'Brand',
                    className: 'dt-body-center',
                    },
                    {
                    title: 'Nama Sub Group',
                    data: 'NamaSubGroup',
                    className: 'dt-body-center',
                    },
                    {
                    title: 'Satuan Beli',
                    data: 'SatuanBeli',
                    className: 'dt-body-center',
                    },
                    {
                    title: 'QJan',
                    data: 'QJAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NJan',
                    data: 'NJAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QFeb',
                    data: 'QFEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NFeb',
                    data: 'NFEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QMar',
                    data: 'QMAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NMar',
                    data: 'NMAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QApr',
                    data: 'QAPR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NApr',
                    data: 'NAPR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QMay',
                    data: 'QMAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NMay',
                    data: 'NMAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QJun',
                    data: 'QJUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NJun',
                    data: 'NJUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QJul',
                    data: 'QJUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NJul',
                    data: 'NJUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QAug',
                    data: 'QAUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NAug',
                    data: 'NAUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QSep',
                    data: 'QSEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NSep',
                    data: 'NSEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QOct',
                    data: 'QOCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NOct',
                    data: 'NOCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QNov',
                    data: 'QNOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                     {
                    title: 'NNov',
                    data: 'NNOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'QDec',
                    data: 'QDEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'NDec',
                    data: 'NDEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total QTY',
                    data: 'TOTALQTY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total Nilai',
                    data: 'TOTALNILAI',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=4 && columnIndex <= 29) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                  }
                };
            this.dataTable = $('#TableOneYearBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable13').removeAttr('hidden', 'hidden');
            $('#cardtable14').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            } else if (this.selectedOption === 'KdSupp') {
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearSupplier').DataTable();
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
                    code: 16,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Supplier',
                    data: 'NamaSupp'
                    },
                    {
                    title: 'Jan',
                    data: 'JAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Feb',
                    data: 'FEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Mar',
                    data: 'MAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Apr',
                    data: 'APR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'May',
                    data: 'MAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jun',
                    data: 'JUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jul',
                    data: 'JUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Aug',
                    data: 'AUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Sep',
                    data: 'SEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Oct',
                    data: 'OCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Nov',
                    data: 'NOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Dec',
                    data: 'DEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total',
                    data: 'TOTAL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                  }
                };
            this.dataTable = $('#TableOneYearSupplier').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable15').removeAttr('hidden', 'hidden');
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            } else if (this.selectedOption === 'Supp') {
                const yearDate = this.formatDateYear(this.selectedYear);
                this.yearDate = yearDate;
                this.dataTable = $('#TableOneYearSupplierGroupBarang').DataTable();
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
                    code: 16,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Supplier',
                    data: 'NamaSupp'
                    },
                    {
                    title: 'Nama Sub Group',
                    data: 'NamaSubgroup'
                    },
                    {
                    title: 'Jan',
                    data: 'JAN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Feb',
                    data: 'FEB',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Mar',
                    data: 'MAR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Apr',
                    data: 'APR',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'May',
                    data: 'MAY',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jun',
                    data: 'JUN',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Jul',
                    data: 'JUL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Aug',
                    data: 'AUG',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Sep',
                    data: 'SEP',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Oct',
                    data: 'OCT',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Nov',
                    data: 'NOV',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Dec',
                    data: 'DEC',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Total',
                    data: 'TOTAL',
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                  }
                };
            this.dataTable = $('#TableOneYearSupplierGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable16').removeAttr('hidden', 'hidden');
            $('#cardtable15').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            $('#cardtable27').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            }
    }
    getDataTable3Year(){

        var url;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002_AjaxCall';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
        }
            const calculateTotal = (column: any, columnIndex: number) => {
                const sum = column
                .data()
                .reduce((acc: number, curr: string) => {
                    const value = parseFloat(curr);
                    return isNaN(value) ? acc : acc + value;
                }, 0);

                const formattedSum = sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                $(column.footer()).html(formattedSum);
            };
            const initializeLineChart = (years: string[], labels: string[], purchaseData: number[][]) => {
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

                if (this.lineChart) {
                    this.lineChart.destroy();
                    this.lineChart = null;
                }

                const colorsWithOpacity = [
                    '#DF1A56', '#EE2743', '#F15F22', '#FAA71D', '#FDE500',
                    '#93C83E', '#5FBB47', '#9C3E97', '#33AC71', '#0D6B4B',
                    '#35CBE5', '#00A1E9', '#3B7DDD', '#0054A5', '#783F8E',
                    '#612F83', '#A6093D', '#D5245A', '#D23061', '#F24277'
                ];

            const datasets = purchaseData.map((data, index) => {
                const color = colorsWithOpacity[index % colorsWithOpacity.length];
                const opacity = '33';
                const rgbaColor = color + opacity;
                return {
                    label: labels[index],
                    data: data,
                    fill: true,
                    borderColor: rgbaColor,
                    backgroundColor: rgbaColor,
                    borderWidth: 2
                };
            });

            const chartData = {
                labels: years,
                datasets: datasets,
              };

              this.lineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    }
                }
                });
            };
            const showChartKdGroup = (json: any) => {
                if (json && json.data) {
                  const data = json.data;
                  if (Array.isArray(data) && data.length > 0) {
                    const purchaseData: number[][] = [];
                    const purchaseLabels: string[] = [];
                    const years = this.formatDate3YearforChart(this.selectedYear);

                    data.forEach((purchase: any) => {
                      const purchaseValues: number[] = years.map(year => parseFloat(purchase[`N${year}`]) / 1000000);
                      purchaseData.push(purchaseValues);
                      purchaseLabels.push(purchase.NamaGroup);
                    });

                    initializeLineChart(years, purchaseLabels, purchaseData);
                  } else {
                    console.error('Data received is empty or not an array');
                    clearChart();
                  }
                } else {
                  console.error('Invalid response received from the server');
                  clearChart();
                }
            };
            const showChartKdSubGroup = (json: any) => {
                if (json && json.data) {
                  const data = json.data;
                  if (Array.isArray(data) && data.length > 0) {
                    const purchaseData: number[][] = [];
                    const purchaseLabels: string[] = [];
                    const years = this.formatDate3YearforChart(this.selectedYear);

                    data.forEach((purchase: any) => {
                      const purchaseValues: number[] = years.map(year => parseFloat(purchase[`N${year}`]) / 1000000);
                      purchaseData.push(purchaseValues);
                      purchaseLabels.push(purchase.NamaSubGroup);
                    });

                    initializeLineChart(years, purchaseLabels, purchaseData);
                  } else {
                    console.error('Data received is empty or not an array');
                    clearChart();
                  }
                } else {
                  console.error('Invalid response received from the server');
                  clearChart();
                }
            };
            const showChartKdDept = (json: any) => {
                if (json && json.data) {
                  const data = json.data;
                  if (Array.isArray(data) && data.length > 0) {
                    const purchaseData: number[][] = [];
                    const purchaseLabels: string[] = [];
                    const years = this.formatDate3YearforChart(this.selectedYear);

                    data.forEach((purchase: any) => {
                      const purchaseValues: number[] = years.map(year => parseFloat(purchase[`N${year}`]) / 1000000);
                      purchaseData.push(purchaseValues);
                      purchaseLabels.push(purchase.NamaDept);
                    });

                    initializeLineChart(years, purchaseLabels, purchaseData);
                  } else {
                    console.error('Data received is empty or not an array');
                    clearChart();
                  }
                } else {
                  console.error('Invalid response received from the server');
                  clearChart();
                }
            };
            const clearChart = () => {
                if (this.lineChart) {
                    this.lineChart.destroy();
                    this.lineChart = null;
                }

                const canvas = document.getElementById('myLineChart') as HTMLCanvasElement | null;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
            };

            if(this.selectedOption === 'KdGroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearGroupBarang').DataTable();
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
                    code: 17,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Group',
                    data: 'NamaGroup'
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 4) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                    showChartKdGroup(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableThreeYearGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable21').removeAttr('hidden', 'hidden');
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);
            } else if (this.selectedOption === 'KdGroup+KdSubgroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearSubGroupBarang').DataTable();
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
                    code: 17,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                   {
                    title: 'Nama Sub Group',
                    data: 'NamaSubGroup'
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 4) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                    showChartKdSubGroup(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableThreeYearSubGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable22').removeAttr('hidden', 'hidden');
            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);

            $('#cardtable12').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);
            } else if (this.selectedOption === 'KdDept'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearDepartment').DataTable();
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
                    code: 17,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                     {
                    title: 'Nama Department',
                    data: 'NamaDept'
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 4) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                  }, 500);
                    showChartKdDept(api.ajax.json());
                  }
                };
            this.dataTable = $('#TableThreeYearDepartment').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable24').removeAttr('hidden', 'hidden');
            $('#cardtable22').attr('hidden', true);
            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);

            $('#cardtable14').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);
            } else if (this.selectedOption === 'KdBrg') {
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDateYear(this.selectedYear);
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearBarang').DataTable();
                this.dataTable.destroy();
                this.listdataTable = {
                destroy: true,
                paging: true,
                scrollY: '60vh',
                scrollX: !0,
                scrollCollapse: !0,
                dom: 'frltip',
                lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                ajax: {
                    url: url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                    code: 17,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate
                    },
                },
                columns: [
                    {
                    title: 'Nama Barang',
                    data: 'NamaBrg'
                    },
                    {
                    title: 'Brand',
                    data: 'Brand'
                    },
                    {
                    title: 'Nama Sub Group',
                    data: 'NamaSubGroup'
                    },
                    {
                    title: 'Satuan Beli',
                    data: 'SatuanBeli'
                    },
                    {
                    title: 'Tahun Q' + yearDate2,
                    data: 'Q'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun Q' + yearDate1,
                    data: 'Q'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun Q' + yearDate,
                    data: 'Q'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                  const api = this.api();
                  api.columns().every(function (this: any) {
                      const column = this;
                      const columnIndex = column.index();

                      if (columnIndex >=4 && columnIndex <= 9) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                          calculateTotal(column, columnIndex);
                      }
                  });
                  setTimeout(function(){
                    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                }, 500);
                }
                };
            this.dataTable = $('#TableThreeYearBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable23').removeAttr('hidden', 'hidden');
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable21').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);

            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            } else if (this.selectedOption === 'KdSupp') {
                const yearDate = this.formatDateYear(this.selectedYear);
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearSupplier').DataTable();
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
                    code: 17,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                     {
                    title: 'Nama Supplier',
                    data: 'NamaSupp'
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                  const api = this.api();
                  api.columns().every(function (this: any) {
                      const column = this;
                      const columnIndex = column.index();

                      if (columnIndex >=1 && columnIndex <= 4) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                          calculateTotal(column, columnIndex);
                      }
                  });
                  setTimeout(function(){
                    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                }, 500);
                }
                };
            this.dataTable = $('#TableThreeYearSupplier').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable25').removeAttr('hidden', 'hidden');
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);

            $('#cardtable15').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            } else if (this.selectedOption === 'Supp') {
                const yearDate = this.formatDateYear(this.selectedYear)
                const yearDate1 = this.formatDateYearMinus1(this.selectedYear);
                const yearDate2 = this.formatDateYearMinus2(this.selectedYear);
                this.yearDate = yearDate
                this.yearDate1 = yearDate1
                this.yearDate2 = yearDate2
                this.dataTable = $('#TableThreeYearSupplierGroupBarang').DataTable();
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
                    code: 17,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: [
                    {
                    title: 'Nama Supplier',
                    data: 'NamaSupp'
                    },
                    {
                    title: 'Nama Sub Group',
                    data: 'NamaSubgroup'
                    },
                    {
                    title: 'Tahun N' + yearDate2,
                    data: 'N'+yearDate2,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate1,
                    data: 'N'+yearDate1,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    },
                    {
                    title: 'Tahun N' + yearDate,
                    data: 'N'+yearDate,
                    className: 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2)
                    }
                ],
                initComplete: function (this: any) {
                  const api = this.api();
                  api.columns().every(function (this: any) {
                      const column = this;
                      const columnIndex = column.index();

                      if (columnIndex >=2 && columnIndex <= 5) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                          calculateTotal(column, columnIndex);
                      }
                  });
                  setTimeout(function(){
                    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                }, 500);
                }
                };
            this.dataTable = $('#TableThreeYearSupplierGroupBarang').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable26').removeAttr('hidden', 'hidden');
            $('#cardtable25').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);

            $('#cardtable16').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable17').attr('hidden', true);
            $('#cardtable11').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable41').attr('hidden', true);
            }
    }
    getDataTableQuarter(){

        var url;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002_AjaxCall';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002_AjaxCall';
        }
            const calculateTotal = (column: any, columnIndex: number) => {
                const sum = column
                .data()
                .reduce((acc: number, curr: string) => {
                    const value = parseFloat(curr);
                    return isNaN(value) ? acc : acc + value;
                }, 0);

                const formattedSum = sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                $(column.footer()).html(formattedSum);
            };

            if(this.selectedOption === 'KdGroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalKdGroup(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearGroupBarangQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalKdGroup(yearDate);
                  }
                this.dataTable = $('#TableThreeYearGroupBarangQuartal').DataTable();
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
                    code: 22,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate.join(',')
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 13) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearGroupBarangQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable31').removeAttr('hidden', 'hidden');
            $('#cardtable33').attr('hidden', true);
            $('#cardtable34').attr('hidden', true);
            $('#cardtable32').attr('hidden', true);
            $('#cardtable35').attr('hidden', true);
            $('#cardtable36').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            } else if (this.selectedOption === 'KdGroup+KdSubgroup'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalSubGroup(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearSubGroupQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalSubGroup(yearDate);
                  }
                this.dataTable = $('#TableThreeYearSubGroupQuartal').DataTable();
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
                    code: 22,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate.join(',')
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 13) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearSubGroupQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable32').removeAttr('hidden', 'hidden');
            $('#cardtable33').attr('hidden', true);
            $('#cardtable34').attr('hidden', true);
            $('#cardtable31').attr('hidden', true);
            $('#cardtable35').attr('hidden', true);
            $('#cardtable36').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            } else if (this.selectedOption === 'KdDept'){
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalDept(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearDepartmentQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalDept(yearDate);
                  }
                this.dataTable = $('#TableThreeYearDepartmentQuartal').DataTable();
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
                    code: 22,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate.join(',')
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 13) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearDepartmentQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable34').removeAttr('hidden', 'hidden');
            $('#cardtable33').attr('hidden', true);
            $('#cardtable32').attr('hidden', true);
            $('#cardtable31').attr('hidden', true);
            $('#cardtable35').attr('hidden', true);
            $('#cardtable36').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            } else if (this.selectedOption === 'KdBrg') {
                const selectedDeptString = this.selectedDept.join(',');
                const selectedItemGroupString = this.selectedItemGroup.join(',');
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalBarang(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearBarangQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalBarang(yearDate);
                  }
                this.dataTable = $('#TableThreeYearBarangQuartal').DataTable();
                this.dataTable.destroy();
                this.listdataTable = {
                destroy: true,
                paging: true,
                scrollY: !0,
                scrollX: !0,
                scrollCollapse: !0,
                dom: 'frltip',
                lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                ajax: {
                    url: url,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                    code: 22,
                    param1: this.selectedOption,
                    param2: selectedDeptString,
                    param3: selectedItemGroupString,
                    param4: yearDate.join(',')
                    },
                },
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=4 && columnIndex <= 29) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearBarangQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable33').removeAttr('hidden', 'hidden');
            $('#cardtable34').attr('hidden', true);
            $('#cardtable32').attr('hidden', true);
            $('#cardtable31').attr('hidden', true);
            $('#cardtable35').attr('hidden', true);
            $('#cardtable36').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            } else if (this.selectedOption === 'KdSupp') {
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalSupp(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearSuppQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalSupp(yearDate);
                  }
                this.dataTable = $('#TableThreeYearSuppQuartal').DataTable();
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
                    code: 22,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate.join(',')
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=1 && columnIndex <= 13) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearSuppQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable35').removeAttr('hidden', 'hidden');
            $('#cardtable33').attr('hidden', true);
            $('#cardtable32').attr('hidden', true);
            $('#cardtable31').attr('hidden', true);
            $('#cardtable34').attr('hidden', true);
            $('#cardtable36').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            } else if (this.selectedOption === 'Supp') {
                const yearDate = this.formatDate3YearforChart(this.selectedYear);
                const columns = this.generateColumnsQuartalSuppGroup(yearDate);
                const theadElement = document.querySelector(
                    '#TableThreeYearSuppGroupQuartal thead'
                  );
                  if (theadElement) {
                    theadElement.innerHTML = this.createTableHeadersQuartalSuppGroup(yearDate);
                  }
                this.dataTable = $('#TableThreeYearSuppGroupQuartal').DataTable();
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
                    code: 22,
                    param1: this.selectedOption,
                    param2: '',
                    param3: '',
                    param4: yearDate.join(',')
                    },
                },
                buttons: [
                  {
                      extend: 'copy',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'excel',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'csv',
                      title: function () {
                        return 'Purchase Report';
                      },
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'pdf',
                      title: function () {
                        return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  },
                  {
                      extend: 'print',
                      title: function () {
                          return 'Purchase Report';
                      },
                      orientation: 'landscape',
                      exportOptions: {
                          columns: ':visible'
                      }
                  }
                ],
                columns: columns,
                initComplete: function (this: any) {
                    const api = this.api();
                    api.columns().every(function (this: any) {
                        const column = this;
                        const columnIndex = column.index();

                        if (columnIndex >=2 && columnIndex <= 14) { // Kolom index 6 merupakan 'Qty', 7 merupakan 'Value'
                            calculateTotal(column, columnIndex);
                        }
                    });
                    setTimeout(function(){
                        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    }, 500);
                  }
                };
            this.dataTable = $('#TableThreeYearSuppGroupQuartal').DataTable(this.listdataTable);
            $('.table-main').removeAttr('hidden', 'hidden');
            $('.chart-main').removeAttr('hidden', 'hidden');
            $('#cardtable36').removeAttr('hidden', 'hidden');
            $('#cardtable33').attr('hidden', true);
            $('#cardtable32').attr('hidden', true);
            $('#cardtable31').attr('hidden', true);
            $('#cardtable34').attr('hidden', true);
            $('#cardtable35').attr('hidden', true);

            $('#cardtable11').attr('hidden', true);
            $('#cardtable13').attr('hidden', true);
            $('#cardtable14').attr('hidden', true);
            $('#cardtable12').attr('hidden', true);
            $('#cardtable15').attr('hidden', true);
            $('#cardtable16').attr('hidden', true);

            $('#cardtable1').attr('hidden', true);
            $('#cardtable3').attr('hidden', true);
            $('#cardtable4').attr('hidden', true);
            $('#cardtable2').attr('hidden', true);
            $('#cardtable5').attr('hidden', true);
            $('#cardtable6').attr('hidden', true);
            $('#cardtable7').attr('hidden', true);

            $('#cardtable21').attr('hidden', true);
            $('#cardtable23').attr('hidden', true);
            $('#cardtable24').attr('hidden', true);
            $('#cardtable22').attr('hidden', true);
            $('#cardtable25').attr('hidden', true);
            $('#cardtable26').attr('hidden', true);
            }
    }

    getDetail1(KdGroup: any) {
        let url: string;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002';
        }

        if (!KdGroup) {
            console.error('KdGroup is required');
            return;
        }

        const selectedDeptString = this.selectedDept.join(',');
        const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
        const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
        this.firstDate = firstDate;
        this.endDate = endDate;

        const params = {
            code: 15,
            param1: 'KdGroup',
            param2: selectedDeptString,
            param3: KdGroup,
            param4: firstDate,
            param5: endDate
        };

        this.cols = [
            { field: 'KdBrg', header: 'Kode Barang' },
            { field: 'Brand', header: 'Brand' },
            { field: 'NamaBrg', header: 'Nama Barang' },
            { field: 'NamaSubGroup', header: 'Nama Sub Group' },
            { field: 'SatuanBeli', header: 'Satuan Beli' },
            { field: 'QTY', header: 'QTY' },
            { field: 'DPP', header: 'DPP', class: 'dt-body-right', isNumber: true }
        ];

        this.httpClient.post<any>(url, params).subscribe(data => {
            if (Array.isArray(data)) {
                this.items = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                this.items = data.data;
            } else {
                console.error('Unexpected data format:', data);
                this.items = [];
            }
        }, error => {
            console.error('Error fetching data:', error);
            this.items = [];
        });
    }
    getDetail2(KdSubGroup: any){
        console.log(KdSubGroup)
        var url;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002';
        }
        if (!KdSubGroup) {
            console.error('KdSubGroup is required');
            return;
          }

          const selectedDeptString = this.selectedDept.join(',');
          const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
          const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
          this.firstDate = firstDate;
          this.endDate = endDate;

          const params = {
            code: 15,
            param1: 'KdSubGroup',
            param2: selectedDeptString,
            param3: KdSubGroup,
            param4: firstDate,
            param5: endDate
          };

          this.cols = [
            { field: 'KdBrg', header: 'Kode Barang' },
            { field: 'Brand', header: 'Brand' },
            { field: 'NamaBrg', header: 'Nama Barang' },
            { field: 'NamaSubGroup', header: 'Nama Sub Group' },
            { field: 'SatuanBeli', header: 'Satuan Beli' },
            { field: 'QTY', header: 'QTY' },
            { field: 'DPP', header: 'DPP', class: 'dt-body-right', isNumber: true }
          ];

          this.httpClient.post<any>(url, params).subscribe(data => {
            if (Array.isArray(data)) {
                this.items = data;
              } else if (data && data.data && Array.isArray(data.data)) {
                this.items = data.data;
              } else {
                console.error('Unexpected data format:', data);
                this.items = [];
              }
            }, error => {
              console.error('Error fetching data:', error);
              this.items = [];
          });
    }
    getDetail3(KdDept: any){
        console.log(KdDept)
        var url;
        if (checkUrl()) {
            url = baseUrl + 'Pembelian/SP002';
        } else {
            url = baseUrlLuar + 'Pembelian/SP002';
        }
        if (!KdDept) {
            console.error('KdDept is required');
            return;
          }

          const selectedDeptString = this.selectedDept.join(',');
          const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
          const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
          this.firstDate = firstDate;
          this.endDate = endDate;

          const params = {
            code: 15,
            param1: 'KdDept',
            param2: selectedDeptString,
            param3: KdDept,
            param4: firstDate,
            param5: endDate
          };

          this.cols = [
            { field: 'KdBrg', header: 'Kode Barang' },
            { field: 'Brand', header: 'Brand' },
            { field: 'NamaBrg', header: 'Nama Barang' },
            { field: 'NamaSubGroup', header: 'Nama Sub Group' },
            { field: 'SatuanBeli', header: 'Satuan Beli' },
            { field: 'QTY', header: 'QTY' },
            { field: 'DPP', header: 'DPP', class: 'dt-body-right', isNumber: true }
          ];

          this.httpClient.post<any>(url, params).subscribe(data => {
            if (Array.isArray(data)) {
                this.items = data;
              } else if (data && data.data && Array.isArray(data.data)) {
                this.items = data.data;
              } else {
                console.error('Unexpected data format:', data);
                this.items = [];
              }
            }, error => {
              console.error('Error fetching data:', error);
              this.items = [];
          });
    }

    validateSelectionPeriode(): boolean {
      if(this.selectedOption === 'KdGroup'){
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdGroup+KdSubgroup') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdBrg') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdDept') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdSupp') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
      } else if (this.selectedOption === 'Supp') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
      } else if (this.selectedOption === 'NoGroup') {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
      } else {
        if(!this.selectedPeriode) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Periode' });
          return false;
        }
        if (!this.selectedOption) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Group By' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      }
        return true;
    }
    validateSelectionYears(): boolean {
      if(this.selectedOption === 'KdGroup'){
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdGroup+KdSubgroup') {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdBrg') {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdDept') {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      } else if (this.selectedOption === 'KdSupp') {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
      } else if (this.selectedOption === 'Supp') {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
      } else {
        if(!this.selectedYear) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
          return false;
        }
        if (!this.selectedOption) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Group By' });
          return false;
        }
        if (!this.selectedItemGroup || this.selectedItemGroup.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Item Group' });
          return false;
        }
        if (!this.selectedDept || this.selectedDept.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Department' });
          return false;
        }
      }
        return true;
    }

    showDataTable(){
        this.configLoading = true
        setTimeout(() => {
            if(this.valuebuttonOptions === '0') {
                if (this.validateSelectionPeriode()) {
                    this.getDataTablePeriode();
                    $('#cardtable41').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
                  }
            } else if (this.valuebuttonOptions === '1') {
                if(this.validateSelectionYears()) {
                    this.getDataTable1Year();
                    $('#cardtable41').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
                }
            } else if (this.valuebuttonOptions === '2') {
                if(this.validateSelectionYears()) {
                    this.getDataTable3Year();
                    $('#cardtable41').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
                }
            } else if (this.valuebuttonOptions === '3'){
                if(this.validateSelectionYears()){
                    this.getDataTableQuarter();
                    $('#cardtable41').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data has Appeared' });
                }
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please input data!' });
            }
            // this.getDataTable1Year();
            this.configLoading = false
        }, 500);

    }
    showDataChart(){
        this.configLoading = true
        setTimeout(() => {
            if(this.valuebuttonOptions === '1') {
                if(this.valuemodelOptions === '2') {
                    $('#cardtable41').removeAttr('hidden');
                    this.getDataTable1Year()
                    $('.table-main').attr('hidden',true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Chart delay, please wait!' });
                } else {
                    $('.table-main').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                }
            } else if (this.valuebuttonOptions === '2') {
                if(this.valuemodelOptions === '2') {
                    $('#cardtable41').removeAttr('hidden');
                    this.getDataTable3Year()
                    $('.table-main').attr('hidden',true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Chart delay, please wait!' });
                } else {
                    $('.table-main').attr('hidden', true);
                    $('.chart-main').attr('hidden', true);
                }
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please choose all data!' });
            }
            // this.getDataTable1Year();
            this.configLoading = false
        }, 500);
    }

    showData(){
        if(this.valuemodelOptions === '1'){
            this.showDataTable();
        } else if (this.valuemodelOptions === '2'){
            this.showDataChart();
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please choose all data!' });
        }
    }

    defaultView(){
        $('#pilihmodel').attr('hidden', true);
        $('.PilihModel').attr('hidden', true);
    }
    formatNumber(value: number): string {
        if (value === null || value === undefined) {
            return '';
        }
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    get modelOptionsFiltered(): any[] {
        if (this.selectedButton === '0') {
            return this.modelOptions.filter(option => option.value === '1');
        } else if (this.selectedButton === '3'){
            return this.modelOptions.filter(option => option.value === '1');
        } else if (this.selectedGroupBy === 'KdBrg'){
            return this.modelOptions.filter(option => option.value === '1');
        } else if (this.selectedGroupBy === 'NoGroup'){
            return this.modelOptions.filter(option => option.value === '1');
        } else if (this.selectedGroupBy === 'Supp'){
            return this.modelOptions.filter(option => option.value === '1');
        } else if (this.selectedGroupBy === 'KdSupp'){
            return this.modelOptions.filter(option => option.value === '1');
        } else {
            return this.modelOptions.filter(option => option.value !== '');
        }
    }
    get buttonOptionsFiltered(): any[] {
        if (this.selectedGroupBy === 'NoGroup') {
            return this.buttonOptions.filter(option => option.value === '0');
        } else {
            return this.buttonOptions.filter(option => option.value !== '');
        }
    }
}
