import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import * as moment from 'moment';
import { CalendarModule } from 'primeng/calendar';
import { SuratDinasListService } from './surat-dinas-list.service';
import { baseUrl, checkUrl, baseUrlLuar } from '../../../baseurl';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
// import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-surat-dinas-list',
  templateUrl: './surat-dinas-list.component.html',
  styleUrl: './surat-dinas-list.component.scss',
  providers: [SuratDinasListService, MessageService],
})
export class SuratDinasListComponent implements OnInit {
  dateRange: any;
  table: any;
  TableDinas: any;
  ListTableDinas: any;
  busy: Subscription;
  selectedJenis: any;
  selectedEmp: any;
  StatusOptions: any[] = [
    { name: 'Open', value: '3.1' },
    { name: 'Approved', value: '3.2' },
    { name: 'Rejected', value: '3.3' },
  ];
  valuestatusOptions: string = '';
  currentCompany: any;
  currentIns: any;
  currentEmail: any;
  optionListDepartmentHR: any;
  selectedDept: any = {};
  selectedItem: any = {};
  selectedDeptSect: any;
  selectedStatus: any;
  periode1: String;
  periode2: String;
  selectedPeriode: any[] = [];
  cols: any[] = [];
  items: any[] = [];
  displayModal: boolean = false;
  displayUploadModal: boolean = false;
  displayImageModal: boolean = false;
  displayEditModal: boolean = false;
  selectedPermit: any;
  selectedDateIn: Date;
  selectedDateOut: Date;
  previewUrls: string[] = [];
  dataJson: any;
  uploadedFiles: any[] = [];
  busyy: boolean = false;
  autoNumber: number = 0;
  FileName: any;
  Id: any;
  noSurat: any;

  constructor(
    private el: ElementRef,
    private layout: LayoutService,
    private route: Router,
    private httpService: SuratDinasListService,
    private messageService: MessageService,
    private httpClient: HttpClient
  ) {
    this.currentIns = localStorage.getItem('currentInstansi');
    this.currentEmail = localStorage.getItem('currentEmail');
  }

  ngOnInit(): void {
    // this.ListDinas();
    this.getDepartment();
    $('#tableListDinas').attr('hidden', 'hidden');
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

  onDateSelect(event: any) {
    console.log('Selected date range:', this.selectedPeriode);
    // Ensure the dates are processed correctly without time information
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

  getCommand() {
    $('#tableListDinas').removeAttr('hidden');
    // var tanggal = $('#tanggal').val();
    // var pecah = tanggal.split('s/d');
    // this.periode_awal = pecah[0];
    // this.periode_akhir = pecah[1];
    this.ListDinas();
  }

  ListDinas() {
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
    this.TableDinas = $('#ListDinas').DataTable();
    this.TableDinas.destroy();
    this.ListTableDinas = {
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
          code: 4,
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
            return (
              '<button id="detail" data-toggle="modal" data-target="#modalDetail" class="btn m-portlet__nav-link btn m-btn m-btn–hover-primary m-btn–icon m-btn–icon-only m-btn–pill btn-outline-primary" title="Detail" type="button">\t\t\t\t\t\t\t<i class="fa fa-ellipsis-h"></i>\t\t\t\t\t\t</Button>' +
              '\t\t\t\t\t\t<button id="print" class="btn m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Print" type="button">\t\t\t\t\t\t\t<i class="fa-solid fa-print"></i>\t\t\t\t\t\t</Button>' +
              '\t\t\t\t\t\t<button id="upload" class="btn m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Upload" type="button">\t\t\t\t\t\t\t<i class="fa-solid fa-file-arrow-up"></i>\t\t\t\t\t\t</Button>'
            );
          },
        },
        {
          title: 'No Surat',
          data: 'PermitNo',
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
          title: 'Foto Dinas',
          data: 'Name',
          width: 100,
          className: 'dt-body-center',
          render: function (name: any, type: any, row: any) {
            if (name && name.trim() !== '') {
              return '<button id="detailFoto" data-toggle="modal" data-target="#modalGambar" class="btn m-portlet__nav-link btn m-btn m-btn–hover-success m-btn–icon m-btn–icon-only m-btn–pill btn-outline-success" title="Lihat" type="button">Lihat Foto</button>';
            } else {
              return 'Belum Upload Foto';
            }
          },
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
        {
          title: 'Note',
          data: 'Note',
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('#detail', row).bind('click', () => {
          this.selectedPermit = data;
          const PermitNo = this.selectedPermit.PermitNo;
          this.DetailDinas(PermitNo);
          this.displayModal = true;
        });
        $('#print', row).bind('click', () => {
          this.selectedPermit = data;
          const permitNo = this.selectedPermit.PermitNo;
          this.print_dinas(permitNo);
        });
        $('#upload', row).bind('click', () => {
          this.selectedPermit = data;
          const permitNo = this.selectedPermit.PermitNo;
          this.UploadDinas(permitNo);
          this.displayUploadModal = true;
        });
        $('#detailFoto', row).bind('click', () => {
          this.selectedPermit = data;
          const permitNo = this.selectedPermit.PermitNo;
          this.detailImage(permitNo);
          this.displayImageModal = true;
        });
      },
    };
    this.TableDinas = $('#ListDinas').DataTable(this.ListTableDinas);
  }

  UploadDinas(permitno: any) {
    return (this.busy = this.httpService
      .getDetail(this.currentEmail, permitno)
      .subscribe(
        (data: any) => {
          this.dataJson = data;
          this.selectedItem = {
            Id: this.dataJson[0].Id,
            PermitNo: this.dataJson[0].PermitNo,
          };
        },
        (error: any) => {
          console.error(error);
          alert('User Tidak Sesuai');
        },
        () => {}
      ));
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.previewUrls = [];
      this.uploadedFiles = []; // Clear previously selected files
      for (let file of event.target.files) {
        this.uploadedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  isValidFileType(Name: string): boolean {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png'];

    const fileExtension = Name.toLowerCase().substring(Name.lastIndexOf('.'));

    return allowedFileTypes.includes(fileExtension);
  }

  uploadFile() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/UploadFile';
    } else {
      url = baseUrlLuar + 'Permit/UploadFile';
    }
    if (this.uploadedFiles.length > 0) {
      this.busyy = true;

      for (let i = 0; i < this.uploadedFiles.length; i++) {
        const file: File = this.uploadedFiles[i];

        if (file.size > 2 * 1024 * 1024) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ukuran file terlalu besar, File harus kurang dari 2MB.',
          });
          continue; // Skip file yang terlalu besar dan lanjut ke file berikutnya
        }

        const originalFileName = file.name;
        const fileExtension = originalFileName.split('.').pop();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const currentAutoNumber = this.autoNumber++;

        const fileName = `Surat_Dinas_${year}_${month}_${day}_${hours}_${minutes}_${seconds}_${currentAutoNumber}.${fileExtension}`;

        if (!this.isValidFileType(fileName)) {
          console.error(
            'Tipe file tidak valid. Hanya file JPG, PNG, dan JPEG yang diizinkan.'
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Tipe file tidak valid, Hanya file JPG, PNG, dan JPEG yang diizinkan.',
          });
          continue; // Melanjutkan dengan file berikutnya jika tipe file tidak valid
        }

        const formData = new FormData();
        formData.append('uploadfoto', file, fileName);

        this.httpClient.post(url, formData).subscribe(
          (response: any) => {
            if (response.success) {
              console.log(
                'File berhasil diunggah, nama file:',
                response.imageUrl
              );
              this.uploadDinasFile(fileName);
            } else {
              console.error(
                'Terjadi kesalahan saat mengunggah file:',
                response.error
              );
            }
          },
          (error) => {
            console.error('Terjadi kesalahan:', error);
          }
        );
      }

      this.uploadedFiles = [];

      this.busyy = false;
    } else {
      console.error('Tidak ada file yang dipilih');
    }
  }

  uploadDinasFile(fileName: string) {
    const isValidFileType = this.isValidFileType(fileName);
    const noSurat: string = $('#noSurat1').val() as string;

    if (isValidFileType) {
      this.httpService
        .UploadDinas1(noSurat, fileName, 'http://sis/h/' + fileName)
        .subscribe(
          (data: any) => {
            if (data.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Upload berhasil disimpan',
              });
              this.displayUploadModal = false;
            } else {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Upload Foto berhasil disimpan',
              });
              this.displayUploadModal = false;
              // this.messageService.add({
              //   severity: 'error',
              //   summary: 'Error',
              //   detail: 'Upload gagal disimpan',
              // });
            }
          },
          (error: any) => {},
          () => {
            this.ListDinas();
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Tipe file tidak valid, Hanya file JPG, PNG, dan JPEG yang diizinkan.',
      });
    }
  }

  detailImage(permitno: any) {
    return (this.busy = this.httpService.getImage('314', permitno).subscribe(
      (data: any) => {
        this.dataJson = data;
        this.Id = this.dataJson[0].Id;
        this.noSurat = this.dataJson[0].PermitNo;
        this.FileName = this.dataJson[0].Name;
        this.showImageModal(this.dataJson);
      },
      (error: any) => {
        console.error(error);
      },
      () => {}
    ));
  }

  showImageModal(dataJson: any) {
    $('#gambarContainer').empty();

    dataJson.forEach((image: any) => {
      let url;
      if (checkUrl()) {
        url = baseUrl + 'Permit/GetFile/' + image.Name;
      } else {
        url = baseUrlLuar + 'Permit/GetFile/' + image.Name;
      }

      // Mengambil data base64
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          if (response.success) {
            const imageUrl = 'data:image/jpeg;base64,' + response.data;
            const imageHTML = `<img src="${imageUrl}" alt="${image.Name}" width="360px" height="200px" data-toggle="modal" data-target="#modalGambar" style="margin-right: 10px; margin-bottom: 10px; cursor: pointer;" />`;

            const $imageElement = $(imageHTML);
            // $imageElement.on('click', () => this.showDetailImage(imageUrl));

            $('#gambarContainer').append($imageElement);
          } else {
            console.error('Error loading image: ', response.error);
          }
        },
        error: function (xhr, status, error) {
          console.error('AJAX error: ', error);
        },
      });
    });

    // Log untuk memastikan fungsi dipanggil dan modal ditampilkan
    console.log('Modal displayed');

    // this.displayImageModal = true;
  }

  DetailDinas(permitno: any) {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Permit/Permit_stat';
    } else {
      url = baseUrlLuar + 'Permit/Permit_stat';
    }
    const params = {
      code: 6,
      param1: 'SD',
      permitno: permitno,
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

    const dateIn: string = `${year1}-${monthString1}-${dayString1}`;
    const dateOut: string = `${year2}-${monthString2}-${dayString2}`;

    const keterangan: string = $('#keterangan').val() as string;
    const regNo: string = $('#register').val() as string;
    const noSurat: string = $('#noSurat').val() as string;

    this.httpService
      .InsertEdit(noSurat, regNo, dateIn, dateOut, keterangan)
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
              $('#tableListDinas').attr('hidden', 'hidden');
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

  print_dinas(permitNo: any) {
    this.httpService.print_dinas('cetak_dinas', permitNo).subscribe(
      (data: any) => {
        if (!data || data.length === 0) {
          console.warn('No data received.');
          return;
        }

        // data.forEach((dinas: any, index: number) => {
        //   this.generatePDF(dinas, index + 1);
        // });
        const dinas = data;
        this.generatePDF(dinas, 1);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  generatePDF(datadinas: any, index: number) {
    const doc = new jsPDF();
    // tslint:disable-next-line:max-line-length
    const imgData =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABNgAAANqCAYAAABfE/aMAAAACXBIWXMAABcSAAAXEgFnn9JSAAALzGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNC0yNVQxMzo1NDowMSswNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDQtMjdUMTA6MDk6MTUrMDc6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDQtMjdUMTA6MDk6MTUrMDc6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ3MTJlZGQtNWUyNS00NjQ1LWIyMzQtMTJkYTk5MTkxNGVhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWVjNDhiMTEtMjRhNy1mOTRkLWIzMGUtODJhZTBmYzExNmRkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGYzYmRjMTEtMGZlYS01ZjQ4LThjNjktZWJjOTc4MzYxMGVmIiB0aWZmOk9yaWVudGF0aW9uPSIxIiB0aWZmOlhSZXNvbHV0aW9uPSIxNTAwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSIxNTAwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxMjQwIiBleGlmOlBpeGVsWURpbWVuc2lvbj0iODc0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4ZjNiZGMxMS0wZmVhLTVmNDgtOGM2OS1lYmM5NzgzNjEwZWYiIHN0RXZ0OndoZW49IjIwMjItMDQtMjVUMTM6NTQ6MDErMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjczMjdlNDRiLWVhY2YtYTM0NC1iMTVmLTVhNDIwZjA1OGRlOSIgc3RFdnQ6d2hlbj0iMjAyMi0wNC0yNVQxNjo0MDo1MyswNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFlMzI5ZDU0LTUyNWEtNjE0Ni04MjRiLWI0NWU5OTc1M2I2NSIgc3RFdnQ6d2hlbj0iMjAyMi0wNC0yNlQwOTo0MjoyOSswNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODEwN2E0NzMtNDRmNS0wMDQ1LThiMDMtMjk2OWE4YTA5MTFiIiBzdEV2dDp3aGVuPSIyMDIyLTA0LTI3VDEwOjA5OjE1KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDcxMmVkZC01ZTI1LTQ2NDUtYjIzNC0xMmRhOTkxOTE0ZWEiIHN0RXZ0OndoZW49IjIwMjItMDQtMjdUMTA6MDk6MTUrMDc6MDAiIHN0RXZ0OnNvZnR3YXJl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gQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAAoENAAAAAAKBDQAAAAACgQ0AAAAAgv+Q+7Yj043bhQAAAABJRU5ErkJggg==';

    const splitText = doc.splitTextToSize(datadinas[0]['Note'], 180);
    const tanggalSekarang = moment().format('DD MMMM YYYY');

    let jabatan = datadinas[0]['JRName'] || ' ';
    let approve1 = datadinas[0]['EmpName'] || ' ';
    let title = '';
    let deptSec = '';
    let employeeNameRegNo;

    if (datadinas[0]['PosName'] === 'Kepala Bagian') {
      title = 'Kabag';
      deptSec = datadinas[0]['SectionName'];
    } else if (datadinas[0]['PosName'] === 'Manager') {
      title = 'Manajer';
      deptSec = datadinas[0]['DeptName'];
    }

    const tglawal = moment(datadinas[0]['DT1']).format('DD MMMM YYYY');
    const tglakhir = moment(datadinas[0]['DT2']).format('DD MMMM YYYY');
    if (datadinas.length === 1) {
      employeeNameRegNo = `${datadinas[0]['EmployeeName']}/${datadinas[0]['RegNo']}`;
    } else {
      employeeNameRegNo = `${datadinas[0].EmployeeName}/${datadinas[0].RegNo} (${datadinas.length} Orang)`;
    }

    const permitNoText = datadinas[0]['PermitNo'];

    doc.addImage(imgData, 'png', 3, 0, 207, 148);
    doc.setFontSize(10.5);
    doc.text(employeeNameRegNo, 42, 33);
    doc.text(datadinas[0]['EmployeeName'], 17, 107);
    doc.text(jabatan, 131, 33);
    doc.text(splitText, 42, 41);
    doc.text(tglawal, 42, 58);
    doc.text(tglakhir, 124, 58);
    doc.text(tanggalSekarang, 163, 69);
    doc.text(approve1, 167, 107);
    doc.text(`${title} ${deptSec}`, 169, 113);
    doc.setFontSize(12);
    doc.text(permitNoText, 14, 14.5);

    doc.save(
      `Surat Izin Dinas ${datadinas[0]['EmployeeName']} / ${tanggalSekarang} - ${index}.pdf`
    );
  }

  Kembali() {
    this.route.navigate(['hr/leaverequest/listreport']);
  }
}
