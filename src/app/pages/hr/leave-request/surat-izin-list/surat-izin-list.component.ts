import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SuratIzinListService } from './surat-izin-list.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-surat-izin-list',
  templateUrl: './surat-izin-list.component.html',
  styleUrl: './surat-izin-list.component.scss',
  providers: [SuratIzinListService, MessageService],
})
export class SuratIzinListComponent implements OnInit {
  ms: any;
  dateRange: any;
  table: any;
  TableIzin: any;
  ListTableIzin: any;
  StatusOptions: any[] = [
    { name: 'Open', value: '3.1' },
    { name: 'Approved', value: '3.2' },
    { name: 'Rejected', value: '3.3' },
  ];
  KategoriOptions: any[] = [
    {
      name: 'Izin Masuk Siang/Pulang Cepat',
      value: 'Izin Masuk Siang/Pulang Cepat',
    },
    { name: 'Lain - lain', value: 'Lain - lain' },
  ];
  valuestatusOptions: string = '';
  valuekategoriOptions: string = '';
  currentCompany: any;
  currentIns: any;
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedDeptSect: any;
  selectedStatus: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  cols: any[] = [];
  items: any[] = [];
  selectedPermit: any;
  selectedDateIn: Date;
  selectedDateOut: Date;
  selectedTimeIn: Date;
  selectedTimeOut: Date;
  displayModal: boolean = false;
  selectedKategori: any;
  minDate: Date;
  maxDate: Date;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SuratIzinListService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  ngOnInit(): void {
    // this.ListIzin();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 3);
    this.minDate.setDate(this.minDate.getDate() - 3);
    this.getDepartment();
    this.setDefaultKategori(this.selectedKategori);
    $('#tableListIzin').attr('hidden', 'hidden');
  }

  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
  }

  getDeptIds() {
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  onChangeStatus(selectedStatus: any) {
    console.log(selectedStatus);
    this.selectedStatus = selectedStatus.value;
  }

  setDefaultKategori(value: string) {
    this.valuekategoriOptions =
      this.KategoriOptions.find((option) => option.value === value) ?? null;
    this.selectedKategori = this.valuekategoriOptions;
  }

  onChangeKategori(event: any) {
    this.selectedKategori = event.value;
    console.log('Selected category value:', this.selectedKategori);
  }

  getDepartment() {
    this.optionListDepartmentHR = [];
    this.httpService
      .GetDeptSect(
        '4',
        localStorage.getItem('currentGroupCode'),
        localStorage.getItem('currentDeptName'),
        localStorage.getItem('currentSectName')
      )
      .subscribe(
        (data) => {
          const department = data.map((item: any) => {
            return {
              label: item.DSName,
              departmentId: item.DeptCode,
              sectionId: item.SectCode,
              departmentName: item.DeptName,
              sectionName: item.SectName,
              DSCode: item.DSCode,
            };
          });
          this.optionListDepartmentHR = department;
        },
        (error) => {
          // Handle error
        }
      );
  }

  compareTwoTimesM() {
    let input = '12:10';
    let tmp = input.split(':');
    this.ms = new Date();
    this.ms.setHours(parseInt(tmp[0]));
    this.ms.setMinutes(parseInt(tmp[1]));
  }

  parseTime(dateString: string): Date {
    let date = new Date(dateString);
    return new Date(
      1970,
      0,
      1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
  }

  InsEditIzin() {
    const year1: number = this.selectedDateIn.getFullYear();
    const month1: number = this.selectedDateIn.getMonth() + 1;
    const day1: number = this.selectedDateIn.getDate();

    const monthString1: string = month1 < 10 ? '0' + month1 : '' + month1;
    const dayString1: string = day1 < 10 ? '0' + day1 : '' + day1;

    const year2: number = this.selectedDateOut.getFullYear();
    const month2: number = this.selectedDateOut.getMonth() + 1;
    const day2: number = this.selectedDateOut.getDate();

    const monthString2: string = month2 < 10 ? '0' + month2 : '' + month2;
    const dayString2: string = day2 < 10 ? '0' + day2 : '' + day2;

    const formattedTimeIn: string = this.selectedTimeIn.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedTimeOut: string = this.selectedTimeOut.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

    const dateIn: string =
      `${year1}-${monthString1}-${dayString1}` + ' ' + formattedTimeIn;
    const dateOut: string =
      `${year2}-${monthString2}-${dayString2}` + ' ' + formattedTimeOut;

    const keterangan: string = $('#keterangan').val() as string;
    const noSurat: string = $('#noSurat').val() as string;

    this.httpService
      .InsertEdit(noSurat, this.selectedKategori, dateIn, dateOut, keterangan)
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Update Izin Berhasil',
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Update Cuti',
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal Update Cuti',
          });
        },
        () => {}
      );
  }

  getCommand() {
    $('#tableListIzin').removeAttr('hidden');
    this.ListIzin();
  }

  ListIzin() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const deptString = this.getDeptIds().join(',');
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });
    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];
    this.TableIzin = $('#ListIzin').DataTable();
    this.TableIzin.destroy();
    this.ListTableIzin = {
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
          code: 5,
          param1: 'RPT1',
          param8: deptString,
          param4: tanggalAwal,
          param5: tanggalAkhir,
          param6: this.selectedStatus,
          company: this.currentIns,
        },
      },
      columns: [
        {
          title: 'Action',
          data: null,
          className: 'dt-body-center',
          render: function (t: any) {
            const GroupCode = localStorage.getItem('currentGroupCode');

            // Cek apakah GroupCode bukan 'CSS-006'
            if (GroupCode !== 'CSS-006') {
              return '<button id="edit" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Edit" type="button">\t\t\t\t\t\t\t<i class="fa fa-pencil"></i>\t\t\t\t\t\t</Button>';
              // return '<button id="detail" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail" type="button">\t\t\t\t\t\t\t<i class="fa fa-ellipsis-h"></i>\t\t\t\t\t\t</Button>';
            } else {
              return '';
            }
          },
        },
        {
          title: 'No Surat',
          data: 'PermitNo',
        },
        {
          title: 'Register',
          data: 'RegNo',
          className: 'dt-body-center',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Departement',
          data: 'DeptName',
          className: 'dt-body-center',
        },
        {
          title: 'Section',
          data: 'SectionName',
          className: 'dt-body-center',
        },
        {
          title: 'Dari',
          data: 'DT1',
        },
        {
          title: 'Sampai',
          data: 'DT2',
        },
        {
          title: 'Keterangan',
          data: 'Note',
          className: '',
        },
        {
          title: 'Status Approve 1',
          data: 'StatusAppr1',
          className: 'dt-body-center',
        },
        {
          title: 'Status Approve 2',
          data: 'StatusAppr2',
          className: 'dt-body-center',
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#edit', row).bind('click', () => {
          this.selectedPermit = data;
          this.displayModal = true;
          this.valuekategoriOptions = this.selectedPermit.CategoryLR;
          this.selectedDateIn = new Date(this.selectedPermit.DT1);
          this.selectedDateOut = new Date(this.selectedPermit.DT2);
          this.selectedTimeIn = this.parseTime(this.selectedPermit.DT1);
          this.selectedTimeOut = this.parseTime(this.selectedPermit.DT2);
          this.onChangeKategori(this.valuekategoriOptions);
        });
      },
    };
    this.TableIzin = $('#ListIzin').DataTable(this.ListTableIzin);
  }

  DetailIzin(permitno: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }
    const params = {
      code: '',
      param1: '',
      permitno: '',
    };
    this.cols = [
      { field: 'PermitNo', header: 'No Surat' },
      { field: 'DT1', header: 'Tanggal Awal' },
      { field: 'DT2', header: 'Tanggal Akhir' },
      { field: 'RegNo', header: 'Register' },
      { field: 'EmployeeName', header: 'Name' },
    ];

    this.httpClient.post<any>(url, params).subscribe(
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

  Kembali() {
    this.route.navigate(['hr/leaverequest/listreport']);
  }
}
