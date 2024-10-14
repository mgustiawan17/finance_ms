import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../../baseurl';
import { checkUrl } from '../../../../pages/baseurl';
import { map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AttendancePeriodeService {
  constructor(private http: HttpClient) {}

  getData() {
    const json = JSON.stringify({
      code: 1,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getData', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Dropdown/getData', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getDD2() {
    const json = JSON.stringify({
      code: '4',
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + '/Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Dropdown/getDD2', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getDD2Employee(code: string, param1: string, param2: string) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
    });

    const url = baseurl.checkUrl() ? baseurl.baseUrl : baseurl.baseUrlLuar;

    return this.http.post(url + '/Dropdown/getDD2', json).pipe(
      map((response: any) => response.data),
      catchError((error: any) => {
        console.error('Error fetching employee data:', error);
        return throwError('Error fetching employee data');
      })
    );
  }

  getDD2Jenis(code: string) {
    const json = JSON.stringify({
      code: code,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + '/Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Dropdown/getDD2', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }
}
