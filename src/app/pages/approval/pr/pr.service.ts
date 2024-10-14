import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../pages/baseurl';
import { checkUrl } from '../../../pages/baseurl';

@Injectable()
export class PrService {
  constructor(private http: HttpClient) {}

  UpdateStatusApprove(company: string, param1: string, param4: string) {
    const json = JSON.stringify({
      code: '3',
      company: company,
      param3: localStorage.getItem('currentEmail'),
      param1: param1,
      param4: param4,
    });
    if (checkUrl()) {
      return this.http
        .post(baseurl.baseUrl + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    }
  }

  UpdateStatusOpen(company: string, param1: string, param4: string) {
    const json = JSON.stringify({
      code: '4',
      company: company,
      param3: localStorage.getItem('currentEmail'),
      param1: param1,
      param4: param4,
    });
    if (checkUrl()) {
      return this.http
        .post(baseurl.baseUrl + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    }
  }

  UpdateStatusReject(
    company: string,
    param1: string,
    param4: string,
    param2: string
  ) {
    const json = JSON.stringify({
      code: '5',
      company: company,
      param3: localStorage.getItem('currentEmail'),
      param1: param1,
      param4: param4,
      param2: param2,
    });
    if (checkUrl()) {
      return this.http
        .post(baseurl.baseUrl + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Pembelian/Submit_SP002', json)
        .pipe(
          map((response: any) => {
            // const data = response.data;
            return response;
          })
        );
    }
  }
}
