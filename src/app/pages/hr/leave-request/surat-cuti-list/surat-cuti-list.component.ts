import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SuratCutiListService } from './surat-cuti-list.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-surat-cuti-list',
  templateUrl: './surat-cuti-list.component.html',
  styleUrl: './surat-cuti-list.component.scss',
  providers: [SuratCutiListService, MessageService],
})
export class SuratCutiListComponent implements OnInit {
  dateRange: any;
  table: any;
  TableCuti: any;
  ListTableCuti: any;
  valuejeniscutiOptions: string = '';
  SisaCuti: any;
  selectedJenis: any;
  jeniscutiOptions: any;
  selectedEmp: any;
  StatusOptions: any[] = [
    { name: 'Open', value: '3.1' },
    { name: 'Approved', value: '3.2' },
    { name: 'Rejected', value: '3.3' },
  ];
  valuestatusOptions: string = '';
  currentCompany: any;
  currentIns: any;
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedDeptSect: any;
  selectedStatus: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  displayModal: boolean = false;
  selectedPermit: any;
  selectedDateIn: Date;
  selectedDateOut: Date;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SuratCutiListService,
    private messageService: MessageService
  ) {
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  ngOnInit(): void {
    this.getJenisCuti();
    this.getDepartment();
    $('#tableListCuti').attr('hidden', 'hidden');
  }

  onChangeDepartment(selectedDept: any[]) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
  }

  getDeptIds() {
    // Extract registerId from each selected object
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  onChangeStatus(selectedStatus: any) {
    console.log(selectedStatus);
    this.selectedStatus = selectedStatus.value;
  }

  onChangeJenisCuti(selectedJenis: any) {
    this.SisaCuti = '';
    console.log('Jenis cuti yang dipilih:', selectedJenis);
    this.selectedJenis = selectedJenis;
    const regNo: string = this.selectedPermit ? this.selectedPermit.RegNo : '';

    if (regNo) {
      if (
        this.selectedJenis === 'Cuti Tahunan' ||
        this.selectedJenis === 'Cuti Tahun Lalu'
      ) {
        this.getSisaCuti(regNo, this.selectedJenis, this.currentIns);
      } else {
        console.log('Jenis cuti tidak dikenal:', selectedJenis);
      }
    }
  }

  onDateSelect(event: any) {
    console.log('Selected date range:', this.selectedPeriode);
    // Ensure the dates are processed correctly without time information
  }

  getDepartment() {
    this.optionListDepartmentHR = [];
    this.httpService.GetDeptSect('4').subscribe(
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

  getJenisCuti() {
    // this.jeniscutiOptions = [];
    this.httpService.GetJenisCuti('5').subscribe(
      (data) => {
        this.jeniscutiOptions = data.map((item: any) => {
          return {
            label: item.PermitType,
            value: item.PermitType,
            qty: item.QTY,
          };
        });
        this.setSelectedJenisCuti(this.selectedJenis);
      },
      (error) => {
        console.error('Error fetching jenis cuti', error);
      }
    );
  }

  setSelectedJenisCuti(value: string) {
    const foundOption = this.jeniscutiOptions.find(
      (option: any) => option.label === value
    );
    if (foundOption) {
      this.valuejeniscutiOptions = foundOption;
      this.onChangeJenisCuti(foundOption);
    }
  }

  getSisaCuti(register: string, jenisCuti: string, company: string) {
    this.httpService.GetSisaCuti('103', register, jenisCuti, company).subscribe(
      (data) => {
        this.SisaCuti = data[0].AnnualLeaveQty;
      },
      (error) => {
        // toastr.error('Gagal memuat sisa cuti dengan register ' + this.register, 'Terjadi Kesalahan!');
        console.log(error);
      },
      () => {
        // if (this.sisaCuti == 0 && this.sisaCuti == '') {
        //     $('#proses').attr('disabled', true);
        // } else {
        //     $('#proses').attr('disabled', false);
        // }
      }
    );
  }

  getCommand() {
    $('#tableListCuti').removeAttr('hidden');
    this.ListCuti();
  }

  ListCuti() {
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
    this.TableCuti = $('#ListCuti').DataTable();
    this.TableCuti.destroy();
    this.ListTableCuti = {
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
            return '<button id="edit" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Edit" type="button">\t\t\t\t\t\t\t<i class="fa fa-pencil"></i>\t\t\t\t\t\t</Button>';
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
          render: function (data: any) {
            const date = new Date(data);

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const formattedDay = day < 10 ? '0' + day : day;
            const formattedMonth = month < 10 ? '0' + month : month;

            const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

            return formattedDate;
          },
        },
        {
          title: 'Sampai',
          data: 'DT2',
          render: function (data: any) {
            const date = new Date(data);

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const formattedDay = day < 10 ? '0' + day : day;
            const formattedMonth = month < 10 ? '0' + month : month;

            const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

            return formattedDate;
          },
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
          this.selectedDateIn = new Date(this.selectedPermit.DT1);
          this.selectedDateOut = new Date(this.selectedPermit.DT2);
          this.valuejeniscutiOptions = this.selectedPermit.CategoryLR;
          this.onChangeJenisCuti(this.valuejeniscutiOptions);
        });
      },
    };
    this.TableCuti = $('#ListCuti').DataTable(this.ListTableCuti);
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

    const dateIn: any = `${year1}-${monthString1}-${dayString1}`;
    const dateOut: any = `${year2}-${monthString2}-${dayString2}`;

    const keterangan: string = $('#keterangan').val() as string;
    const regNo: string = $('#reg').val() as string;
    const noSurat: string = $('#noSurat').val() as string;

    const selisih = (dateIn - dateOut) / (24 * 60 * 60 * 1000);
    const sisaCutiNumber: number = Number(this.SisaCuti);

    if (
      selisih > sisaCutiNumber &&
      (this.selectedJenis === 'Cuti Tahun Lalu' ||
        this.selectedJenis === 'Cuti Tahunan')
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Sisa Cuti Tidak Mencukupi!',
      });
    } else {
      this.httpService
        .InsertEdit(
          noSurat,
          this.selectedJenis,
          regNo,
          dateIn,
          dateOut,
          keterangan,
          '',
          this.currentIns
        )
        .subscribe(
          (response: any) => {
            if (response.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Update Cuti Berhasil',
              });
              this.displayModal = false;
              $('#tableListCuti').attr('hidden', 'hidden');
            } else if (
              response.data[0].ErrMsg === 'Periksa kembali tanggal cuti!'
            ) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: 'Periksa kembali tanggal cuti!',
              });
            } else if (
              response.data[0].ErrMsg === 'Sisa cuti tidak mencukupi!'
            ) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: 'Sisa cuti tidak mencukupi!',
              });
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
            } else if (response.data === 'SisaCuti: 0') {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: 'Sisa Cuti tidak mencukupi!',
              });
            } else if (response.status === 502) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: 'Sisa Cuti tidak mencukupi!',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal Update Cuti',
              });
            }
          },
          (error: any) => {
            // this.snackBar.open('Sisa Cuti Tidak Mencukupi!', 'Cuti Gagal!', {
            //   duration: 2000,
            // });
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Update Cuti',
            });
          },
          () => {}
        );
    }
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/listreport']);
  }
}
