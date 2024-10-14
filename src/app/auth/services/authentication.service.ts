import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../pages/baseurl';

@Injectable()
export class AuthenticationService {
  statusServer: Boolean = false;
  constructor(private http: HttpClient) {}

  login(code: String, param1: String, param2: String, param3: String) {
    this.statusServer = false;
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
    });
    if (baseurl.checkUrl()) {
      return this.http.post<any>(baseurl.baseUrl + 'Auth/index', json).pipe(
        map((data: any) => {
          if (data.status === 200) {
            const responseData = data.body;
            // localStorage.setItem('currentIdUser', responseData[0].Id);
            // localStorage.setItem('currentStatusUser',responseData[0].StatusUser);
            // localStorage.setItem('currentRegister', responseData[0].Register);
            // localStorage.setItem('currentTypeUser', responseData[0].UserType);
            // localStorage.setItem('currentSectionName',responseData[0].SectionName);
            // localStorage.setItem('currentEmail', responseData[0].Email);
            // localStorage.setItem('currentDept', responseData[0].DeptName);
            // localStorage.setItem('currentName', responseData[0].EmpName);
            // localStorage.setItem('currentJR', responseData[0].JRCode);
            localStorage.setItem('currentUserName', responseData[0].userName);
            localStorage.setItem('currentRegister', responseData[0].RegisterNo);
            localStorage.setItem('currentUserType', responseData[0].UserType);
            localStorage.setItem('currentStatus', responseData[0].Status);
            localStorage.setItem('currentSectName', responseData[0].SectName);
            localStorage.setItem('currenJRCode', responseData[0].JRCode);
            localStorage.setItem('currentDeptName', responseData[0].DeptName);
            localStorage.setItem('currentPosCode', responseData[0].PosCode);
            localStorage.setItem('currentEmail', responseData[0].Email);
            localStorage.setItem('currentInstansi', responseData[0].DefaultIns);
            localStorage.setItem(
              'currentGroupCode',
              responseData[0].AccessGroup
            );
            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return this.http.post<any>(baseurl.baseUrlLuar + 'Auth', json).pipe(
        map((data: any) => {
          if (data.status === 200) {
            const responseData = data.body;
            // localStorage.setItem('currentIdUser', responseData[0].Id);
            // localStorage.setItem('currentStatusUser', responseData[0].StatusUser );
            // localStorage.setItem('currentRegister', responseData[0].Register);
            // localStorage.setItem('currentTypeUser', responseData[0].UserType);
            // localStorage.setItem( 'currentSectionName',responseData[0].SectionName);
            // localStorage.setItem('currentEmail', responseData[0].Email);
            // localStorage.setItem('currentDept', responseData[0].DeptName);
            // localStorage.setItem('currentName', responseData[0].EmpName);
            // localStorage.setItem('currentJR', responseData[0].JRCode);
            localStorage.setItem('currentUserName', responseData[0].userName);
            localStorage.setItem('currentRegister', responseData[0].RegisterNo);
            localStorage.setItem('currentUserType', responseData[0].UserType);
            localStorage.setItem('currentStatus', responseData[0].Status);
            localStorage.setItem('currentSectName', responseData[0].SectName);
            localStorage.setItem('currenJRCode', responseData[0].JRCode);
            localStorage.setItem('currentDeptName', responseData[0].DeptName);
            localStorage.setItem('currentPosCode', responseData[0].PosCode);
            localStorage.setItem('currentEmail', responseData[0].Email);
            localStorage.setItem('currentInstansi', responseData[0].DefaultIns);
            localStorage.setItem(
              'currentGroupCode',
              responseData[0].AccessGroup
            );
            return true;
          } else {
            return false;
          }
        })
      );
    }
  }

  removeSession(Ip: string) {
    const UserId = localStorage.getItem('currentUser');
    const json = JSON.stringify({ UserId: UserId, Ip: Ip });
    const params = json.replace(/\\"/g, '');
    const header = new HttpHeaders();
    return this.http
      .post<any>(baseurl.baseUrl + '/Auth/removeSession', params, {
        headers: header,
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentIdUser');
    localStorage.removeItem('currentStatusUser');
    localStorage.removeItem('currentRegister');
    localStorage.removeItem('currentTypeUser');
    localStorage.removeItem('currentSectionName');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentDept');
    localStorage.removeItem('currentName');
    localStorage.removeItem('currentJR');
  }

  // logout(Ip: string) {
  //   const UserId = localStorage.getItem('currentUser');
  //   const json = JSON.stringify({ UserId: UserId, Ip: Ip });
  //   const params = json.replace(/\\"/g, '');
  //   const header = new HttpHeaders();
  //   return this.http
  //     .post(baseurl.baseUrl + '/Auth/removeSession', params, {
  //       headers: header,
  //     })
  //     .pipe(
  //       map((data: any) => {
  //         return data;
  //       })
  //     );
  // }

  ping() {
    return this.http.get(baseurl.baseUrl).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
}
