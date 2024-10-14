import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LayoutService } from '../../_metronic/layout';
import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, checkUrl, baseUrlLuar } from '../baseurl';

declare var Chart: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('PRAppproveVALUE', { static: true }) PRAppproveVALUE: ElementRef;
  date: Date;
  formGroup: FormGroup;
  chart: any;
  pieChartYear: any;
  pieChartMonth: any;
  selectDashboard: any;
  listdataTable: any;
  selected1Year: Date;
  currentCompany: any;
  table: any;
  dataTable: any;
  busy: any;
  optionPRApprove: any;
  data: any;
  datas: any;

  prApproveDays: number;
  prProcessingDays: any;
  poApproveDays: any;
  receivingDays: any;

  dataPurchase: any;
  dataTargetSalesMonth: any;
  dataTargetSalesYear: any;
  dataGraphicSales: any;
  dataGraphicPurchase: any;

  optionsPurchase: any;
  optionsTargetSalesMonth: any;
  optionsTargetSalesYear: any;
  optionsGraphicSales: any;
  purchaseData: any[];

  TableProses: any;
  ListTableProses: any;

  stateOptionsKualitas: any[] = [{ label: 'Year', value: 'year' },{ label: 'Month', value: 'month' }];
  valueStateOptionKualitas: string = 'year';

  yearOptionsKualitas: any[] = [{ label: 'This Year', value: 'thisyear' },{ label: 'Last Year', value: 'lastyear' }];
  valueYearOptionKualitas: string = 'thisyear';

  monthOptionsKualitas: any[] = [{ label: 'This Month', value: 'thismonth' },{ label: 'Last Month', value: 'lastmonth' }];
  valueMonthOptionKualitas: string = 'thismonth';

  stateOptionsKuantitas: any[] = [{ label: 'Year', value: 'year' },{ label: 'Month', value: 'month' }];
  valueStateOptionKuantitas: string = 'year';

  yearOptionsKuantitas: any[] = [{ label: 'This Year', value: 'thisyear' },{ label: 'Last Year', value: 'lastyear' }];
  valueYearOptionKuantitas: string = 'thisyear';

  monthOptionsKuantitas: any[] = [{ label: 'This Month', value: 'thismonth' },{ label: 'Last Month', value: 'lastmonth' }];
  valueMonthOptionKuantitas: string = 'thismonth';

  stateOptionsBiaya: any[] = [{ label: 'Year', value: 'year' },{ label: 'Month', value: 'month' }];
  valueStateOptionBiaya: string = 'year';

  yearOptionsBiaya: any[] = [{ label: 'This Year', value: 'thisyear' },{ label: 'Last Year', value: 'lastyear' }];
  valueYearOptionBiaya: string = 'thisyear';

  monthOptionsBiaya: any[] = [{ label: 'This Month', value: 'thismonth' },{ label: 'Last Month', value: 'lastmonth' }];
  valueMonthOptionBiaya: string = 'thismonth';

  salesPic = [
    {
      name: 'Anita ',
      price: 10000000,
    },
    {
      name: 'David ',
      price: 9500000,
    },
    {
      name: 'Leonardus ',
      price: 8530000,
    },
    {
      name: 'Sutini',
      price: 4520000,
    },
    {
      name: 'Elang',
      price: 3470000,
    },
    {
      name: 'Ati',
      price: 3200000,
    },
  ];

  FiveCustYear = [
    {
      name: 'Sinar Mas',
      price: 70114,
    },
    {
      name: 'CV. Trikora',
      price: 65109,
    },
    {
      name: 'Wito',
      price: 40505,
    },
    {
      name: 'Dede Yaman',
      price: 30354,
    },
    {
      name: 'Jujun Juhana',
      price: 7002,
    },
  ];

  FiveCorakYear = [
    {
      name: 'CC2101HC',
      price: 870,
    },
    {
      name: 'AD2134HR',
      price: 654,
    },
    {
      name: 'FR5431TY',
      price: 342,
    },
    {
      name: 'IK6548YH',
      price: 564,
    },
    {
      name: 'GH5674LK',
      price: 987,
    },
  ];

  chooseData = [
    { name: 'Sales', value: 'Sales' },
    { name: 'Purchase', value: 'Purchase' },
    { name: 'Inventory', value: 'Inventory' },
  ];

  constructor(
    private el: ElementRef,
    private httpService: DashboardService,
    private layout: LayoutService,
    private http: HttpClient,
    private route: Router,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.currentCompany = localStorage.getItem('currentCompany');
  }

  ngOnInit() {
    this.getPRApprove();
    this.handleChangeBiaya('year');
    this.handleChangeKualitas('year');
    this.handleChangeKuantitas('year');
    const currentYear = new Date().getFullYear();
    this.selected1Year = new Date(currentYear, 0, 1);
  }

  checkUrl(): boolean {
    return true;
  }

  ngAfterViewInit() {
    this.getTableHandlingProcess();
    this.PurchasePieChartYear();
    this.PurchasePieChartMonth();
    this.LineChartSales();
    this.TargetPerMonthSales();
    this.TargetPerYearSales();
    this.getPRApprove();
  }

  formatDateYear(date: Date): string {
    const year = date.getFullYear();
    return `${year}`;
  }

  formatDateMonth1(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${month}`;
  }

  formatDateMonth(date: Date): { year: string; month: string } {
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return { month, year };
  }

  onYearChange(event: Date) {
    console.log('Tahun yang dipilih (sebelum diubah):', this.selected1Year);
    this.selected1Year = event;
    console.log('Tahun yang dipilih (setelah diubah):', event.getFullYear());
    this.PurchasePieChartYear();
  }

  handleChangeKualitas(newValue: any) {
    if (newValue === 'year') {
      $('#monthsKualitas').attr('hidden', true);
      $('#yearsKualitas').removeAttr('hidden');
    } else if (newValue === 'month') {
      $('#yearsKualitas').attr('hidden', true);
      $('#monthsKualitas').removeAttr('hidden');
    } 
  }

  handleChangeKuantitas(newValue: any) {
    if (newValue === 'year') {
      $('#monthsKuantitas').attr('hidden', true);
      $('#yearsKuantitas').removeAttr('hidden');
    } else if (newValue === 'month') {
      $('#yearsKuantitas').attr('hidden', true);
      $('#monthsKuantitas').removeAttr('hidden');
    }
  }

  handleChangeBiaya(newValue: any) {
    if (newValue === 'year') {
      $('#monthsBiaya').attr('hidden', true);
      $('#yearsBiaya').removeAttr('hidden');
    } else if (newValue === 'month') {
      $('#yearsBiaya').attr('hidden', true);
      $('#monthsBiaya').removeAttr('hidden');
    } 
  }


  getPRApprove() {
    this.httpService.getData('15', '2024', '',).subscribe(
      (data) => {
        console.log('Data PR Approve:', data);
        // const prApproveDaysElement = document.getElementById('prApproveDays');
        // if (prApproveDaysElement !== null) {
        //   if (data && data.PRApprDays) {
        //     prApproveDaysElement.innerText = data.PRApprDays;
        //   } else {
        //     console.log('Data PRApprDays tidak ditemukan dalam respons.');
        //   }
        // } else {
        //   console.log("id 'prApproveDays' tidak ditemukan.");
        // }
      },
      (error: any) => {
        console.error('Error saat mengambil data PR Approve:', error);
      }
    );
  }

  PurchasePieChartYear() {
    let url;
    let pieChartYear: typeof Chart | null = null;
    if (checkUrl()) {
      url = baseUrl + 'Dashboard/SPDSB_AJAXtest';
    } else {
      url = baseUrlLuar + 'Dashboard/SPDSB_AJAXtest';
    }

    const initializePieChart = (labels: string[], values: number[]) => {
      const canvas = document.getElementById(
        'PurchasePieChartYear'
      ) as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Unable to get canvas context');
        return;
      }

      if (this.pieChartYear) {
        this.pieChartYear.destroy();
        this.pieChartYear = null;
      }

      const chartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#DF1A56',
              '#EE2743',
              '#F15F22',
              '#FAA71D',
              '#FDE500',
              '#93C83E',
              '#5FBB47',
              '#9C3E97',
            ],
            hoverBackgroundColor: [
              '#BF164E',
              '#CC213E',
              '#D34F20',
              '#DB8E1D',
              '#E8CC00',
              '#83AA37',
              '#53A03D',
              '#266599',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.pieChartYear = new Chart(ctx, {
        // Use this.lineChart
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `Inventory Summary by Group`,
            },
          },
        },
      });
    };

    const completeCallback = (json: any) => {
      if (json && json.data) {
        const data = json.data;
        if (Array.isArray(data) && data.length > 0) {
          const values = [];
          const labels = [];
          for (let i = 0; i < data.length; i++) {
            const group = data[i];
            values.push(parseFloat(group.Nilai));
            labels.push(group.NamaGroup);
          }
          initializePieChart(labels, values);
        } else {
          console.error('Data received is empty or not an array');
        }
      } else {
        console.error('Invalid response received from the server');
      }
    };

    const yearDate = this.formatDateYear(this.selected1Year);
    this.dataTable = $('#TablePurchasingYear').DataTable();
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
          code: '12',
          param1: yearDate,
          param2: '',
          param3: '',
          param4: '',
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          userID: '',
        },
      },
      columns: [
        { title: 'NamaGroup', data: 'NamaGroup' },
        { title: 'Nilai', data: 'Nilai' },
      ],
      initComplete: function (settings: any, json: any) {
        completeCallback(json);
      },
    };
    this.busy = this.table = $('#TablePurchasingYear').DataTable(
      this.listdataTable
    );
  }

  PurchasePieChartMonth() {
    let url;
    let pieChart: typeof Chart | null = null;
    if (checkUrl()) {
      url = baseUrl + 'Dashboard/SPDSB_AJAXtest';
    } else {
      url = baseUrlLuar + 'Dashboard/SPDSB_AJAXtest';
    }

    const initializePieChart = (labels: string[], values: number[]) => {
      const canvas = document.getElementById(
        'PurchasePieChartMonth'
      ) as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Unable to get canvas context');
        return;
      }

      if (this.pieChartMonth) {
        this.pieChartMonth.destroy();
        this.pieChartMonth = null;
      }

      const chartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#DF1A56',
              '#EE2743',
              '#F15F22',
              '#FAA71D',
              '#FDE500',
              '#93C83E',
              '#5FBB47',
              '#9C3E97',
            ],
            hoverBackgroundColor: [
              '#BF164E',
              '#CC213E',
              '#D34F20',
              '#DB8E1D',
              '#E8CC00',
              '#83AA37',
              '#53A03D',
              '#266599',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.pieChartMonth = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
            },
            outlabels: {
              text: '%l %p',
              color: 'black',
              stretch: 45,
              font: {
                resizable: true,
                minSize: 12,
                maxSize: 18,
              },
              textAlign: 'center',
              backgroundColor: null,
              lineColor: 'black',
              borderWidth: 1,
              borderColor: 'black',
              padding: 4,
              borderRadius: 4,
              fontColor: '#333',
              stretchOffset: 0,
              lineOffset: 0,
              display: true,
            },
          },
        },
      });
    };

    const completeCallback = (json: any) => {
      if (json && json.data) {
        const data = json.data;
        if (Array.isArray(data) && data.length > 0) {
          const values = [];
          const labels = [];
          for (let i = 0; i < data.length; i++) {
            const group = data[i];
            values.push(parseFloat(group.Nilai));
            labels.push(group.NamaGroup);
          }
          initializePieChart(labels, values);
        } else {
          console.error('Data received is empty or not an array');
        }
      } else {
        console.error('Invalid response received from the server');
      }
    };
    const currentDate = new Date();
    const yearDate = this.formatDateYear(currentDate);
    const { month } = this.formatDateMonth(currentDate);

    this.dataTable = $('#TablePurchasingMonth').DataTable();
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
          code: '13',
          param1: yearDate,
          param2: month,
          param3: '',
          param4: '',
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          userID: '',
        },
      },
      columns: [
        { title: 'NamaGroup', data: 'NamaGroup' },
        { title: 'Nilai', data: 'Nilai' },
      ],
      initComplete: function (settings: any, json: any) {
        completeCallback(json);
      },
    };
    this.busy = this.table = $('#TablePurchasingMonth').DataTable(
      this.listdataTable
    );
    $('#TableMonth').removeAttr('hidden', 'hidden');
  }

  getCode19() {
    const currentDate = new Date();
    const year = this.formatDateYear(currentDate);
    const month = this.formatDateMonth1(currentDate);

    this.httpService
      .getData('19', year, month)
      .subscribe(
        (data: any) => {
          console.log('Data Table Handling Process:', data);
          this.ListTableProses = data;
        },
        (error: any) => {
          console.error(
            'Error saat mengambil data Table Handling Process:',
            error
          );
        },
        () => {
        }
      );
  }

  getTableHandlingProcess() {
    var url;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    this.TableProses = $('#TableHandlingProses').DataTable();
    this.TableProses.destroy();
    this.ListTableProses = {
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
          code: 14,
          param1: '',
          param2: '',
          param3: '',
          param4: '',
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          userID: '',
        },
      },
      columns: [
        {
          title: 'PIC',
          data: 'PIC',
          className: 'dt-head-center dt-body-center',
        },
        {
          title: 'Outstanding',
          data: 'Outstanding',
          className: 'dt-head-center dt-body-center',
        },
        {
          title: 'This Year',
          data: 'ThisYear',
          className: 'dt-head-center dt-body-center',
        },
        {
          title: 'This Month',
          data: 'ThisMonth',
          className: 'dt-head-center dt-body-center',
        },
        {
          title: 'Process Time',
          data: 'ProcessTime',
          className: 'dt-head-center dt-body-center',
        },
      ],
    };
    this.TableProses = $('#TableHandlingProses').DataTable(
      this.ListTableProses
    );
  }

  LineChartSales() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataGraphicSales = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Augst',
        'Sept',
        'Oct',
        'Nov',
        'Des',
      ],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40, 55, 53, 59, 50, 40],
          fill: true,
          borderColor: ['#D91E18'],
          tension: 0.4,
          backgroundColor: ['rgba(217, 30, 24, 0.1)'],
        },
      ],
    };

    this.optionsGraphicSales = {
      maintainAspectRatio: false,
      aspectRatio: 0.99,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  TargetPerMonthSales() {
    const salesAchievedPercentage = (70 / 100) * 100;
    const targetSales = 100;
    const remainingPercentage = targetSales - salesAchievedPercentage;
    this.chart = new Chart('TargetSalesMonth', {
      type: 'doughnut',
      data: {
        labels: ['Data1', 'Data2'],
        datasets: [
          {
            data: [salesAchievedPercentage, remainingPercentage], 
            backgroundColor: ['#397fb8', '#CF000F'],
            fill: false,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
      plugins: [
        {
          id: 'text',
          beforeDraw: function (chart: any) {
            var width = chart.width,
              height = chart.height,
              ctx = chart.ctx;

            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = fontSize + 'em sans-serif';
            ctx.textBaseline = 'middle';

            // Menghitung total data
            var total = chart.data.datasets.reduce(function (
              acc: any,
              dataset: any
            ) {
              return (
                acc +
                dataset.data.reduce(function (a: any, b: any) {
                  return a + b;
                }, 0)
              );
            },
            0);

            // Menghitung persentase
            var percent =
              Math.round((chart.data.datasets[0].data[0] / total) * 100) + '%';

            var textX = Math.round(
                (width - ctx.measureText(percent).width) / 2
              ),
              textY = height / 2;

            ctx.fillText(percent, textX, textY);
            ctx.save();
          },
        },
      ],
    });
  }

  TargetPerYearSales() {
    const salesAchievedPercentage = (90 / 100) * 100;
    const targetSales = 100;
    const remainingPercentage = targetSales - salesAchievedPercentage;
    this.chart = new Chart('TargetSalesYear', {
      type: 'doughnut',
      data: {
        labels: ['Data1', 'Data2'],
        datasets: [
          {
            data: [salesAchievedPercentage, remainingPercentage], //Data berdasarkan hasil jumlah
            backgroundColor: ['#397fb8', '#CF000F'],
            fill: false,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
      plugins: [
        {
          id: 'text',
          beforeDraw: function (chart: any) {
            var width = chart.width,
              height = chart.height,
              ctx = chart.ctx;

            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = fontSize + 'em sans-serif';
            ctx.textBaseline = 'middle';

            // Menghitung total data
            var total = chart.data.datasets.reduce(function (
              acc: any,
              dataset: any
            ) {
              return (
                acc +
                dataset.data.reduce(function (a: any, b: any) {
                  return a + b;
                }, 0)
              );
            },
            0);

            // Menghitung persentase
            var percent =
              Math.round((chart.data.datasets[0].data[0] / total) * 100) + '%';

            var textX = Math.round(
                (width - ctx.measureText(percent).width) / 2
              ),
              textY = height / 2;

            ctx.fillText(percent, textX, textY);
            ctx.save();
          },
        },
      ],
    });
  }
}
