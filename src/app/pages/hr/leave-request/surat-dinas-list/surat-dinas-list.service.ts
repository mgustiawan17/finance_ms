import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../../pages/baseurl';
import { checkUrl } from '../../../../pages/baseurl';

@Injectable()
export class SuratDinasListService {
  constructor(private http: HttpClient) {}

  GetDeptSect(code: string) {
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

  InsertEdit(
    permitno: string,
    regNo: string,
    param1: string,
    param2: string,
    param3: string
  ) {
    const json = JSON.stringify({
      code: '310',
      permitno: permitno,
      regNo: regNo,
      param1: param1,
      param2: param2,
      param3: param3,
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

  print_dinas(param1: string, permitno: string) {
    const json = JSON.stringify({
      code: '311',
      param1: param1,
      permitno: permitno,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Permit/Permit_stat', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Permit/Permit_stat', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getDetail(userId: string, NoSurat: string) {
    const json = JSON.stringify({
      code: '312',
      userid: userId,
      permitno: NoSurat,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Permit/Permit_stat', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Permit/Permit_stat', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  UploadDinas1(permitno: String, empName: String, UrlMedia: String) {
    const json = JSON.stringify({
      code: '313',
      permitno: permitno,
      param4: empName,
      param5: UrlMedia,
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

  getImage(code: String, NoSurat: String) {
    const json = JSON.stringify({
      code: code,
      permitno: NoSurat,
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
}
