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
import { SuratCutiService } from './surat-cuti.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Register } from '../../../../auth/model/register';
import { Observable, map, catchError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-surat-cuti',
  templateUrl: './surat-cuti.component.html',
  styleUrl: './surat-cuti.component.scss',
  providers: [SuratCutiService, MessageService],
  // encapsulation: ViewEncapsulation.None,
})
export class SuratCutiComponent implements OnInit {
  dateRange: any;
  noSurat: string = '';
  SisaCuti: string = '';
  // jeniscutiOptions: any[] = [
  //   { label: 'Cuti Tahunan', value: 'Cuti Tahunan' },
  //   { label: 'Cuti Tahun Lalu', value: 'Cuti Tahun Lalu' },
  //   { label: 'Melahirkan', value: 'Melahirkan' },
  // ];
  // buttonOptions: any[] = [{ label: 'Periode', value: '0'},{ label: '1Y', value: '1' },{ label: '3Y', value: '2'}];
  valuecompanyOptions: string = '';
  valuejeniscutiOptions: string = '';
  valuebuttonOptions: string = '';
  optionListDepartmentHR: any;
  jeniscutiOptions: any;
  selectedDept: any = {};
  selectedEmp: any;
  currentEmail: any;
  currentIns: any;
  selectedJenis: any;
  currentCompany: any;
  optionListEmployee: any;
  selectedDeptSect: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];

  constructor(
    private route: Router,
    private httpService: SuratCutiService,
    private messageService: MessageService
  ) {
    // this.currentCompany = localStorage.getItem('currentCompany');
    // this.selectedPeriode = '';
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentIns = localStorage.getItem('currentInstansi');
    this.valuecompanyOptions = this.currentIns;
  }

  ngOnInit(): void {
    this.getNoSurat();
    this.getJenisCuti();
    // this.InsertCuti();
    this.getDepartment();
    // this.getDepartmentF2();
  }

  // ngAfterViewInit() {
  //   this.handleChange('0');
  // }

  // formatDatePeriode(date: any): string {
  //   // Ubah format tanggal menjadi "yyyy-mm-dd"
  //   return date.toLocaleDateString('en-GB');
  // }

  onChangeDepartment(selectedDept: any[]) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    this.optionListEmployee = [];
    this.SisaCuti = '';
    this.selectedEmp = null;
    this.selectedJenis = null;
    const deptString = this.getDeptIds().join(',');
    this.getEmployee(deptString);
  }

  getDeptIds() {
    // Extract DSCode from each selected object
    return this.selectedDept.map((emp: any) => emp.DSCode);
  }

  onChangeEmployee(selectedEmp: any) {
    this.selectedEmp = selectedEmp;
    this.SisaCuti = '';

    if (this.selectedJenis && selectedEmp && selectedEmp.registerId) {
      const register = selectedEmp.registerId;
      if (this.selectedJenis === 'Cuti Tahunan') {
        this.getSisaCuti1(register);
      } else if (this.selectedJenis === 'Cuti Tahun Lalu') {
        this.getSisaCuti2(register);
      }
    }
  }

  onChangeJenisCuti(selectedJenis: any) {
    console.log('Jenis cuti yang dipilih:', selectedJenis);
    this.selectedJenis = selectedJenis;
    this.SisaCuti = '';

    if (selectedJenis && this.selectedEmp && this.selectedEmp.registerId) {
      const register = this.selectedEmp.registerId;
      if (selectedJenis.label === 'Cuti Tahunan') {
        this.getSisaCuti1(register);
      } else if (selectedJenis.label === 'Cuti Tahun Lalu') {
        this.getSisaCuti2(register);
      }
    }
  }

  getNoSurat() {
    this.httpService.GetNoSuratCuti().subscribe((data: any) => {
      this.noSurat = data ? data[0].PermitNo : '';
    });
  }

  getSisaCuti1(register: string) {
    this.httpService
      .GetSisaCuti('103', this.valuecompanyOptions, register, 'Cuti Tahunan')
      .subscribe(
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

  getSisaCuti2(register: string) {
    this.httpService
      .GetSisaCuti('103', this.valuecompanyOptions, register, 'Cuti Tahun Lalu')
      .subscribe(
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

  getJenisCuti() {
    this.jeniscutiOptions = [];
    this.httpService.GetJenisCuti('5').subscribe(
      (data) => {
        const jenisCuti = data.map((item: any) => {
          return {
            label: item.PermitType,
            // value: item.RegisterNo,
            qty: item.QTY,
          };
        });
        this.jeniscutiOptions = jenisCuti;
      },
      (error) => {
        // Handle error
      }
    );
  }

  InsertCuti(): void {
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
    const selisih = (tanggalAkhir - tanggalAwal) / (24 * 60 * 60 * 1000);
    const sisaCutiNumber: number = Number(this.SisaCuti);
    if (!this.selectedDept || !this.selectedDept.departmentId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selected department is undefined or missing departmentId',
      });
      console.error('Selected department is undefined or missing departmentId');
      return; // Return early if selectedDept is undefined or missing departmentId
    }
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
        .InsertSuratCuti(
          this.selectedJenis.label,
          tanggalAwal,
          tanggalAkhir,
          keterangan,
          this.selectedJenis.qty,
          this.valuecompanyOptions,
          this.selectedEmp.registerId,
          this.currentEmail
        )
        .subscribe(
          (response: any) => {
            if (response.status === 200) {
              // this.snackBar.open('Surat Cuti Berhasil Dibuat', 'Success', {
              //   duration: 2000,
              // });
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Surat Cuti Berhasil Dibuat',
              });
              this.getNoSurat();
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              // setTimeout(() => {
              //   window.location.reload();
              // }, 1000);
              // $('#jenis_cuti').val('Cuti Tahun Lalu').trigger('change');
              // $('#keterangan').val('');
              // this.getDept();
              // this.getSect();
              // this.initSelect2();
              // this.initDatePicker();
              // this.reset();
            } else {
              // this.snackBar.open('Sisa Cuti Tidak Mencukupi!', 'Cuti Gagal!', {
              //   duration: 2000,
              // });
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Sisa Cuti Tidak Mencukupi!',
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
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/newrequest']);
  }

  Reset() {
    this.getNoSurat();
    $('#keterangan').val('');
  }
}
