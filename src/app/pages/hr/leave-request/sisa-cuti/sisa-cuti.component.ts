import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SisaCutiService } from './sisa-cuti.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';

@Component({
  selector: 'app-sisa-cuti',
  templateUrl: './sisa-cuti.component.html',
  styleUrl: './sisa-cuti.component.scss',
  providers: [SisaCutiService],
})
export class SisaCutiComponent implements OnInit {
  table: any;
  TableSisaCuti: any;
  SisaTableCuti: any;
  optionListDepartmentHR: any;
  selectedDept: any;
  selectedEmp: any;
  currentCompany: any;
  optionListEmployee: any;
  selectedDeptSect: any;
  loading: boolean = false;
  currentIns: any;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SisaCutiService
  ) {
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  ngOnInit(): void {
    // this.SisaCuti();
    this.getDepartment();
    $('#tableSisaCuti').attr('hidden', 'hidden');
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

  onChangeEmployee(selectedEmp: any[]) {
    console.log(selectedEmp);
    // Mengambil hanya registerId dari setiap objek dan menyimpannya di selectedEmp
    this.selectedEmp = selectedEmp;
  }

  getRegisterIds() {
    // Extract registerId from each selected object
    return this.selectedEmp.map((emp: any) => emp.registerId);
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

  getCommand() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    $('#tableSisaCuti').removeAttr('hidden');
    this.SisaCuti();
  }

  SisaCuti() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_AJAX';
    } else {
      url = baseUrlLuar + 'Permit/Permit_AJAX';
    }
    const regNoString = this.getRegisterIds().join(',');
    this.TableSisaCuti = $('#sisaCuti').DataTable();
    this.TableSisaCuti.destroy();
    this.SisaTableCuti = {
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
          code: 105,
          param8: regNoString,
          company: this.currentIns,
        },
      },
      columns: [
        {
          title: 'No Register',
          data: 'RegisterNo',
          className: 'dt-body-center',
        },
        {
          title: 'Nama',
          data: 'EmpName',
        },
        {
          title: 'Departement',
          data: 'DeptName',
          className: 'dt-body-center',
        },
        {
          title: 'Section',
          data: 'SectName',
          className: 'dt-body-center',
        },
        {
          title: 'Job Role',
          data: 'JRName',
          className: 'dt-body-center',
        },
        {
          title: 'Sisa Cuti Tahun Lalu',
          data: 'CutiTahunLalu',
          className: 'dt-body-center',
        },
        {
          title: 'Sisa Cuti Tahunan',
          data: 'CutiTahunan',
          className: 'dt-body-center',
        },
      ],
    };
    this.TableSisaCuti = $('#sisaCuti').DataTable(this.SisaTableCuti);
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/listreport']);
  }
}
