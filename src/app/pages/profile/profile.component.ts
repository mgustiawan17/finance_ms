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

  @Component({
    selector: 'app-profile',
    templateUrl: './profile.compontent.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ProfileService],
  })
  export class ProfileComponent implements OnInit, AfterViewInit {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoading: boolean;
    private unsubscribe: Subscription[] = [];

    showPassword: boolean = false;
    password: any;
        
    currentRegister: any;
    currentUserName: any;
    currentEmail: any;
    currentUserType: any;
    currentStatus: any;
    currentJR: any;
    iniJR: any

    noregister : any
    
    namaFile: string = '';
    postData: string;

    constructor(
      private cdr: ChangeDetectorRef,
      private httpService: ProfileService,
      private snackBar: MatSnackBar
    ) {
      const loadingSubscr = this.isLoading$
        .asObservable()
        .subscribe((res) => (this.isLoading = res));
      this.unsubscribe.push(loadingSubscr);
      this.currentRegister = localStorage.getItem("currentRegister");
      this.currentUserName = localStorage.getItem("currentUserName");
      this.currentEmail = localStorage.getItem("currentEmail");
      this.currentUserType = localStorage.getItem("currentUserType");
      this.currentStatus = localStorage.getItem("currentStatus");
      this.currentJR = localStorage.getItem("currenJRCode");
      var currenJRCodeArray = JSON.parse(this.currentJR);
      this.iniJR = currenJRCodeArray[0];
    }



    ngOnInit(): void {
        // this.getNoRegister();
        this.password = 'password'
        // this.getFileName();
    }

    ngAfterViewInit(): void {
        
    }

    updatePassword(){
    const passwordElement = $('#password');
        if (passwordElement.length) {
          const password: string = passwordElement.val() as string;
    
    this.httpService.update('1', 'upd_password', this.currentUserName, password, this.currentEmail, this.currentRegister, this.currentUserType, this.currentStatus)
    .subscribe(
      data => {
        this.postData = JSON.stringify(data);
        // this.table.ajax.reload();
    },
    error => {
      this.snackBar.open('Data fail to edit', 'Attention!', {
        duration: 2000
      });
    }, () => {
      this.snackBar.open('Data success to edit', 'Success', {
        duration: 2000
      });
    });
    } else {
      // Handle error when elements are not found
      console.error("Elements not found");
   }
    }

    togglePassword(){
        if (this.password === 'password') {
          this.password = 'text';
          this.showPassword = true;
        } else {
          this.password = 'password';
          this.showPassword = false;
        }
    }

    // getFileName() {
    //   this.httpService.getFileNameByNoRegister(this.currentRegister)
    //     .subscribe((namaFile: string) => {
    //       this.namaFile = namaFile;
    //     });
    // }
}