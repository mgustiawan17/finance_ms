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
import { ReturexternService } from './returextern.service';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-returextern',
  templateUrl: './returextern.component.html',
  styleUrl: './returextern.component.scss',
  providers: [MessageService, ReturexternService],
})
export class ReturexternComponent implements OnInit, AfterViewInit {
  dateRange: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];

  selectedCategory: any = null;

  categories: any[] = [
    { name: 'Per Group', key: 'Per Group' },
    { name: 'Per Group + SubGroup', key: 'Per Group + SubGroup' },
    { name: 'Detail Barang', key: 'Detail Barang' },
  ];

  TableReturExtern: any;
  ReturTableExtern: any;
  TableDetailbarang: any;
  DetailTableBarang: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  selectedNamaGroup: any;

  dataTable: any;

  constructor(
    private route: Router,
    private httpService: ReturexternService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.selectedCategory = this.categories[1];
    $('#tableReturExtern').attr('hidden', 'hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
  }

  ngAfterViewInit(): void {
    // this.TablePerGroup();
  }

  createReturExternChart(): void {
    const dataArray = this.dataTable?.rows().data().toArray() || [];
    const chartData = dataArray.map((item: any) => ({
      name: item.NamaGroup,
      y: parseFloat(item.Nilai) || 0,
    }));

    if (chartData.length > 0) {
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: 'ReturExternChart',
          type: 'pie',
        },
        title: { text: 'Retur Extern by Group' },
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

  createReturExternbyGroupSubGroupChart(): void {
    const dataArray = this.dataTable?.rows().data().toArray() || [];
    const chartData = dataArray.map((item: any) => ({
      name: item.NamaGroup,
      y: parseFloat(item.Nilai) || 0,
    }));

    if (chartData.length > 0) {
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: 'ReturExternChart',
          type: 'pie',
        },
        title: { text: 'Retur Extern by Group + SubGroup' },
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

  getCommand(): void {
    // Hancurkan instance DataTable yang ada untuk menghindari konflik
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    console.log(this.selectedCategory.key);

    // Periksa kategori yang dipilih dan muat tabel yang sesuai
    if (this.selectedCategory.key == 'Per Group') {
      this.TablePerGroup();
    } else if (this.selectedCategory.key == 'Per Group + SubGroup') {
      this.TablePerGroupSubGroup();
    } else {
      this.TableDetailBarang();
    }
  }

  TablePerGroup() {
    $('#tableReturExtern').removeAttr('hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
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
    this.TableReturExtern = $('#returExtern').DataTable();
    this.TableReturExtern.destroy();
    this.ReturTableExtern = {
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
          code: 21,
          param2: tanggalAwal,
          param3: tanggalAkhir,
        },
      },
      columns: [
        {
          title: 'Nama Group',
          data: 'NamaGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Nilai',
          data: 'Nilai',
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
        this.dataTable = $('#returExtern').DataTable();
        this.createReturExternChart();
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedNamaGroup = data;
          const NamaGroup = this.selectedNamaGroup.NamaGroup;
          this.DetailReturExtern(NamaGroup);
          this.displayModal = true;
        });
      },
    };
    this.TableReturExtern = $('#returExtern').DataTable(this.ReturTableExtern);
  }

  TablePerGroupSubGroup() {
    $('#tableReturExtern').removeAttr('hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
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
    this.TableReturExtern = $('#returExtern').DataTable();
    this.TableReturExtern.destroy();
    this.ReturTableExtern = {
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
          code: 23,
          param2: tanggalAwal,
          param3: tanggalAkhir,
        },
      },
      columns: [
        {
          title: 'Nama Group',
          data: 'NamaGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Nilai',
          data: 'Nilai',
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
        this.dataTable = $('#returExtern').DataTable();
        this.createReturExternbyGroupSubGroupChart();
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedNamaGroup = data;
          const NamaGroup = this.selectedNamaGroup.NamaGroup;
          this.DetailReturExtern(NamaGroup);
          this.displayModal = true;
        });
      },
    };
    this.TableReturExtern = $('#returExtern').DataTable(this.ReturTableExtern);
  }

  TableDetailBarang() {
    $('#tableDetailBarang').removeAttr('hidden');
    $('#tableReturExtern').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
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
          code: 24,
          param2: tanggalAwal,
          param3: tanggalAkhir,
          param4: 'Detail',
        },
      },
      columns: [
        {
          title: 'Tanggal',
          data: 'TGL',
          className: 'dt-body-center',
        },
        {
          title: 'NO RE',
          data: 'NoRE',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Supplier',
          data: 'NamaSupp',
          className: 'dt-body-center',
        },
        {
          title: 'Kode Barang',
          data: 'kdBrg',
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
          title: 'HARGA',
          data: 'Harga',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Nilai',
          data: 'Nilai',
          className: 'dt-body-center',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
      ],
    };
    this.TableDetailbarang = $('#detailBarang').DataTable(
      this.DetailTableBarang
    );
  }

  DetailReturExtern(NamaGroup: any) {
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
    }
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];

    const params = new URLSearchParams();
    params.set('code', '24');
    params.set('param2', tanggalAwal);
    params.set('param3', tanggalAkhir);
    params.set('param4', 'Grup');
    params.set('param5', NamaGroup);

    this.cols = [
      { field: 'TGL', header: 'Tanggal' },
      { field: 'NoRE', header: 'NO RE' },
      { field: 'NamaSupp', header: 'Nama Supplier' },
      { field: 'kdBrg', header: 'Kode Barang' },
      { field: 'NamaBrg', header: 'Nama Barang' },
      { field: 'Brand', header: 'Brand' },
      { field: 'NamaGroup', header: 'Group' },
      { field: 'NamaSubGroup', header: 'Sub Group' },
      { field: 'QTY', header: 'QTY', isNumber: true },
      {
        field: 'Harga',
        header: 'HARGA',
        isNumber: true,
      },
      {
        field: 'Nilai',
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
