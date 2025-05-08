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
import { ReturinternService } from './returintern.service';
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-returintern',
  templateUrl: './returintern.component.html',
  styleUrl: './returintern.component.scss',
  providers: [MessageService, ReturinternService],
})
export class ReturinternComponent implements OnInit, AfterViewInit {
  dateRange: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  optionListGudang: any;
  selectedGudang: any = {};
  selectedCategory: any = null;

  categories: any[] = [
    { name: 'Per Group', key: 'Per Group' },
    { name: 'Per Group + SubGroup', key: 'Per Group + SubGroup' },
    { name: 'Detail Barang', key: 'Detail Barang' },
  ];

  TableReturIntern: any;
  ReturTableIntern: any;
  TableDetailbarang: any;
  DetailTableBarang: any;
  selectedGudangDetail: any;
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;

  dataTable: any;

  constructor(
    private route: Router,
    private httpService: ReturinternService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.getGudang();
    this.selectedCategory = this.categories[1];
    $('#tableReturIntern').attr('hidden', 'hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
  }

  ngAfterViewInit(): void {
    // this.TablePerGroup();
  }

  // onCategoryChange(categoryKey: string): void {
  //   // Destroy the existing DataTable instance to avoid conflicts
  //   if (this.dataTable) {
  //     this.dataTable.destroy();
  //   }

  //   // Load the appropriate table based on the selected category
  //   switch (categoryKey) {
  //     case 'Per Group':
  //       this.TablePerGroup();
  //       break;
  //     case 'Per Group + SubGroup':
  //       this.TablePerGroupSubGroup();
  //       break;
  //     // case 'Detail Barang':
  //     //   this.TableDetailBarang();
  //     //   break;
  //     default:
  //       console.warn('Invalid category selected:', categoryKey);
  //   }
  // }

  createReturInternChart(): void {
    const dataArray = this.dataTable?.rows().data().toArray() || [];
    const chartData = dataArray.map((item: any) => ({
      name: item.NamaGroup,
      y: parseFloat(item.Nilai) || 0,
    }));

    if (chartData.length > 0) {
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: 'ReturInternChart',
          type: 'pie',
        },
        title: { text: 'Retur Intern by Group' },
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

  createReturInternbyGroupSubGroupChart(): void {
    const dataArray = this.dataTable?.rows().data().toArray() || [];
    const chartData = dataArray.map((item: any) => ({
      name: item.NamaGroup,
      y: parseFloat(item.Nilai) || 0,
    }));

    if (chartData.length > 0) {
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: 'ReturInternChart',
          type: 'pie',
        },
        title: { text: 'Retur Intern by Group + SubGroup' },
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
    this.httpService.SP_22_data_gudang('1').subscribe(
      (data) => {
        const gudang = data.map((item: any) => {
          return {
            label: item.KdGdg,
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
        case 'Per Group':
          this.TablePerGroup();
          break;
        case 'Per Group + SubGroup':
          this.TablePerGroupSubGroup();
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
    $('#tableReturIntern').removeAttr('hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    this.TableReturIntern = $('#returIntern').DataTable();
    this.TableReturIntern.destroy();
    this.ReturTableIntern = {
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
          code: 15,
          param1: GudangString,
          param2: tanggalAwal,
          param3: tanggalAkhir,
        },
      },
      columns: [
        {
          title: 'Kode Gudang',
          data: 'KdGudang',
          className: 'dt-body-center',
        },
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
        this.dataTable = $('#returIntern').DataTable();
        this.createReturInternChart();
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedGudangDetail = data;
          const NamaGroup = this.selectedGudangDetail.NamaGroup;
          this.DetailReturIntern(NamaGroup);
          this.displayModal = true;
        });
      },
    };
    this.TableReturIntern = $('#returIntern').DataTable(this.ReturTableIntern);
  }

  TablePerGroupSubGroup() {
    $('#tableReturIntern').removeAttr('hidden');
    $('#tableDetailBarang').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    this.TableReturIntern = $('#returIntern').DataTable();
    this.TableReturIntern.destroy();
    this.ReturTableIntern = {
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
          code: 17,
          param1: GudangString,
          param2: tanggalAwal,
          param3: tanggalAkhir,
        },
      },
      columns: [
        {
          title: 'Kode Gudang',
          data: 'KdGudang',
          className: 'dt-body-center',
        },
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
        this.dataTable = $('#returIntern').DataTable();
        this.createReturInternbyGroupSubGroupChart();
      },
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedGudangDetail = data;
          const NamaGroup = this.selectedGudangDetail.NamaGroup;
          this.DetailReturIntern(NamaGroup);
          this.displayModal = true;
        });
      },
    };
    this.TableReturIntern = $('#returIntern').DataTable(this.ReturTableIntern);
  }

  TableDetailBarang() {
    $('#tableDetailBarang').removeAttr('hidden');
    $('#tableReturIntern').attr('hidden', 'hidden');
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
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
          code: 18,
          param1: GudangString,
          param2: tanggalAwal,
          param3: tanggalAkhir,
          param4: 'Detail',
        },
      },
      columns: [
        {
          title: 'Kode Gudang',
          data: 'KdBrg',
          className: 'dt-body-center',
        },
        {
          title: 'Brand',
          data: 'Brand',
          className: 'dt-body-center',
        },
        {
          title: 'Nama Barang',
          data: 'NamaBrg',
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
          title: 'Satuan Pakai',
          data: 'SatuanPakai',
          className: 'dt-body-center',
        },
        {
          title: 'Jumlah',
          data: 'Jumlah',
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

  DetailReturIntern(NamaGroup: any) {
    var url;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_22_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_22_data_ajax';
    }
    const GudangString = this.getGudangIds().join(',');
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];

    const params = new URLSearchParams();
    params.set('code', '18');
    params.set('param1', GudangString);
    params.set('param2', tanggalAwal);
    params.set('param3', tanggalAkhir);
    params.set('param4', 'Grup');
    params.set('param5', NamaGroup);

    this.cols = [
      { field: 'KdBrg', header: 'Kode Gudang' },
      { field: 'Brand', header: 'Brand' },
      { field: 'NamaBrg', header: 'Nama Barang' },
      { field: 'NamaGroup', header: 'Group' },
      { field: 'NamaSubGroup', header: 'Sub Group' },
      { field: 'SatuanPakai', header: 'Satuan Pakai' },
      {
        field: 'Jumlah',
        header: 'Jumlah',
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
