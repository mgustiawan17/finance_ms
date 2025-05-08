import { Component,ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
import { PriceindexService } from './priceindex.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { ChartData, ChartConfiguration } from 'chart.js';
// import DataTable from 'datatables.net-dt';
declare var $: any;
declare var Chart: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-priceindex',
  templateUrl: './priceindex.component.html',
  styleUrls: ['./priceindex.component.scss'],
  providers: [PriceindexService,MessageService],
})
export class PriceIndexComponent implements OnInit, AfterViewInit {
  @ViewChild('form', { static: true }) form: NgForm;
  selectedYear: any;
  years: number[];
  activeTab: Tabs = 'Header';
  model: any;
  configLoading = false;
  resetLoading = false;
  dateRange: any;
  selectedItemGoods: any;
  barang = '';
  jumlah = 0;
  showCustomerFilterForm = false;
  selectedCustomer: any;
  selectedGrade: any;
  selectedItem: any;
  showGradeForm = true;
  showTable: any;
  table: any;
  showDateRangeForm = true;
  showYearForm = true;
  optionListItem: any
  yearDate: any;
  dataTable: any;
  listdataTable: any;
  dataTable2: any;
  listdataTable2: any;
  dataChart: any;
  listdataChart: any;

  lineChart: typeof Chart | null = null;

  constructor(
    private httpService: PriceindexService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private layout: LayoutService)
    {
  }

  selectPeriod(period: number) {
    if (period === 1) {
      this.showDateRangeForm = true; // Sembunyikan input date range
      this.showYearForm = false; // Tampilkan label tahun dan select tahun
    } else {
      this.showDateRangeForm = false; // Tampilkan input date range
      this.showYearForm = true; // Sembunyikan label tahun dan select tahun
    }
  }

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }

  ngAfterViewInit() {
    // let table = new DataTable('#tabelPriceIndex');
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }


  formatDateYear(date: Date): string {
    // Ubah format tanggal menjadi "yyyy-mm-dd"
    const year = date.getFullYear();
    return `${year}`;
  }

  getItem(){
    const itemElement = $('#searchitem');
    const searchItem: string = itemElement.val() as string;
    this.optionListItem = '';
    this.httpService.getData2('',searchItem)
      .subscribe(
        data => {
            const item = data.map((item: any) => {
                return {
                    label: item.NamaBrg,
                    value: item.kdbrg
                };
            });
            this.optionListItem = item;
        },
        error => {
            // Handle error
        }
      );
  }

  toggleCustomerFilterForm() {
    this.showCustomerFilterForm = !this.showCustomerFilterForm;
  }

  getTable() {
    var url;
        if (checkUrl()) {
            url = baseUrl + '';
        } else {
            url = baseUrlLuar + '';
        }

          const selectedItem= this.selectedItem;
          const yearDate = this.formatDateYear(this.selectedYear);
          this.yearDate = yearDate;
          this.dataTable = $('#TableYearPriceIndex').DataTable();
          this.dataTable.destroy();
          this.listdataTable = {
          destroy: true,
          paging: true,
          scrollY: '50vh',
          scrollX: !0,
          scrollCollapse: !0,
          dom: 'Bfrltip',
          lengthMenu: [10, 20, 50, 100, 200, 500],
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
          columns: [
              {
              title: 'Tanggal',
              data: ''
              },
              {
              title: 'Nama Supplier',
              data: ''
              },
              {
              title: 'UOM',
              data: ''
              },
              {
              title: 'Currency',
              data: ''
              },
              {
              title: 'Harga Satuan',
              data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
              }
          ],
          };
      this.dataTable = $('#TableYearPriceIndex').DataTable(this.listdataTable);
      $('#cardtable11').removeAttr('hidden', 'hidden');
      $('#cardtable31').removeAttr('hidden', 'hidden');
  }
  getSummary() {
    var url;
        if (checkUrl()) {
            url = baseUrl + '';
        } else {
            url = baseUrlLuar +  '';
        }
          const selectedItem= this.selectedItem;
          const yearDate = this.formatDateYear(this.selectedYear);
          this.yearDate = yearDate;
          this.dataTable2 = $('#TableYearPriceIndexSummary').DataTable();
          this.dataTable2.destroy();
          this.listdataTable2 = {
          destroy: true,
          paging: true,
          scrollY: '50vh',
          scrollX: !0,
          scrollCollapse: !0,
          dom: 'Bfrltip',
          lengthMenu: [10, 20, 50, 100, 200, 500],
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
          columns: [
              {
              title: 'HIGHEST',
              data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
              },
              {
              title: 'LOWEST',
              data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
              },
              {
              title: 'AVERAGE',
              data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
              }
          ],
          };
      this.dataTable2 = $('#TableYearPriceIndexSummary').DataTable(this.listdataTable2);
      $('#cardtable11').removeAttr('hidden', 'hidden');
      $('#cardtable31').removeAttr('hidden', 'hidden');
  }
  getChart() {
    var url;
        if (checkUrl()) {
            url = baseUrl + '';
        } else {
            url = baseUrlLuar + '';
        }

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

          const datasets = purchaseData[0].map((_, idx) => {
              const color = colorsWithOpacity[idx % colorsWithOpacity.length];
              const opacity = '33';
              const rgbaColor = color + opacity;
              const data = purchaseData.map(d => d[idx]);

              return {
                  label: `Data Set ${idx}`,
                  data: data,
                  fill: true,
                  borderColor: color,
                  backgroundColor: rgbaColor,
                  borderWidth: 2
              };
          });

          const chartData = {
              labels: labels,
              datasets: datasets
          };

          this.lineChart = new Chart(ctx, {
              type: 'line',
              data: chartData,
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          display: false
                      },
                  },
              }
          });
        };

          const showChart = (json: any) => {
            if (json && json.data) {
                const data = json.data;
                if (Array.isArray(data) && data.length > 0) {
                    // Urutkan data berdasarkan tanggal
                    data.sort((a, b) => new Date(a.TGL).getTime() - new Date(b.TGL).getTime());

                    const purchaseData: number[][] = [];
                    const labels: string[] = [];

                    data.forEach((purchase) => {
                        const purchaseValues: number[] = [];
                        // Mulai dari index 1 karena index 0 mungkin adalah tanggal atau label lain
                        for (let key in purchase) {
                            if (key !== "TGL") {
                                purchaseValues.push(parseFloat(purchase[key]));
                            }
                        }
                        purchaseData.push(purchaseValues);
                        labels.push(purchase.TGL);
                    });

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

          const selectedItem= this.selectedItem;
          const yearDate = this.formatDateYear(this.selectedYear);
          this.yearDate = yearDate;
          this.dataChart = $('#TableForChart').DataTable();
          this.dataChart.destroy();
          this.listdataChart = {
          destroy: true,
          paging: true,
          scrollY: '50vh',
          scrollX: !0,
          scrollCollapse: !0,
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
          columns: [
              {
              title: 'Tanggal',
              data: '',
              },
              {
              title: 'Harga Satuan',
              data: '',
              render: $.fn.dataTable.render.number(',', '.', 2)
              },
          ],
          initComplete: function (this: any) {
            const api = this.api();
            showChart(api.ajax.json());
          }
          };
      this.dataChart = $('#TableForChart').DataTable(this.listdataChart);
      $('#cardtable11').removeAttr('hidden', 'hidden');
      $('#cardtable31').removeAttr('hidden', 'hidden');
  }

  validateSelectionYears(): boolean {
    if(!this.selectedYear) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Years' });
        return false;
    }
    if (!this.selectedItem) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add Items' });
        return false;
    }
    return true;
  }

  showDataTable() {
    if(this.validateSelectionYears()){
      this.showTable = true;
      this.getTable();
      this.getSummary();
      this.getChart();
    } else {
    }
  }
}
