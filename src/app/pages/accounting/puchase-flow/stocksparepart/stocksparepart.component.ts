import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { baseUrlCss, checkUrlCSS, baseUrlCssLuar } from '../../../baseurlCSS';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { StocksparepartService } from './stocksparepart.service';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-stocksparepart',
  templateUrl: './stocksparepart.component.html',
  styleUrl: './stocksparepart.component.scss',
  providers: [MessageService, StocksparepartService],
})
export class StocksparepartComponent implements OnInit {
  optionListGudang: any;
  selectedGudang: any = {};

  selectedCategory: any = null;

  categories: any[] = [
    { name: 'Group', key: 'Group' },
    { name: 'Detail Barang', key: 'Detail Barang' },
  ];

  TableStockSparepart: any;
  StockTableSparepart: any;
  TableDetailbarang: any;
  DetailTableBarang: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  selectedNamaGroup: any;
  selectedGudangDetail: any;

  dataTable: any;

  constructor(
    private route: Router,
    private httpService: StocksparepartService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.getGudang();
    this.selectedCategory = this.categories[1];
    $('#tableStockSparepart').attr('hidden', 'hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
  }

  createStockSparepartChart(): void {
    const dataArray = this.dataTable?.rows().data().toArray() || [];
    const chartData = dataArray.map((item: any) => ({
      name: item.NamaGroup,
      y: parseFloat(item.NILAI) || 0,
    }));

    if (chartData.length > 0) {
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: 'StockSparepartChart',
          type: 'pie',
        },
        title: { text: 'Stock Sparepart by Group' },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:.2f}',
              style: { color: 'black' },
            },
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Purchases',
            data: chartData,
          },
        ],
      };

      Highcharts.chart(chartOptions);
      const placeholder = document.getElementById('chartPlaceholder');
      if (placeholder) placeholder.style.display = 'none';
    } else {
      const placeholder = document.getElementById('chartPlaceholder');
      if (placeholder) placeholder.style.display = 'block';
    }
  }

  formatNumber(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  onChangeGudang(selectedGudang: any) {
    console.log(selectedGudang);
    this.selectedGudang = selectedGudang;
  }

  getGudangIds() {
    return this.selectedGudang.map((gudang: any) => gudang.label);
  }

  getGudang() {
    this.optionListGudang = [];
    this.httpService.SP_21_data_gudang('10').subscribe(
      (data) => {
        const gudang = data.map((item: any) => {
          return {
            label: item.KdGudang,
          };
        });
        this.optionListGudang = gudang;
      },
      (error) => {}
    );
  }

  getCommand(): void {
    // Hancurkan instance DataTable yang ada untuk menghindari konflik
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    // Periksa kategori yang dipilih dan muat tabel yang sesuai
    if (this.selectedCategory && this.selectedCategory.key) {
      switch (this.selectedCategory.key) {
        case 'Group':
          this.TablePerGroup();
          break;
        case 'Detail Barang':
          this.TableDetailBarang();
          break;
        default:
          console.warn('Invalid category selected:', this.selectedCategory.key);
      }
    } else {
      console.warn('No category selected');
    }
  }

  TablePerGroup() {
    $('#tableStockSparepart').removeAttr('hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_002_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_002_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
    this.TableStockSparepart = $('#stockSparepart').DataTable();
    this.TableStockSparepart.destroy();
    this.StockTableSparepart = {
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
          code: 2,
          param1: GudangString,
        },
      },
      columns: [
        {
          title: 'Nama Group',
          data: 'NamaGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Sub Group',
          data: 'NamaSubGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Nilai',
          data: 'NILAI',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Action',
          data: null,
          className: 'dt-body-center',
          render: function (t: any) {
            // tslint:disable-next-line: max-line-length
            return '<button id="detail" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Detail" type="button">DETAIL</Button>';
          },
        },
      ],
      initComplete: () => {
        this.dataTable = $('#stockSparepart').DataTable();
        this.createStockSparepartChart();
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedGudangDetail = data;
          const NamaGroup = this.selectedGudangDetail.NamaGroup;
          const NamaSubGroup = this.selectedGudangDetail.NamaSubGroup;
          this.DetailReturIntern(NamaGroup, NamaSubGroup);
          this.displayModal = true;
        });
      },
    };
    this.TableStockSparepart = $('#stockSparepart').DataTable(
      this.StockTableSparepart
    );
  }

  TableDetailBarang() {
    $('#tableDetailBarang').removeAttr('hidden');
    $('#tableStockSparepart').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_002_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_002_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
    this.TableDetailbarang = $('#detailBarang').DataTable();
    this.TableDetailbarang.destroy();
    this.DetailTableBarang = {
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
          code: 4,
          param1: GudangString,
        },
      },
      columns: [
        {
          title: 'Gudang',
          data: 'KdGudang',
          className: 'dt-body-center',
        },
        {
          title: 'Kode Barang',
          data: 'KdBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Barang',
          data: 'NamaBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Brand',
          data: 'Brand',
          className: 'dt-body-center',
        },
        {
          title: 'Group',
          data: 'NamaGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Sub Group',
          data: 'NamaSubGroup',
          className: 'dt-body-center',
        },
        {
          title: 'QTY',
          data: 'QTY',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Satuan Pakai',
          data: 'SatuanPakai',
          className: 'dt-body-center',
        },
        {
          title: 'Harga @',
          data: 'HRG',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Nilai',
          data: 'NILAI',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
      ],
    };
    this.TableDetailbarang = $('#detailBarang').DataTable(
      this.DetailTableBarang
    );
  }

  DetailReturIntern(NamaGroup: any, NamaSubGroup: any) {
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_002_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_002_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');

    const params = new URLSearchParams();
    params.set('code', '3');
    params.set('param1', GudangString);
    params.set('param2', NamaGroup);
    params.set('param3', NamaSubGroup);

    this.cols = [
      { field: 'KdGudang', header: 'Gudang' },
      { field: 'KdBrg', header: 'Kode Barang' },
      { field: 'NamaBrg', header: 'Nama Barang' },
      { field: 'Brand', header: 'Brand' },
      { field: 'SatuanPakai', header: 'Satuan Pakai' },
      {
        field: 'QTY',
        header: 'QTY',
        isNumber: true,
      },
      {
        field: 'HRG',
        header: 'Harga @',
        isNumber: true,
      },
      {
        field: 'NILAI',
        header: 'Nilai',
        isNumber: true,
      },
    ];

    this.httpClient
      .post<any>(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .subscribe(
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
}
