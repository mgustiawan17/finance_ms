import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { LayoutService } from '../../../../_metronic/layout';
import { AttendancePeriodeService } from './attendanceperiode.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var $: any;

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-attendanceperiode',
  templateUrl: './attendanceperiode.component.html',
  styleUrl: './attendanceperiode.component.scss',
  providers: [AttendancePeriodeService],
})
export class AttendancePeriodeComponent implements OnInit, AfterViewInit {
  activeTab: Tabs = 'Header';
  resetLoading = false;

  rangeDates: Date[] | undefined;
  date: Date[] | undefined;
  year: Date[] | undefined;
  selectedPeriode: Date[] = [];
  selectedGroup: any;
  selectedMonth: Date = new Date();
  selectedYear: any;
  selectedType: any;

  optionListEmployee: any;
  deptSectValue: any;
  selectedDept: any = {};

  TypeValue: any;
  model: any;
  busy: any;
  selectedEmp: any;
  table: any;
  TableAbsen: any;
  dataTable: any;
  currentCompany: any;
  currentIns: any;
  loading: boolean = false;
  configLoading: boolean = false;
  valuebuttonOptions: string = '';
  formGroup: FormGroup;
  listdataTable: any;
  selectedOption: string = '0';
  valuechooseData: string = '0';
  chooseData: any[] = [
    { label: 'Periode', value: '0' },
    { label: 'Month', value: '1' },
    { label: 'Year', value: '2' },
  ];

  groups = [
    { name: 'SECTION', value: 'SECTION' },
    { name: 'EMPLOYEE', value: 'EMPLOYEE' },
  ];

  constructor(
    private el: ElementRef,
    private httpService: AttendancePeriodeService,
    private layout: LayoutService,
    private httpClient: HttpClient,
    private route: Router,
    private cd: ChangeDetectorRef
  ) {
    this.currentCompany = localStorage.getItem('currentCompany');
    this.currentIns = localStorage.getItem('currentInstansi');
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  ngOnInit(): void {
    this.getType();
    this.getDeptSect();
  }

  ngAfterViewInit() {
    this.handleChange('0');
  }

  Kembali() {
    this.route.navigate(['hr/attendance/selectattendance']);
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  formatDateYear(date: Date): string {
    const year = date.getFullYear();
    return `${year}`;
  }

  formatDateMonth(date: Date): { year: string; month: string } {
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return { month, year };
  }

  formatDatePeriode(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  handleChange(newValue: any) {
    if (newValue === '0') {
      $('.type').attr('hidden', true);
      $('#type').attr('hidden', true);
      $('.group').attr('hidden', true);
      $('#group').attr('hidden', true);
      $('.month').attr('hidden', true);
      $('#month').attr('hidden', true);
      $('.year').attr('hidden', true);
      $('#year').attr('hidden', true);
      $('#TableMonth').attr('hidden', true);
      $('#TableMonth').attr('hidden', true);
      $('#TableYearBySect').attr('hidden', true);
      $('#TableYearByEmp').attr('hidden', true);
      $('#TableYearByEmployee').attr('hidden', true);
      $('.employee').removeAttr('hidden');
      $('#employee').removeAttr('hidden');
      $('.periode').removeAttr('hidden');
      $('#periode').removeAttr('hidden');
    } else if (newValue === '1') {
      $('.type').attr('hidden', true);
      $('#type').attr('hidden', true);
      $('.group').attr('hidden', true);
      $('#group').attr('hidden', true);
      $('.year').attr('hidden', true);
      $('#year').attr('hidden', true);
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.employee').attr('hidden', true);
      $('#employee').attr('hidden', true);
      $('#TableYearBySect').attr('hidden', true);
      $('#TableYearByEmp').attr('hidden', true);
      $('#TableYearByEmployee').attr('hidden', true);
      $('#TablePeriode').attr('hidden', true);
      $('.month').removeAttr('hidden');
      $('#month').removeAttr('hidden');
    } else if (newValue === '2') {
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.month').attr('hidden', true);
      $('#month').attr('hidden', true);
      $('.employee').attr('hidden', true);
      $('#employee').attr('hidden', true);
      $('#TablePeriode').attr('hidden', true);
      $('#TableMonth').attr('hidden', true);
      $('.year').removeAttr('hidden');
      $('#year').removeAttr('hidden');
      $('.type').removeAttr('hidden');
      $('#type').removeAttr('hidden');
      $('.group').removeAttr('hidden');
      $('#group').removeAttr('hidden');
    } else {
      $('.type').attr('hidden', true);
      $('#type').attr('hidden', true);
      $('.group').attr('hidden', true);
      $('#group').attr('hidden', true);
      $('.month').attr('hidden', true);
      $('#month').attr('hidden', true);
      $('.year').attr('hidden', true);
      $('#year').attr('hidden', true);
      $('.periode').attr('hidden', true);
      $('#periode').attr('hidden', true);
      $('.employee').attr('hidden', true);
      $('#employee').attr('hidden', true);
      $('#TablePeriode').attr('hidden', true);
      $('#TableMonth').attr('hidden', true);
      $('#TableYearBySect').attr('hidden', true);
      $('#TableYearByEmp').attr('hidden', true);
      $('#TableYearByEmployee').attr('hidden', true);
    }
  }

  onPeriodeChange() {
    if (this.selectedPeriode && this.selectedPeriode.length === 2) {
      console.log('Range dates selected:', this.selectedPeriode);
    }
  }

  getDeptSect() {
    this.deptSectValue = [];
    this.httpService.getDD2().subscribe(
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
        this.deptSectValue = department;
      },
      (error) => {
        console.error('Error fetching deptsect:', error);
      }
    );
  }
  onChangeDepartment(selectedDept: any) {
    console.log(selectedDept);
    this.selectedDept = selectedDept;
    if (selectedDept && selectedDept.departmentId && selectedDept.sectionId) {
      const deptcode = selectedDept.departmentId;
      const sectcode = selectedDept.sectionId;
      this.getEmployee(deptcode, sectcode);
      this.getTableAbsenYearBySect(sectcode);
    } else {
      console.log('error');
    }
  }

  onChangeEmployee(selectedEmp: any) {
    console.log(selectedEmp);
    this.selectedEmp = selectedEmp;
  }

  getEmployee(deptcode: any, sectcode: any) {
    this.optionListEmployee = [];
    this.httpService.getDD2Employee('6', deptcode, sectcode).subscribe(
      (data) => {
        const employees = data.map((item: any) => {
          return {
            label: item.RegisterNo + ' | ' + item.EmpName,
            registerId: item.RegisterNo,
          };
        });
        this.optionListEmployee = employees;
      },
      (error) => {}
    );
  }

  getType() {
    this.TypeValue = [];
    this.httpService.getDD2Jenis('').subscribe(
      (data) => {
        const type = data.map((item: any) => {
          return {};
        });
        this.TypeValue = type;
      },
      (error) => {}
    );
  }

  getTableAbsenPeriode(selectedRegisterNos: any[]) {
    let url: string;
    if (checkUrl()) {
      url = baseUrl + 'Absensi/SP004_Ajax';
    } else {
      url = baseUrlLuar + 'Absensi/SP004_Ajax';
    }

    const firstDate = this.formatDatePeriode(this.selectedPeriode[0]);
    const endDate = this.formatDatePeriode(this.selectedPeriode[1]);
    const registerNos = selectedRegisterNos
      .map((emp) => emp.registerId)
      .join(',');

    this.dataTable = $('#ListTableAbsenPeriode').DataTable();
    this.dataTable.destroy();
    this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: '17',
          param1: registerNos,
          param2: firstDate,
          param3: endDate,
          param4: '',
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          param9: '',
        },
      },

      columns: [
        { title: 'Register', data: 'RegisterNo', className: 'dt-body-center' },
        { title: 'Name', data: 'EmpName' },
        { title: 'Section', data: 'section', className: 'dt-body-center' },
        {
          title: 'Date',
          data: 'Tgl',
          className: 'dt-body-center',
          render: function (data: any, type: any, row: any) {
            const date = new Date(data);
            if (!isNaN(date.getTime())) {
              const day = ('0' + date.getDate()).slice(-2);
              const month = ('0' + (date.getMonth() + 1)).slice(-2);
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            }
            return data;
          },
        },
        { title: 'Day', data: 'Hari', className: 'dt-body-center' },
        { title: 'In', data: 'masuk', className: 'dt-body-center' },
        { title: 'Out', data: 'keluar', className: 'dt-body-center' },
        { title: 'Notes', data: 'notes' },
      ],
      initComplete: function (settings: any, json: any) {},
    };

    this.busy = this.table = $('#ListTableAbsenPeriode').DataTable(
      this.listdataTable
    );
    $('#TablePeriode').removeAttr('hidden', 'hidden');
    $('#TableMonth').attr('hidden', true);
  }

  getTableAbsenMonth(param2: any) {
    let url: string;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    const selectedYear = this.selectedMonth.getFullYear();
    const selectedMonth = this.selectedMonth.getMonth() + 1;
    const year = selectedYear.toString();
    const month = selectedMonth.toString().padStart(2, '0');

    this.dataTable = $('#ListTableAbsenMonth').DataTable();
    this.dataTable.destroy();
    this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: '',
          param1: '',
          param2: '',
          param3: year,
          param4: month,
          param5: '',
          param6: '',
          param7: '',
          param8: '',
          param9: '',
        },
      },
      columns: [
        { title: 'SECTION', data: 'Setion' },
        { title: 'CUTI', data: '' },
        { title: 'IZIN', data: '' },
        { title: 'LATE', data: '' },
        { title: 'S0', data: '' },
        { title: 'S1', data: '' },
        { title: 'S2', data: '' },
      ],
      initComplete: function (settings: any, json: any) {},
    };
    this.busy = this.table = $('#ListTableAbsenMonth').DataTable(
      this.listdataTable
    );
    $('#TableMonth').removeAttr('hidden', 'hidden');
  }

  getTableAbsenYearBySect(param2: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + '';
    } else {
      url = baseUrlLuar + '';
    }

    if (this.selectedGroup === 'SECTION') {
      const yearDate = this.formatDateYear(this.selectedYear);
      const selectedTypeValue = Array.isArray(this.selectedType)
        ? this.selectedType.join(',')
        : this.selectedType;
      this.dataTable = $('#ListTableAbsenYearBySect').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: !0,
        scrollCollapse: !0,
        dom: 'Bfrltip',
        lengthMenu: [10, 20, 50, 100, 200],
        ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
            code: '',
            param1: '',
            param2: '',
            param3: yearDate,
            param4: selectedTypeValue,
            param5: '',
            param6: '',
            param7: '',
            param8: '',
            param9: '',
          },
        },
        columns: [
          { title: 'SECTION', data: '' },
          { title: 'JAN', data: '' },
          { title: 'FEB', data: '' },
          { title: 'MAR', data: '' },
          { title: 'APR', data: '' },
          { title: 'MAY', data: '' },
          { title: 'JUN', data: '' },
          { title: 'JUL', data: '' },
          { title: 'AUG', data: '' },
          { title: 'SEP', data: '' },
          { title: 'OCT', data: '' },
          { title: 'NOV', data: '' },
          { title: 'DEC', data: '' },
        ],
      };
      this.dataTable = $('#ListTableAbsenYearBySect').DataTable(
        this.listdataTable
      );
      $('#TableYearBySect').removeAttr('hidden', 'hidden');
      $('#TableYearByEmp').attr('hidden', true);
    } else if (this.selectedGroup === 'EMPLOYEE') {
      const yearDate = this.formatDateYear(this.selectedYear);
      const selectedTypeValue = Array.isArray(this.selectedType)
        ? this.selectedType.join(',')
        : this.selectedType;
      const selectedDeptValue = Array.isArray(this.selectedDept)
        ? this.selectedDept.join(',')
        : this.selectedDept;
      this.dataTable = $('#ListTableAbsenYearByEmp').DataTable();
      this.dataTable.destroy();
      this.listdataTable = {
        destroy: true,
        paging: true,
        scrollY: '60vh',
        scrollX: !0,
        scrollCollapse: !0,
        dom: 'Bfrltip',
        lengthMenu: [10, 20, 50, 100, 200],
        ajax: {
          url: url,
          type: 'POST',
          dataType: 'JSON',
          data: {
            code: '',
            param1: '',
            param2: '',
            param3: yearDate,
            param4: '',
            param5: '',
            param6: '',
            param7: '',
            param8: '',
            param9: '',
          },
        },
        columns: [
          { title: 'EMP ID', data: '' },
          { title: 'EMP NAME', data: '' },
          { title: 'JAN', data: '' },
          { title: 'FEB', data: '' },
          { title: 'MAR', data: '' },
          { title: 'APR', data: '' },
          { title: 'MAY', data: '' },
          { title: 'JUN', data: '' },
          { title: 'JUL', data: '' },
          { title: 'AUG', data: '' },
          { title: 'SEP', data: '' },
          { title: 'OCT', data: '' },
          { title: 'NOV', data: '' },
          { title: 'DEC', data: '' },
        ],
        initComplete: function (settings: any, json: any) {},
      };
      this.dataTable = $('#ListTableAbsenYearByEmp').DataTable(
        this.listdataTable
      );
      $('#TableYearByEmp').removeAttr('hidden', 'hidden');
      $('#TableYearBySect').attr('hidden', true);
    }
  }

  showDataTable() {
    this.configLoading = true;
    setTimeout(() => {
      if (this.valuechooseData === '0') {
        if (this.selectedEmp && this.selectedEmp.length > 0) {
          this.getTableAbsenPeriode(this.selectedEmp);
        } else {
          this.getTableAbsenPeriode([]);
        }
      } else if (this.valuechooseData === '1') {
        if (this.selectedDept && this.selectedDept.sectionId) {
          const selectedSectcode = this.selectedDept.sectionId;
          this.getTableAbsenMonth(selectedSectcode);
        } else {
          this.getTableAbsenMonth(null);
        }
      } else if (this.valuechooseData === '2') {
        if (this.selectedDept && this.selectedDept.sectionId) {
          const selectedSectcode = this.selectedDept.sectionId;
          this.getTableAbsenYearBySect(selectedSectcode);
        } else {
          this.getTableAbsenYearBySect(null);
        }
      }
      this.configLoading = false;
    }, 500);
  }
}
