import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../../pages/baseurl';
import { checkUrl } from '../../../../pages/baseurl';

@Injectable()
export class SisaCutiService {
  constructor(private http: HttpClient) {}

  GetDeptSect(code: string, param1: any, param2: any, param3: any) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + 'Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    }
  }

  GetEmployee(code: string, param1: any, param2: any, company: any) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      company: company,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + 'Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    }
  }
}
