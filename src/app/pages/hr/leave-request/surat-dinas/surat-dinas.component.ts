import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SuratDinasService } from './surat-dinas.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Register } from '../../../../auth/model/register';
import { Observable, map, catchError } from 'rxjs';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surat-dinas',
  templateUrl: './surat-dinas.component.html',
  styleUrl: './surat-dinas.component.scss',
  providers: [SuratDinasService, MessageService],
  // encapsulation: ViewEncapsulation.None,
})
export class SuratDinasComponent implements OnInit {
  dateRange: any;
  table: any;
  TableTempDinas: any;
  ListTableTempDinas: any;
  noSurat: string = '';
  valuebuttonOptions: string = '';
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedEmp: any;
  currentEmail: any;
  currentIns: any;
  selectedJenis: any;
  currentCompany: any;
  optionListEmployee: any;
  selectedDeptSect: any;
  selectedPermit: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];

  constructor(
    private httpService: SuratDinasService,
    private messageService: MessageService,
    private route: Router
  ) {
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  ngOnInit(): void {
    this.getDepartment();
    this.getNoSurat();
    $('#tableTempDinas').attr('hidden', 'hidden');
  }

  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    if (selectedDept && selectedDept.departmentId && selectedDept.sectionId) {
      const deptcode = selectedDept.departmentId;
      const sectcode = selectedDept.sectionId;
      this.getEmployee(deptcode, sectcode);
    } else {
      console.log('error cok');
    }
  }

  // getDeptIds() {
  //   // Extract DSCode from each selected object
  //   return this.selectedDept.map((emp: any) => emp.DSCode);
  // }

  onChangeEmployee(selectedEmp: any) {
    // console.log(selectedEmp);
    this.selectedEmp = selectedEmp;
    // if (selectedEmp && selectedEmp.registerId) {
    //     const register = selectedEmp.registerId;
    //     // this.getSisaCuti1(register);
    // } else {
    //     console.log('error cok');
    // }
  }

  getNoSurat() {
    this.httpService.GetNoSuratCuti().subscribe((data: any) => {
      this.noSurat = data ? data[0].PermitNo : '';
    });
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

  getEmployee(deptcode: any, sectcode: any) {
    this.optionListEmployee = [];
    this.httpService.GetEmployee('6', deptcode, sectcode).subscribe(
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

  getCommand() {
    $('#tableTempLembur').removeAttr('hidden');
    // var tanggal = $('#tanggal').val();
    // var pecah = tanggal.split('s/d');
    // this.periode_awal = pecah[0];
    // this.periode_akhir = pecah[1];
    this.InsTempDinas();
  }

  InsTempDinas() {
    const formattedDates = this.selectedPeriode.map((date) => {
      // Extract the date in 'YYYY-MM-DD' format without time
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });

    const tanggalAwal: any = formattedDates[0];
    const tanggalAkhir: any = formattedDates[1];

    const keterangan: string = $('#keterangan').val() as string;

    this.httpService
      .InsertTempLembur(
        this.noSurat,
        this.selectedEmp.registerId,
        this.currentEmail,
        tanggalAwal,
        tanggalAkhir,
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
            this.ListTempDinas();
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

  ListTempDinas() {
    $('#tableTempDinas').removeAttr('hidden');
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    this.TableTempDinas = $('#TempDinas').DataTable();
    this.TableTempDinas.destroy();
    this.ListTableTempDinas = {
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
          code: 309,
          permitno: this.noSurat,
          userid: this.currentEmail,
        },
      },
      columns: [
        {
          title: 'No Surat',
          data: 'PermitNo',
          className: 'dt-body-center',
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
          className: 'dt-body-center',
        },
        {
          title: 'Tanggal Akhir',
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
          className: 'dt-body-center',
        },
        {
          title: 'Keterangan',
          data: 'Note',
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
    this.TableTempDinas = $('#TempDinas').DataTable(this.ListTableTempDinas);
  }

  simpan() {
    this.httpService
      .SaveLembur(
        this.noSurat,
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
              detail: 'Data dinas berhasil disimpan',
            });
            window.location.reload();
          } else {
            // toastr.error('Data lembur gagal disimpan', 'Gagal!');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Data dinas gagal disimpan',
            });
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Data dinas gagal disimpan, terjadi kesalahan pada sistem, hubungin administrator',
          });
        },
        () => {
          // window.location.reload();
        }
      );
  }

  batalSimpan() {
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Semua data temporary akan di hapus dan surat dinas di batalkan!',
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
                detail: 'Berhasil hapus data dinas!',
              });
            } else {
              // toastr.success('Gagal hapus data lembur!', 'Gagal!');
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal hapus data dinas!',
              });
            }
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Gagal hapus data dinas, terjadi kesalahan pada sistem, hubungi administrator',
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
                detail: 'Berhasil hapus data temporary dinas!',
              });
              this.ListTempDinas();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal hapus data temporary dinas!',
              });
            }
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Gagal menghapus data temporary dinas, terdapat kesalahan pada sistem, hubungi administrator',
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
