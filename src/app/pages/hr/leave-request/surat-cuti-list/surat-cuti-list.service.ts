import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../../pages/baseurl';
import { checkUrl } from '../../../../pages/baseurl';

@Injectable()
export class SuratCutiListService {
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

  GetJenisCuti(code: string) {
    const json = JSON.stringify({
      code: code,
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

  GetSisaCuti(code: string, register: string, param1: string, company: string) {
    const json = JSON.stringify({
      code: code,
      regNo: register,
      param1: param1,
      company: company,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Permit/Permit', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + 'Permit/Permit', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    }
  }

  InsertEdit(
    noSurat: string,
    param1: string,
    regNo: string,
    param2: string,
    param3: string,
    param4: string,
    param5: string,
    company: string
  ) {
    const json = JSON.stringify({
      code: '102',
      permitno: noSurat,
      param1: param1,
      regNo: regNo,
      param2: param2,
      param3: param3,
      param4: param4,
      param5: param5,
      company: company,
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
