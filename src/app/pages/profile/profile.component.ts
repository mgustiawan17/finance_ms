import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { baseUrl, checkUrl, baseUrlLuar } from '../baseurl';
import { ProfileService } from './profile.service';
// import 'datatables.net';
import * as $ from 'jquery';
import 'select2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.compontent.html',
  encapsulation: ViewEncapsulation.None,
  providers: [ProfileService, MessageService],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  modalPassword: boolean = false;
  modalAccess: boolean = false;

  showPassword: boolean = false;
  password: any;

  currentRegister: any;
  currentUserName: any;
  currentEmail: any;
  currentUserType: any;
  currentStatus: any;
  currentJR: any;
  iniJR: any;

  noregister: any;

  namaFile: string = '';
  postData: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private httpService: ProfileService,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.currentRegister = localStorage.getItem('currentRegister');
    this.currentUserName = localStorage.getItem('currentUserName');
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentUserType = localStorage.getItem('currentUserType');
    this.currentStatus = localStorage.getItem('currentStatus');
    this.currentJR = localStorage.getItem('currenJRCode');
  }

  ngOnInit(): void {
    // this.getNoRegister();
    this.password = 'password';
    // this.getFileName();
  }

  ngAfterViewInit(): void {}

  updatePassword() {
    const passwordElement = $('#password');
    if (passwordElement.length) {
      const password: string = passwordElement.val() as string;

      this.httpService
        .update(
          '1',
          'update_password',
          this.currentEmail,
          password,
          this.currentEmail
        )
        .subscribe(
          (data) => {
            this.postData = JSON.stringify(data);
            // this.table.ajax.reload();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error change password!',
            });
            this.modalPassword = false;
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Change password success',
            });
            this.modalPassword = false;
          }
        );
    } else {
      // Handle error when elements are not found
      console.error('Elements not found');
    }
  }

  togglePassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }

  showDialogPassword() {
    this.modalPassword = true;
  }
  closeDialogPassword() {
    this.modalPassword = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Change passsword has been canceled!',
    });
    $('#password').val('');
  }

  showDialogAccess() {
    this.modalAccess = true;
  }
  closeDialogAccess() {
    this.modalAccess = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Change access has been canceled!',
    });
    $('#access').val('');
  }

  // getFileName() {
  //   this.httpService.getFileNameByNoRegister(this.currentRegister)
  //     .subscribe((namaFile: string) => {
  //       this.namaFile = namaFile;
  //     });
  // }
}
