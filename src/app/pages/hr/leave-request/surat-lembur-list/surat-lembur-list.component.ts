import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SuratLemburListService } from './surat-lembur-list.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-surat-lembur-list',
  templateUrl: './surat-lembur-list.component.html',
  styleUrl: './surat-lembur-list.component.scss',
  providers: [SuratLemburListService, MessageService],
})
export class SuratLemburListComponent implements OnInit {
  ms: any;
  dateRange: any;
  table: any;
  TableLembur: any;
  ListTableLembur: any;
  TableLembur1: any;
  ListTableLembur1: any;
  OTCriteriaOptions: any[] = [
    {
      name: 'CSS-OT',
      value: 'CSS-OT',
    },
  ];
  StatusOptions: any[] = [
    { name: 'Open', value: '3.1' },
    { name: 'Approved', value: '3.2' },
    { name: 'Rejected', value: '3.3' },
  ];
  valuestatusOptions: string = '';
  valueOTCriteriaOptions: string = '';
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
  selectedItem: any = {};
  selectedDateIn: Date;
  selectedDateOut: Date;
  selectedTimeIn: Date;
  selectedTimeOut: Date;
  displayModal: boolean = false;
  displayEditModal: boolean = false;
  selectedOTCriteria: any;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SuratLemburListService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // this.ListLembur();
    this.getDepartment();
    // this.DetailLembur(this.selectedPermit.PermitNo);
    $('#tableListLembur').attr('hidden', 'hidden');
    if (this.selectedItem && this.selectedItem.DT1) {
      this.selectedDateIn = new Date(this.selectedItem.DT1);
    }
  }

  setDefaultOTCriteria(value: any) {
    // Cari opsi yang cocok
    this.valueOTCriteriaOptions =
      this.OTCriteriaOptions.find((option) => option.value === value) ?? null;
    // Set nilai kategori yang dipilih
    this.selectedOTCriteria = this.valueOTCriteriaOptions;
  }

  onChangeOTCriteria(event: any) {
    this.selectedOTCriteria = event;
    console.log('Selected OT Criteria value:', this.selectedOTCriteria);
  }

  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    // if (selectedDept && selectedDept.departmentId && selectedDept.sectionId) {
    //   const deptcode = selectedDept.departmentId;
    //   const sectcode = selectedDept.sectionId;
    //   const company = this.valuecompanyOptions;
    //   this.getEmployee(deptcode, sectcode, company);
    // } else {
    //   console.log('error cok');
    // }
  }

  getDeptIds() {
    // Extract registerId from each selected object
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  onChangeStatus(selectedStatus: any) {
    console.log(selectedStatus);
    this.selectedStatus = selectedStatus.value;
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

  getCommand() {
    $('#tableListLembur').removeAttr('hidden');
    // var tanggal = $('#tanggal').val();
    // var pecah = tanggal.split('s/d');
    // this.periode_awal = pecah[0];
    // this.periode_akhir = pecah[1];
    this.ListLembur();
  }

  ListLembur() {
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
    this.TableLembur = $('#ListLembur').DataTable();
    this.TableLembur.destroy();
    this.ListTableLembur = {
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
          code: 3,
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
            // tslint:disable-next-line: max-line-length
            return '<button id="detail" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail" type="button">\t\t\t\t\t\t\t<i class="fa fa-ellipsis-h"></i>\t\t\t\t\t\t</Button>';
          },
        },
        {
          title: 'Tanggal Pembuatan',
          data: 'CreateDate',
          render: function (data: any) {
            const date = new Date(data);

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const hours = date.getHours();
            const minutes = date.getMinutes();

            const formattedDay = day < 10 ? '0' + day : day;
            const formattedMonth = month < 10 ? '0' + month : month;
            const formattedHours = hours < 10 ? '0' + hours : hours;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

            const formattedDate = `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;

            return formattedDate;
          },
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Lembur',
          data: 'DT1',
          render: function (data: any) {
            const date = new Date(data);

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const hours = date.getHours();
            const minutes = date.getMinutes();

            const formattedDay = day < 10 ? '0' + day : day;
            const formattedMonth = month < 10 ? '0' + month : month;
            const formattedHours = hours < 10 ? '0' + hours : hours;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

            const formattedDate = `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}`;

            return formattedDate;
          },
          className: 'dt-body-center',
        },

        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
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
          title: 'Note',
          data: 'Note',
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
        // {
        //   title: 'Action',
        //   renderer:
        //     ' <button type="button" id="edit" class="btn btn-primary"></button>',
        //   className: 'dt-body-center',
        // },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedPermit = data;
          const PermitNo = this.selectedPermit.PermitNo;
          this.DetailLembur(PermitNo);
          this.displayModal = true;
          this.selectedDateIn = new Date(this.selectedPermit.DT1);
          this.selectedDateOut = new Date(this.selectedPermit.DT2);
          this.selectedTimeIn = this.parseTime(this.selectedPermit.DT1);
          this.selectedTimeOut = this.parseTime(this.selectedPermit.DT2);
          this.valueOTCriteriaOptions = this.selectedPermit.OTCriteria;
          this.onChangeOTCriteria(this.valueOTCriteriaOptions);
        });
      },
    };
    this.TableLembur = $('#ListLembur').DataTable(this.ListTableLembur);
  }

  DetailLembur(permitno: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_stat';
    } else {
      url = baseUrlLuar + 'Permit/Permit_stat';
    }
    const params = {
      code: 6,
      param1: 'SL',
      permitno: permitno,
    };

    const GroupCode = localStorage.getItem('currentGroupCode');

    this.cols = [
      { field: 'PermitNo', header: 'No Surat' },
      { field: 'DT1', header: 'Tanggal Awal' },
      { field: 'DT2', header: 'Tanggal Akhir' },
      { field: 'RegNo', header: 'Register' },
      { field: 'EmployeeName', header: 'Name' },
      { field: 'OTCriteria', header: 'OT Criteria' },
      // { field: 'action', header: 'Action' },
    ];

    if (GroupCode !== 'CSS-006') {
      this.cols.push({ field: 'action', header: 'Action' });
    }

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

  openEditDialog(item: any) {
    this.selectedItem = item; // Simpan item yang dipilih
    this.displayEditModal = true; // Tampilkan modal dialog untuk edit
  }

  InsEditCuti() {
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
    const regNo: string = $('#register').val() as string;
    const noSurat: string = $('#noSurat').val() as string;

    this.httpService
      .InsertEdit(
        noSurat,
        regNo,
        dateIn,
        dateOut,
        keterangan,
        this.valueOTCriteriaOptions
      )
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Update Lembur Berhasil',
            });
            setTimeout(() => {
              this.displayModal = false;
              this.displayEditModal = false;
              $('#tableListLembur').attr('hidden', 'hidden');
            }, 1500);
            // window.location.reload();
            // this.ListTempLembur();
            // } else if (
            //   response.data[0].ErrMsg === 'Karyawan tersebut sudah ada di list'
            // ) {
            //   this.messageService.add({
            //     severity: 'warn',
            //     summary: 'Warn',
            //     detail: 'Karyawan tersebut sudah ada di list temporary',
            //   });
            //   // this.ListTempLembur();
            // } else if (
            //   response.data[0].ErrMsg ===
            //   'User Approve karyawan tersebut tidak sesuai'
            // ) {
            //   this.messageService.add({
            //     severity: 'warn',
            //     summary: 'Warn',
            //     detail: 'User Approve karyawan tersebut tidak sesuai',
            //   });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Update Lembur',
            });
          }
        },
        (error: any) => {
          // this.snackBar.open('Sisa Cuti Tidak Mencukupi!', 'Cuti Gagal!', {
          //   duration: 2000,
          // });
        },
        () => {}
      );
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/listreport']);
  }

  KembaliEdit() {
    this.displayEditModal = false;
  }
}
