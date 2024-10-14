import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../pages/baseurl';
import { checkUrl } from '../../../pages/baseurl';

@Injectable()
export class PoService {
  constructor(private http: HttpClient) {}

  UpdateStatusApprove(
    param1: string,
    param2: string,
    param3: string,
    company: string
  ) {
    const json = JSON.stringify({
      code: '8',
      param1: param1,
      param2: param2,
      param3: param3,
      company: company,
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
    param1: string,
    param2: string,
    param3: string,
    param4: string,
    company: string
  ) {
    const json = JSON.stringify({
      code: '8',
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
      company: company,
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
