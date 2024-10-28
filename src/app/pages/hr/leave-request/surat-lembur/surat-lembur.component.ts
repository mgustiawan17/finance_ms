import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { SuratLemburService } from './surat-lembur.service';
import { MessageService } from 'primeng/api';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surat-lembur',
  templateUrl: './surat-lembur.component.html',
  styleUrl: './surat-lembur.component.scss',
  providers: [SuratLemburService, MessageService],
})
export class SuratLemburComponent implements OnInit {
  ms: any;
  selectedTime: Date;
  rangeDates: Date[] | undefined;
  table: any;
  TableTempLembur: any;
  ListTableTempLembur: any;
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedEmp: any;
  currentEmail: any;
  currentIns: any;
  optionListEmployee: any;
  selectedDeptSect: any;
  noSurat: string = '';
  selectedWork: Date;
  selectedDateIn: Date;
  selectedDateOut: Date;
  selectedTimeIn: Date;
  selectedTimeOut: Date;
  selectedPermit: any;
  OTCriteriaOptions: any[] = [
    {
      name: 'CSS-OT',
      value: 'CSS-OT',
    },
  ];
  valueOTCriteriaOptions: string = '';
  selectedOTCriteria: any;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    // private snackBar: MatSnackBar,
    private httpService: SuratLemburService,
    private messageService: MessageService
  ) {
    this.selectedTime = new Date();
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  ngOnInit(): void {
    $('#tableTempLembur').attr('hidden', 'hidden');
    this.getNoSurat();
    this.getDepartment();
  }

  onChangeOTCriteria(selectedOTCriteria: any) {
    console.log(selectedOTCriteria);
    this.selectedOTCriteria = selectedOTCriteria.value;
  }

  onChangeCompany(selectedCompany: string) {
    this.optionListDepartmentHR = [];
    this.optionListEmployee = [];
    this.selectedDept = null;
    this.selectedEmp = null;
    $('#keterangan').val('');
  }

  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    if (selectedDept && selectedDept.departmentId && selectedDept.sectionId) {
      const deptcode = selectedDept.departmentId;
      const sectcode = selectedDept.sectionId;
      this.getEmployee(deptcode, sectcode, this.currentIns);
    } else {
      console.log('error cok');
    }
  }

  onChangeEmployee(selectedEmp: any) {
    // console.log(selectedEmp);
    this.selectedEmp = selectedEmp;
  }

  getNoSurat() {
    this.httpService.GetNoSuratCuti().subscribe((data: any) => {
      this.noSurat = data ? data[0].PermitNo : '';
    });
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
          };
        });
        this.optionListDepartmentHR = department;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getEmployee(deptcode: any, sectcode: any, company: string) {
    this.optionListEmployee = [];
    this.httpService.GetEmployee('6', deptcode, sectcode, company).subscribe(
      (data) => {
        const employees = data.map((item: any) => {
          return {
            label: item.RegisterNo + ' | ' + item.EmpName,
            // value: item.RegisterNo,
            registerId: item.RegisterNo,
          };
        });
        this.optionListEmployee = employees;
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

  getCommand() {
    $('#tableTempLembur').removeAttr('hidden');
    // var tanggal = $('#tanggal').val();
    // var pecah = tanggal.split('s/d');
    // this.periode_awal = pecah[0];
    // this.periode_akhir = pecah[1];
    this.InsTempLembur();
  }

  InsTempLembur() {
    const year: number = this.selectedWork.getFullYear();
    const month: number = this.selectedWork.getMonth() + 1;
    const day: number = this.selectedWork.getDate();

    const monthString: string = month < 10 ? '0' + month : '' + month;
    const dayString: string = day < 10 ? '0' + day : '' + day;

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

    const dateWork: string = `${year}-${monthString}-${dayString}`;
    const dateIn: string =
      `${year1}-${monthString1}-${dayString1}` + ' ' + formattedTimeIn;
    const dateOut: string =
      `${year2}-${monthString2}-${dayString2}` + ' ' + formattedTimeOut;

    const keterangan: string = $('#keterangan').val() as string;

    this.httpService
      .InsertTempLembur(
        this.noSurat,
        this.selectedEmp.registerId,
        this.currentEmail,
        dateIn,
        dateOut,
        dateWork,
        keterangan
      )
      .subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Berhasil masuk temporary/data sementara',
            });
            this.ListTempLembur();
          } else if (
            response.data.ErrMsg == 'Karyawan tersebut sudah ada di list'
          ) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: 'Karyawan tersebut sudah ada di list temporary',
            });
            // this.ListTempLembur();
          } else if (
            response.data.ErrMsg ==
            'User Approve karyawan tersebut tidak sesuai'
          ) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: 'User Approve karyawan tersebut tidak sesuai',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Gagal Masuk Temporary',
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

  ListTempLembur() {
    $('#tableTempLembur').removeAttr('hidden');
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    this.TableTempLembur = $('#TempLembur').DataTable();
    this.TableTempLembur.destroy();
    this.ListTableTempLembur = {
      // destroy: true,
      // paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 209,
          permitno: this.noSurat,
          userid: this.currentEmail,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
        },
        {
          title: 'Register',
          data: 'NoReg',
          className: 'dt-body-center',
        },
        {
          title: 'Nama',
          data: 'EmployeeName',
        },
        {
          title: 'Tanggal Awal',
          data: 'DT1',
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Akhir',
          data: 'DT2',
          className: 'dt-body-center',
        },
        {
          title: 'Action',
          data: null,
          className: 'dt-body-center',
          render: function (t: any) {
            // tslint:disable-next-line: max-line-length
            return '<button id="deleteTemporary" class="btn m-portlet__nav-link btn m-btn m-btn–hover-danger m-btn–icon m-btn–icon-only m-btn–pill btn-outline-danger" title="Hapus" type="button">\t\t\t<i class="fa fa-trash"></i>\t\t\t</Button>\t\t\t\t\t\t';
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#deleteTemporary', row).bind('click', () => {
          this.selectedPermit = data;
          this.deleteTemporaryItem(this.selectedPermit.Id, this.noSurat);
        });
      },
    };
    this.TableTempLembur = $('#TempLembur').DataTable(this.ListTableTempLembur);
  }

  simpan() {
    this.httpService
      .SaveLembur(
        this.noSurat,
        this.currentIns,
        this.selectedDept.departmentId,
        this.selectedDept.departmentName,
        this.selectedDept.sectionId,
        this.selectedDept.sectionName
      )
      .subscribe(
        (data) => {
          if (data.status === 200) {
            // toastr.success('Data lembur berhasil disimpan', 'Berhasil!');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data lembur berhasil disimpan',
            });
            window.location.reload();
          } else {
            // toastr.error('Data lembur gagal disimpan', 'Gagal!');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Data lembur gagal disimpan',
            });
          }
        },
        (error) => {
          console.log(error);
          // toastr.error(
          //   'Data lembur gagal disimpan, terjadi kesalahan pada sistem, hubungin administrator',
          //   'Terjadi Kesalahan!'
          // );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Data lembur gagal disimpan, terjadi kesalahan pada sistem, hubungin administrator',
          });
        },
        () => {
          // $('#tableDataTemporaryLembur').attr('hidden', 'hidden');
          // this.initSelect2();
          // this.initDatePicker();
          // // this.initTimePicker();
          // this.getDept();
          // this.getSec();
          // $('#time1').val(null);
          // $('#time2').val(null);
          // // $('#jam_awal, #jam_akhir').val('0:00');
          // $('#keterangan').val('');
          // $('#company').prop('disabled', false);
          // $('#departement').prop('disabled', false);
          // $('#section').prop('disabled', false);
          // $('#tanggal_bekerja').prop('disabled', false);
          // $('#tanggal_awal').prop('disabled', false);
          // $('#keterangan').prop('disabled', false);
          window.location.reload();
        }
      );
  }

  batalSimpan() {
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Semua data temporary akan di hapus dan surat lembur di batalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, batalkan!',
      cancelButtonText: 'Tidak!',
    }).then((result) => {
      if (result.value) {
        this.httpService.DeleteTemp(this.noSurat).subscribe(
          (data) => {
            if (data.status === 200) {
              // toastr.success('Berhasil hapus data lembur!', 'Berhasil!');
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Berhasil hapus data lembur!',
              });
            } else {
              // toastr.success('Gagal hapus data lembur!', 'Gagal!');
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal hapus data lembur!',
              });
            }
          },
          (error) => {
            console.log(error);
            // toastr.success(
            //   'Gagal hapus data lembur, terjadi kesalahan pada sistem, hubungi administrator',
            //   'Terjadi Kesalahan!'
            // );
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Gagal hapus data lembur, terjadi kesalahan pada sistem, hubungi administrator',
            });
          },
          () => {
            // $('#tableDataTemporaryLembur').attr('hidden', 'hidden');
            // this.initSelect2();
            // this.initDatePicker();
            // // this.initTimePicker();
            // this.getDept();
            // this.getSec();
            // $('#time1').val(null);
            // $('#time2').val(null);
            // // $('#jam_awal, #jam_akhir').val('0:00');
            // $('#keterangan').val('');
            // // $('#company').prop('disabled', false);
            // $('#departement').prop('disabled', false);
            // $('#section').prop('disabled', false);
            // $('#tanggal_bekerja').prop('disabled', false);
            // $('#tanggal_awal').prop('disabled', false);
            // $('#keterangan').prop('disabled', false);
            window.location.reload();
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Tidak di batalkan', 'Data lembur tetap aman :)', 'error');
      }
    });
  }

  deleteTemporaryItem(Id: any, permitno: any) {
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda harus menginput ulang bila salah satu temporary di hapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batalkan!',
    }).then((result) => {
      if (result.value) {
        this.httpService.DeleteTempId(Id, permitno).subscribe(
          (data) => {
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Berhasil hapus data temporary lembur!',
              });
              this.ListTempLembur();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal hapus data temporary lembur!',
              });
            }
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Gagal menghapus data temporary lembur, terdapat kesalahan pada sistem, hubungi administrator',
            });
          },
          () => {
            // this.listDataLemburKaryawan(permitno);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Dibatalkan', 'Data tetap aman :)', 'error');
      }
    });
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/newrequest']);
  }
}
