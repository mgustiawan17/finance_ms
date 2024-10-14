import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../pages/baseurl';
import { checkUrl } from '../../../pages/baseurl';

@Injectable()
export class LeaveService {
  constructor(private http: HttpClient) {}

  UpdateStatus(permitno: string, param1: string, param2: string) {
    const json = JSON.stringify({
      code: '8',
      permitno: permitno,
      userid: localStorage.getItem('currentEmail'),
      param1: param1,
      param2: param2,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Permit/Permit', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + 'Permit/Permit', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    }
  }
}
