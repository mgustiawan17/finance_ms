import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecurityManagementService } from './secum.service';
import { HttpClient } from '@angular/common/http';
import { baseUrl, checkUrl, baseUrlLuar } from '../../baseurl';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-securitymanagement',
  templateUrl: './secum.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './secum.component.scss',
  providers: [SecurityManagementService, MessageService],
})
export class SecurityManagementComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  configLoading: boolean = false;
  checkboxStatusAccounting: boolean = false;
  checkboxStatusInventory: boolean = false;
  checkboxStatusHR: boolean = false;
  checkboxStatusSetting: boolean = false;
  checkboxStatusMRP: boolean = false;
  private unsubscribe: Subscription[] = [];
  public data: any;
  modalDelete: boolean = false;
  modalDelete1: boolean = false;
  modalEdit: boolean = false;
  modalEdit1: boolean = false;

  currentUser: any;

  listModule: any;
  descriptionsInput: any;
  nogroupCode: any;
  optionListUser: any;
  optionListGA: any;
  optionListModule: any;
  optionListDepartmentHR: any;
  optionListDepartmentWMS: any;
  TableGA: any;
  ListTableGA: any;
  ListTableUser: any;
  TableUser: any;
  selectedDeptHR: any;
  selectedDeptWMS: any;
  selectedUser: any;
  selectedGA: any;
  selectedEditGA: any;
  selectedValue1: any;
  selectedModule: any;
  displayModal: boolean = false;

  busy: any;
  option: any;

  groupCode: any = '';

  postData: string;

  selectDept: string[];

  roles = {
    G: false,
    'G-0101': false,
    'G-0201': false,
  };

  optionListMenu: MenuItem[] = [];
  optionListMenuGA: MenuItem[] = [];
  optionEditMenuGA: MenuItem[] = [];
  selectedMenu: MenuItem[] = [];
  selectedMenuEdit: MenuItem[] = [];
  selectedMenuGA: MenuItem[] = [];
  selectAll: boolean = false;
  categorizedMenu: any = {
    Accounting: [],
    Approval: [],
    Inventory: [],
    Purchasing: [],
    MRP: [],
    HR: [],
    Setting: [],
    Utility: [],
    Marketing: [],
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private httpService: SecurityManagementService,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.currentUser = localStorage.getItem('currentEmail');
  }

  ngOnInit(): void {
    this.listUser();
    this.listGA();
    // this.LoadMenu_checkbox();
    this.getListUser();
    this.getListGA();
    this.loadMenu();
    this.callCode();
    this.getListDepartment();
    this.getDepartmentWMS();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  callCode() {
    this.groupCode = 'CSS';
    this.httpService.getData('100', this.groupCode).subscribe(
      (data) => {
        this.nogroupCode = data[0].groupCode;
      },
      (error) => {},
      () => {}
    );
  }

  loadMenu(): void {
    this.httpService.getData('13', '').subscribe(
      (data) => {
        this.optionListMenu = data.map((item: any) => ({
          label: item.MenuName,
          value: item.MenuId,
        }));
        this.categorizeMenu();
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  categorizeMenu(): void {
    this.categorizedMenu = {
      Dashboard: this.optionListMenu.filter(
        (item) => item.value >= 'C-1000' && item.value <= 'C-1005'
      ),
      Accounting: this.optionListMenu.filter(
        (item) => item.value >= 'C-0100' && item.value <= 'C-0199'
      ),
      Approval: this.optionListMenu.filter(
        (item) => item.value >= 'C-0200' && item.value <= 'C-0299'
      ),
      Inventory: this.optionListMenu.filter(
        (item) => item.value >= 'C-0300' && item.value <= 'C-0399'
      ),
      Purchasing: this.optionListMenu.filter(
        (item) => item.value >= 'C-0400' && item.value <= 'C-0499'
      ),
      MRP: this.optionListMenu.filter(
        (item) => item.value >= 'C-0500' && item.value <= 'C-0599'
      ),
      HR: this.optionListMenu.filter(
        (item) => item.value >= 'C-0600' && item.value <= 'C-0699'
      ),
      Utility: this.optionListMenu.filter(
        (item) => item.value >= 'C-0700' && item.value <= 'C-0799'
      ),
      Setting: this.optionListMenu.filter(
        (item) => item.value >= 'C-0800' && item.value <= 'C-0899'
      ),
      Marketing: this.optionListMenu.filter(
        (item) => item.value >= 'C-0900' && item.value <= 'C-0999'
      ),
    };
  }

  onSelectAllChange(event: any): void {
    if (event.checked) {
      this.selectAllOptions();
    } else {
      this.unselectAllOptions();
    }
  }

  onChangeMenu(event: any): void {
    this.updateSelectAll();
  }

  selectAllOptions(): void {
    this.selectedMenu = this.optionListMenu.map((option) => option.value);
    this.selectAll = true;
  }

  unselectAllOptions(): void {
    this.selectedMenu = [];
    this.selectAll = false;
  }

  updateSelectAll(): void {
    this.selectAll = this.selectedMenu.length === this.optionListMenu.length;
  }

  submitUserAccess() {
    this.httpService
      .save(
        '7',
        'insert',
        this.selectedUser,
        this.selectedGA,
        '',
        this.currentUser,
        '',
        '',
        '',
        ''
      )
      .subscribe(
        (data) => {
          this.postData = JSON.stringify(data);
          // this.table.ajax.reload();
        },
        (error) => {
          // this.snackBar.open('Data fail to save', 'Attention!', {
          //   duration: 2000,
          // });
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Data fail to save',
          });
          this.listUser();
        },
        () => {
          // this.snackBar.open('Data success to save', 'Success', {
          //   duration: 2000,
          // });
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data success to save',
          });
          this.listUser();
        }
      );
  }

  submitGroupAccess() {
    const selectedDeptHR = this.selectedDeptHR.join(',');
    const selectedDeptWMS = this.selectedDeptWMS.join(',');
    const selectedModule = this.selectedMenu.join(',');
    this.httpService
      .save(
        '5',
        'insert',
        this.nogroupCode,
        this.descriptionsInput,
        '',
        selectedDeptHR,
        selectedDeptWMS,
        this.currentUser,
        selectedModule,
        ''
      )
      .subscribe(
        (data) => {
          this.postData = JSON.stringify(data);
        },
        (error) => {
          this.listGA();
          this.reset();
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data has Saved',
          });
          setTimeout(() => {
            // window.location.reload();
          }, 1000);
          this.listGA();
          this.reset();
          this.callCode();
        }
      );
  }

  listGA() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Settings/Table_Ajax1';
    } else {
      url = baseUrlLuar + 'Settings/Table_Ajax1';
    }
    this.TableGA = $('#ListTableGA').DataTable();
    this.TableGA.destroy();
    this.ListTableGA = {
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
          code: '6',
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
              '<button class="btn btn-info btn-sm detail-btn"><i class="fa fa-ellipsis-h"></i></button>\t\t\t\t\t\t' +
              '<button class="btn btn-primary btn-sm btn-edit"><i class="fa fa-pencil"></i></button>\t\t\t\t\t\t' +
              '<button class="btn btn-danger btn-sm btn-delete"><i class="fa fa-trash"></i></button>'
            );
          },
        },
        {
          title: 'Group Code',
          data: 'groupCode',
          className: 'dt-body-center',
        },
        {
          title: 'Descriptions',
          data: 'Description',
          className: 'dt-body-center',
        },
        {
          title: 'Status',
          data: 'Status',
          className: 'dt-body-center',
        },
        // {
        //   title: 'Action',
        //   data: null,
        //   className: 'dt-body-center',
        //   render: function (t: any) {
        //     // tslint:disable-next-line: max-line-length
        //     return (
        //       '<button class="btn btn-info btn-sm btn-edit"><i class="fa fa-pencil"></i></button>\t\t\t\t\t\t' +
        //       '<button class="btn btn-danger btn-sm btn-delete"><i class="fa fa-trash"></i></button>'
        //     );
        //   },
        // },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.detail-btn', row).bind('click', () => {
          this.selectedValue1 = data;
          const GC = this.selectedValue1.groupCode;
          this.DetailGA(GC);
          this.displayModal = true;
        });
        $('.btn-edit', row).bind('click', () => {
          this.selectedValue1 = data;
          const EditGC = this.selectedValue1.groupCode;
          this.EditGA(EditGC);
          this.modalEdit = true;
        });
        $('.btn-delete', row).bind('click', () => {
          this.modalDelete = true;
          this.selectedValue1 = data;
          this.deleteGA(this.selectedValue1.groupCode);
        });
      },
    };
    this.TableGA = $('#ListTableGA').DataTable(this.ListTableGA);
  }

  DetailGA(groupCode: any) {
    this.httpService
      .getData('13', 'groupCode')
      .pipe(
        map((data: any) => {
          return data.map((item: any) => ({
            label: item.MenuName,
            value: item.MenuId,
          }));
        })
      )
      .subscribe(
        (menuOptions) => {
          this.optionListMenuGA = menuOptions;

          // Fetch the already selected menu items
          this.httpService.getData('14', groupCode).subscribe(
            (selectedData) => {
              this.selectedMenuGA = selectedData.map(
                (item: any) => item.menuId
              );
            },
            (error) => {
              console.error('Error fetching selected menus', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching menu options', error);
        }
      );
  }

  EditGA(groupCode: any) {
    this.httpService
      .getData('13', groupCode)
      .pipe(
        map((data: any) => {
          return data.map((item: any) => ({
            label: item.MenuName,
            value: item.MenuId,
          }));
        })
      )
      .subscribe(
        (menuOptions) => {
          this.optionEditMenuGA = menuOptions;

          // Fetch the already selected menu items
          this.httpService.getData('14', groupCode).subscribe(
            (selectedData) => {
              this.selectedMenuEdit = selectedData.map(
                (item: any) => item.menuId
              );
            },
            (error) => {
              console.error('Error fetching selected menus', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching menu options', error);
        }
      );
  }

  listUser() {
    var url;
    if (checkUrl()) {
      url = baseUrl + 'Settings/Table_Ajax1';
    } else {
      url = baseUrlLuar + 'Settings/Table_Ajax1';
    }
    this.TableUser = $('#listTableUser').DataTable();
    this.TableUser.destroy();
    this.ListTableUser = {
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
          code: '8',
        },
      },
      columns: [
        {
          title: 'Email',
          data: 'userName',
        },
        {
          title: 'Group Access',
          data: 'AccessGroup',
          className: 'dt-body-center',
        },
        {
          title: 'Action',
          data: null,
          className: 'dt-body-center',
          render: function (t: any) {
            // tslint:disable-next-line: max-line-length
            return (
              '<button class="btn btn-info btn-sm btn-edit"><i class="fa fa-pencil"></i></button>\t\t\t\t\t\t' +
              '<button class="btn btn-danger btn-sm btn-delete"><i class="fa fa-trash"></i></button>'
            );
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.btn-edit', row).bind('click', () => {
          this.selectedValue1 = data;
          this.modalEdit1 = true;
        });
        $('.btn-delete', row).bind('click', () => {
          this.modalDelete1 = true;
          this.selectedValue1 = data;
          this.deleteUserAccess(
            this.selectedValue1.userName,
            this.selectedValue1.AccessGroup
          );
        });
      },
    };
    this.TableUser = $('#listTableUser').DataTable(this.ListTableUser);
  }

  getListUser() {
    this.optionListUser = '';
    this.httpService.getData('2', '').subscribe(
      (data) => {
        const listuser = data.map((item: any) => {
          return {
            label: item.email,
            value: item.email,
          };
        });
        this.optionListUser = listuser;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getListGA() {
    this.optionListGA = '';
    this.httpService.getData('6', '').subscribe(
      (data) => {
        const groupAccess = data.map((item: any) => {
          return {
            label: item.groupCode + ' / ' + item.Description,
            value: item.groupCode,
          };
        });
        this.optionListGA = groupAccess;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getListDepartment() {
    this.optionListDepartmentHR = [];
    this.httpService.getDD2('4', '').subscribe(
      (data) => {
        const department = data.map((item: any) => {
          return {
            label: item.DeptName + ' - ' + item.SectName,
            value: item.SectCode,
          };
        });
        this.optionListDepartmentHR = department;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getDepartmentWMS() {
    this.optionListDepartmentWMS = [];
    this.httpService.getDD3('1', '').subscribe(
      (data) => {
        const department = data.map((item: any) => {
          return {
            label: item.NamaDept,
            value: item.KdDept,
          };
        });
        this.optionListDepartmentWMS = department;
      },
      (error) => {
        // Handle error
      }
    );
  }

  updateGA() {
    var status;
    if ($('#m_status').prop('checked')) {
      status = '1.1';
    } else {
      status = '1.2';
    }
    const groupCodeElement = $('#m_updatenogroupcode');
    const descriptionElement = $('#m_updatedescriptions');
    const groupCode: string = groupCodeElement.val() as string;
    const descriptions: string = descriptionElement.val() as string;
    const selectedModule = this.selectedMenuEdit.join(',');
    this.httpService
      .save(
        '5',
        'update',
        groupCode,
        descriptions,
        '',
        '',
        status,
        selectedModule,
        '',
        this.currentUser
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
            detail: 'Data has Deleted',
          });
          this.modalEdit = false;
          this.listGA();
        }
      );
  }

  editUserAccess() {
    const usernameElement = $('#m_updateusername');
    const username: string = usernameElement.val() as string;
    this.httpService
      .save(
        '7',
        'update',
        username,
        this.selectedEditGA,
        this.currentUser,
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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data has Edited',
          });
          this.modalEdit1 = false;
          this.listUser();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      );
  }

  deleteGA(groupCode: any) {
    // const groupCodeElement = $('#m_deletenogroupcode');
    // const groupCode: string = groupCodeElement.val() as string;
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda harus menginput ulang bila salah satu Group Access di hapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, batalkan!',
      cancelButtonText: 'Tidak!',
    }).then((result) => {
      if (result.value) {
        this.httpService
          .save('5', 'delete', groupCode, '', '', '', '', '', '', '')
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
              this.listGA();
              this.callCode();
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Dibatalkan', 'Data tetap aman :)', 'error');
      }
    });
  }

  deleteUserAccess(username: any, accessgroup: any) {
    // const usernameElement = $('#m_deleteusername');
    // const accessgroupElement = $('#m_deleteaccessgroup');
    // const username: string = usernameElement.val() as string;
    // const accessgroup: string = accessgroupElement.val() as string;
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda harus menginput ulang bila salah satu User di hapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batalkan!',
    }).then((result) => {
      if (result.value) {
        this.httpService
          .save('7', 'delete', username, accessgroup, '', '', '', '', '', '')
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
              this.modalDelete1 = false;
              this.listUser();
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Dibatalkan', 'Data tetap aman :)', 'error');
      }
    });
  }

  reset() {
    $('#namegroupaccess').val('');
    $('#descriptions').val('');
  }
}
