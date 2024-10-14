import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/layout';
// import { DaterangepickerComponent, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-pr',
  templateUrl: './pr1.component.html',
})
export class Pr1Component implements OnInit, AfterViewInit {
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;

  dateRange: any;
  selectedCompany: any;
  selectedSupplier: any;
  selectedStatus: any;
  selectedDateRange: string;
  barang: string = '';
  jumlah: number = 0;
  showTable: boolean = false;
  startDate: Date;
  endDate: Date;
  daterangepickerOptions: any = {}; // You may need to adjust the type accordingly

  companies: any[] = [
    { id: 1, name: 'Famatex Toha' },
    { id: 2, name: 'Famatex Cipadung' },
    // ...
  ];

  suppliers: any[] = [
    { id: 1, name: 'Supplier X' },
    { id: 2, name: 'Supplier Y' },
    // ...
  ];

  status: any[] = [
    { id: 1, name: 'Open' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ];

  btbOptions: any[] = [
    { id: 1, name: 'Barang 1' },
    { id: 2, name: 'Barang 2' },
    { id: 3, name: 'Barang 3' },
  ];

  selectedBTB: any;

  constructor(
    private layout: LayoutService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      ranges: {
        'Today': [new Date(), new Date()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), new Date()],
        'Last 30 Days': [moment().subtract(29, 'days'), new Date()],
      },
    };
  }

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  submitBTBForm() {
    // ... (logika pemrosesan formulir lainnya)
    this.showTable = true;
  }

  displayedData: any[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.btbOptions.slice(startIndex, endIndex);
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.btbOptions.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  exportTo(format: string): void {
    // Logic for exporting data based on the format (excel, csv, pdf)
    console.log(`Exporting to ${format}`);
    // Implement your export logic here
  }

  ngAfterViewInit() {
    const datepickerElement = this.el.nativeElement.querySelector('#tanggal');
    const datepicker = this.daterangepickerOptions.createDateRangePicker(datepickerElement);

    datepicker.addListener('change', (start: any, end: any) => {
      this.onDateRangeChange({ start: start, end: end });
    });

    // ... Additional configuration if needed
  }

  onDateRangeChange(event: any): void {
    console.log('Date Range:', event);
    // Handle the date range change event as needed
  }
  onStartDateChange(event: any): void {
    console.log('Start Date:', this.startDate);
  }

  onEndDateChange(event: any): void {
    console.log('End Date:', this.endDate);
  }
  approve(data: any){

  }

  reject(data: any){

  }

  viewDetails(data: any){

  }

  confirmApprove(data: any) {
    if (confirm('Are you sure you want to approve this item?')) {
      // Logika untuk menyetujui item disini
      console.log('Item approved');
    } else {
      // Logika jika tidak menyetujui atau dialog dibatalkan
      console.log('Approval canceled');
    }
  }
  
  confirmReject(data: any) {
    if (confirm('Are you sure you want to reject this item?')) {
      // Logika untuk menolak item disini
      console.log('Item rejected');
    } else {
      // Logika jika tidak menolak atau dialog dibatalkan
      console.log('Rejection canceled');
    }
  }
}
