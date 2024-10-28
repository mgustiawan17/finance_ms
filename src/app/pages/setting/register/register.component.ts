import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { RegisterService } from './register.service';
import { ModalConfig } from 'src/app/_metronic/partials';
import { ModalComponent } from 'src/app/_metronic/partials';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [RegisterService, MessageService],
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private httpService: RegisterService,
    private messageService: MessageService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.currentEmail = localStorage.getItem('currentEmail');
    this.currentCompany = localStorage.getItem('currentInstansi');
  }

  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  };
  valuecompanyOptions: string = 'off';

  selectedStatus: any;

  showPassword: boolean = false;
  modalEdit: boolean = false;
  modalDelete: boolean = false;
  switchStatus: boolean = false;

  inputUserName: any;
  inputEmail: any;
  inputPassword: any;

  // public simpleOption: Array<NgOptionComponent>;
  postData: string;
  selectedRegister: any;
  modalselectedRegister: any;

  configLoading: boolean = false;
  currentEmail: any;
  selectRegister: any;
  option2: any;
  option3: any;
  dataTable: any;
  listdataTable: any;
  TableUser: any;
  ListTableUser: any;
  currentCompany: any;

  selectedValue1: any;
  selectedValue2: any;

  passwordOptions: any[] = [{ label: 'Edit Password', value: '0' }];
  valuepasswordOptions: string = '';

  ngOnInit(): void {
    this.listUser();
    this.getNoRegister();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getNoRegister() {
    this.selectRegister = '';
    this.httpService.getDD2('1').subscribe(
      (data) => {
        const noregister = data.map((item: any) => {
          return {
            label: item.RegisterNo + '/' + item.EmpName,
            value: item.RegisterNo,
          };
        });
        this.selectRegister = noregister;
      },
      (error) => {
        // Handle error
      }
    );
  }

  submit() {
    var status;
    if ($('#status').prop('checked')) {
      status = '1.1';
    } else {
      status = '1.2';
    }
    const usernameElement = $('#username');
    const emailElement = $('#email');
    const passwordElement = $('#password');
    if (
      emailElement.length &&
      passwordElement.length &&
      usernameElement.length
    ) {
      const email: string = emailElement.val() as string;
      const password: string = passwordElement.val() as string;
      const username: string = usernameElement.val() as string;
      this.httpService
        .saveData(
          '1',
          'ins',
          username,
          password,
          email,
          this.selectedRegister,
          status,
          'CSS',
          this.currentEmail,
          ''
        )
        .subscribe(
          (data) => {
            this.postData = JSON.stringify(data);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'error',
              detail: 'Data has Failed',
            });
            console.log(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data has Saved',
            });
            this.listUser();
            this.reset();
          }
        );
    }
  }

  edit() {
    var status;
    if ($('#m_status').prop('checked')) {
      status = '1.1';
    } else {
      status = '1.2';
    }
    const emailElement = $('#m_email');
    const registerElement = $('#m_noregister');
    if (emailElement.length && registerElement.length) {
      const email: string = emailElement.val() as string;
      const noregister: string = registerElement.val() as string;
      this.httpService
        .saveData(
          '1',
          'upd',
          noregister,
          email,
          status,
          this.currentEmail,
          '',
          '',
          '',
          ''
        )
        .subscribe(
          (data) => {
            this.postData = JSON.stringify(data);
          },
          (error) => {
            console.log(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data has Edited',
            });
            this.modalDelete = false;
            this.listUser();
          }
        );
    }
  }
  editPassword() {
    const passwordElement = $('#m_password');
    const registerElement = $('#m_noregister');
    if (passwordElement.length && registerElement.length) {
      const password: string = passwordElement.val() as string;
      const noregister: string = registerElement.val() as string;
      this.httpService
        .saveData(
          '1',
          'update_password',
          noregister,
          password,
          this.currentEmail,
          '',
          '',
          '',
          '',
          ''
        )
        .subscribe(
          (data) => {
            this.postData = JSON.stringify(data);
          },
          (error) => {
            console.log(error);
          },
          () => {
            setTimeout(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Password has Edited',
              });
              $('#m_password').val('');
              this.listUser();
            }, 50);
          }
        );
    }
  }
  showEditPassword(selectedOptionPassword: string) {
    if (selectedOptionPassword === '0') {
      $('.label_m_pw').removeAttr('hidden');
      $('#m_password').removeAttr('hidden');
      $('#m_edit_pw').removeAttr('hidden');
    } else {
      $('.label_m_pw').attr('hidden', true);
      $('#m_password').attr('hidden', true);
      $('#m_edit_pw').attr('hidden', true);
    }
  }

  delete(register: any) {
    // const registerElement = $('#m_deletenoregister');
    // const noregister: string = registerElement.val() as string;
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda harus menginput ulang bila salah satu temporary di hapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batalkan!',
    }).then((result) => {
      if (result.value) {
        this.httpService
          .saveData('1', 'del', register, '', '', '', '', '', '', '')
          .subscribe(
            (data) => {
              this.postData = JSON.stringify(data);
            },
            (error) => {
              console.log(error);
            },
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data has Deleted',
              });
              this.modalDelete = false;
              this.listUser();
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Dibatalkan', 'Data tetap aman :)', 'error');
      }
    });
  }

  listUser() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Settings/Table_Ajax1';
    } else {
      url = baseUrlLuar + 'Settings/Table_Ajax1';
    }
    this.dataTable = $('#ListTableUser').DataTable();
    this.dataTable.destroy();
    this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: !0,
      scrollCollapse: !0,
      colReorder: true,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 1,
          param1: 'list_user_css',
        },
      },
      columns: [
        {
          title: 'Email',
          data: 'email',
        },
        {
          title: 'No Register',
          data: 'RegisterNo',
          className: 'dt-body-center',
        },
        {
          title: 'Status',
          data: 'Status',
          className: 'dt-body-center',
        },
        {
          title: 'Action',
          data: null,
          className: 'dt-body-center',
          render: function (t: any) {
            // tslint:disable-next-line: max-line-length
            return (
              '<button class="btn btn-info btn-sm btn-edit">Edit</button>' +
              '<button class="btn btn-danger btn-sm btn-delete">Delete</button>'
            );
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.btn-edit', row).bind('click', () => {
          this.selectedValue1 = data;
          this.selectedValue2 = data;
          this.modalEdit = true;
        });
        $('.btn-delete', row).bind('click', () => {
          this.modalDelete = true;
          this.selectedValue1 = data;
          this.delete(this.selectedValue1.RegisterNo);
        });
      },
    };
    this.dataTable = $('#ListTableUser').DataTable(this.listdataTable);
  }

  reset() {
    $('#username').val('');
    $('#email').val('');
    $('#password').val('');
    $('#UserType').val('1');
    $('#F1').prop('checked', false);
    $('#F2').prop('checked', false);
    $('#status').prop('checked', false);
  }
}
