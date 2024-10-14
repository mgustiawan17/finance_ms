import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { checkUrl } from './../pages/baseurl';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { MessageService } from 'primeng/api';
import * as $ from 'jquery';

// const $: any = '';
@Component({
  selector: 'app-with-bg-image',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  busy: Subscription;
  returnUrl: string;
  position: 'top-right';
  title: string;
  msg: string;
  postData: string;
  closeOther = false;
  currentCompany: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    private http: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
    
  ) {
  }

  ngOnInit() {
    localStorage.clear();
    const call = this;
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    $('#submit').click(function () {
      if (
        $('#email').val() === '' ||
        $('#email').val() === null ||
        $('#email').val() === undefined
      ) {
        // call.addToast({
        //   title: 'Perhatian', msg: 'Form email harus di isi!', timeout: 3000,
        //   theme: 'bootstrap', type: 'warning', showClose: true, position: 'top-right'
        // });
      } else if (
        $('#password').val() === '' ||
        $('#password').val() === null ||
        $('#password').val() === undefined
      ) {
        // call.addToast({
        //   title: 'Perhatian', msg: 'Form password harus di isi!', timeout: 3000,
        //   theme: 'bootstrap', type: 'warning', showClose: true, position: 'top-right'
        // });
      } else if ($('#email').val() !== '' && $('#password').val() !== '') {
        call.login();
      }
    });
    $('#email, #password').keypress(function (e) {
      const key = e.which;
      if (key === 13) {
        $('#submit').click();
        return true;
      }
    });
  }

  login() {
    const emailElement = $('#email');
    const passwordElement = $('#password');

    if (emailElement.length && passwordElement.length) {
      const email: string = emailElement.val() as string;
      const password: string = passwordElement.val() as string;

      if ($('#email').val() === '' || $('#password').val() === '') {
        alert('Email and Password not allowed to be empty!');
      } else {
        this.http.login('3', 'login_skr', email, password).subscribe(
          (loggedIn: boolean) => {
            if (loggedIn) {
              this.postData = JSON.stringify(loggedIn);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Login successful',
              });
              this.router.navigate([this.returnUrl]);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid email or password',
              });
            }
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error occurred while logging in',
            });
          }
        );
      }
    } else {
      // Handle error when elements are not found
      console.error('Elements not found');
    }
  }
}

// login() {
//     const emailElement = $('#email');
//     const passwordElement = $('#password');
//     if (emailElement.length && passwordElement.length) {
//       const email: string = emailElement.val() as string;
//       const password: string = passwordElement.val() as string;
//       if ($('#email').val() === '' || $('#password').val() === '') {
//         alert('Email and Password not allow empty!');
//       } else {
//         this.http.login(email, password).subscribe((data) => {
//           if (data) {
//             this.snackBar.open('Data success to save', 'Success', {
//               duration: 2000,
//             });
//             this.router.navigate([this.returnUrl]);
//           } else {
//             // console.log(error);
//             this.snackBar.open('Data fail to save', 'Attention!', {
//               duration: 2000,
//             });
//           }
//         });
//       }
//     } else {
//       // Handle error when elements are not found
//       console.error('Elements not found');
//     }
//   }
