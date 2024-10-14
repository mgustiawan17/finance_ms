import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../baseurl';
import { checkUrl } from '../baseurl';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getData(code: string, param1: string, param2: string) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
    });
    if (checkUrl()) {
      return this.http
        .post(baseurl.baseUrl + 'Dashboard/SPDSB_AJAXtest', json)
        .pipe(
          map((response: any) => {
            // console.log(response);
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Dashboard/SPDSB_AJAXtest', json)
        .pipe(
          map((response: any) => {
            // console.log(response);
            const data = response.data;
            return data;
          })
        );
    }
  }

  // getData1(code: string, param1: string, company: string): Observable<any> {
  //   const json = JSON.stringify({
  //     code: code,
  //     param1: param1,
  //     company: company,
  //   });
  //   if (baseurl.checkUrl()) {
  //     return this.http
  //       .post(baseurl.baseUrl + '/Dashboard/SPDSB_AJAXCoba', json)
  //       .pipe(
  //         map((response: any) => {
  //           console.log(response);
  //           const data = response.data;
  //           return data;
  //         })
  //       );
  //   } else {
  //     return this.http
  //       .post(baseurl.baseUrlLuar + '/Dashboard/SPDSB_AJAXCoba', json)
  //       .pipe(
  //         map((response: any) => {
  //           console.log(response);
  //           const data = response.data;
  //           return data;
  //         })
  //       );
  //   }
  // }
}
