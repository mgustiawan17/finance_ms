import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as baseurl from '../../../pages/baseurl';
import { map } from 'rxjs';

@Injectable()
export class SecurityManagementService {
  constructor(private http: HttpClient) {}

  save(
    code: String,
    param1: String,
    param2: String,
    param3: String,
    param4: String,
    param5: String,
    param6: String,
    param7: String,
    param8: String,
    param9: String
  ) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
      param5: param5,
      param6: param6,
      param7: param7,
      param8: param8,
      param9: param9,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + '/Settings/postData1', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Settings/postData1', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getData(code: String, param1: String) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + '/Settings/getData1', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Settings/getData1', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getDD2(code: string, param1: string) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getDD2', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Dropdown/getDD2', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getDD3(code: string, param1: string) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getDD3', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Dropdown/getDD3', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

}
