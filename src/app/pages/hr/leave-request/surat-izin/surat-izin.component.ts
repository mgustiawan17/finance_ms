import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { SuratIzinService } from './surat-izin.service';
import { MessageService } from 'primeng/api';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surat-izin',
  templateUrl: './surat-izin.component.html',
  styleUrl: './surat-izin.component.scss',
  providers: [SuratIzinService, MessageService],
})
export class SuratIzinComponent implements OnInit {
  ms: any;
  selectedTime: Date;
  rangeDates: Date[] | undefined;
  table: any;
  TableTempIzin: any;
  ListTableTempIzin: any;
  KategoriOptions: any[] = [
    {
      name: 'Izin Masuk Siang/Pulang Cepat',
      value: 'Izin Masuk Siang/Pulang Cepat',
    },
    { name: 'Lain - lain', value: 'Lain - lain' },
  ];
  valuekategoriOptions: string = '';
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedEmp: any;
  currentEmail: any;
  currentIns: any;
  optionListEmployee: any;
  selectedDeptSect: any;
  noSurat: string = '';
  selectedDateIn: Date;
  selectedDateOut: Date;
  selectedTimeIn: Date;
  selectedTimeOut: Date;
  selectedPermit: any;
  selectedKategori: any;
  GroupCode: any;
  minDate: Date;
  maxDate: Date;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SuratIzinService,
    private messageService: MessageService
  ) {
    this.selectedTime = new Date();
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
    this.GroupCode = localStorage.getItem('currentGroupCode');
  }

  ngOnInit() {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 3);
    this.minDate.setDate(this.minDate.getDate() - 3);
    $('#tableTempIzin').attr('hidden', 'hidden');
    this.getDepartment();
    this.getNoSurat();
  }

  onChangeCompany(selectedCompany: string) {
    this.optionListDepartmentHR = [];
    this.optionListEmployee = [];
    this.selectedDept = null;
    this.selectedEmp = null;
    $('#keterangan').val('');
    this.valuekategoriOptions = '';
  }

  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    const deptString = this.getDeptIds().join(',');
    this.getEmployee(deptString);
  }

  getDeptIds() {
    // Extract DSCode from each selected object
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  onChangeEmployee(selectedEmp: any) {
    this.selectedEmp = selectedEmp;
  }

  onChangeKategori(selectedKategori: any) {
    console.log(selectedKategori);
    this.selectedKategori = selectedKategori.value;
  }

  getNoSurat() {
    this.httpService.GetNoSuratIzin().subscribe((data: any) => {
      this.noSurat = data ? data[0].PermitNo : '';
    });
  }

  getDepartment() {
    this.optionListDepartmentHR = [];
    this.httpService
      .GetDeptSect(
        '4',
        this.GroupCode,
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

  getEmployee(dscode: any) {
    this.optionListEmployee = [];
    this.httpService.GetEmployee('6a', dscode).subscribe(
      (data) => {
        const employees = data.map((item: any) => {
          return {
            label: item.RegisterNo + ' | ' + item.EmpName,
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

  InsertIzin(): void {
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
      hour12: false,
    });

    const formattedTimeOut: string = this.selectedTimeOut.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
    );

    const dateIn: string =
      `${year1}-${monthString1}-${dayString1}` + ' ' + formattedTimeIn;
    const dateOut: string =
      `${year2}-${monthString2}-${dayString2}` + ' ' + formattedTimeOut;
    // console.log(dateIn, dateOut);
    if (dateOut < dateIn) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Tanggal dan waktu tidak valid. Periksa kembali!',
      });
      return;
    }

    const keterangan: string = $('#keterangan').val() as string;

    this.httpService
      .InsertSuratizin(
        this.selectedKategori,
        dateIn,
        dateOut,
        keterangan,
        this.selectedEmp.registerId,
        this.currentEmail
      )
      .subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Surat Izin Berhasil Dibuat',
            });
            this.getNoSurat();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Sisa Izin Tidak Mencukupi!',
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

  getCommand() {
    $('#tableTempIzin').removeAttr('hidden');
    this.InsTempCuti();
  }

  InsTempCuti() {
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

    this.httpService
      .InsertTempIzin(
        this.noSurat,
        this.selectedEmp.registerId,
        this.currentEmail,
        dateIn,
        dateOut,
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
            this.ListTempCuti();
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

  ListTempCuti() {
    $('#tableTempIzin').removeAttr('hidden');
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    this.TableTempIzin = $('#TempIzin').DataTable();
    this.TableTempIzin.destroy();
    this.ListTableTempIzin = {
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: '<"mr-1 btn btn-sm" B>lfrtip',
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 409,
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
    this.TableTempIzin = $('#TempIzin').DataTable(this.ListTableTempIzin);
  }

  simpan() {
    this.httpService
      .SaveIzin(
        this.noSurat,
        this.selectedDept.departmentId,
        this.selectedDept.departmentName,
        this.selectedDept.sectionId,
        this.selectedDept.sectionName,
        this.selectedKategori
      )
      .subscribe(
        (data) => {
          if (data.status === 200) {
            // toastr.success('Data lembur berhasil disimpan', 'Berhasil!');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data izin berhasil disimpan',
            });
            window.location.reload();
          } else {
            // toastr.error('Data lembur gagal disimpan', 'Gagal!');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Data izin gagal disimpan',
            });
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Data izin gagal disimpan, terjadi kesalahan pada sistem, hubungin administrator',
          });
        },
        () => {
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Gagal hapus data lembur, terjadi kesalahan pada sistem, hubungi administrator',
            });
          },
          () => {
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
              this.ListTempCuti();
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
