import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../../pages/baseurl';
import { checkUrl } from '../../../../pages/baseurl';
import { param } from 'jquery';

@Injectable()
export class SuratLemburService {
  constructor(private http: HttpClient) {}

  GetNoSuratCuti() {
    const json = JSON.stringify({ code: '1', param1: 'SL' });
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

  GetEmployee(code: string, param1: any) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
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

  InsertTempLembur(
    permitno: string,
    regNo: string,
    userid: string,
    param1: string,
    param2: string,
    param3: string,
    param4: string,
    param5: string
  ) {
    const json = JSON.stringify({
      code: '201',
      permitno: permitno,
      regNo: regNo,
      userid: userid,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
      param5: param5,
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

  DeleteTempId(id: String, noSurat: String) {
    const json = JSON.stringify({
      code: '207',
      id: id,
      permitno: noSurat,
      userid: localStorage.getItem('currentEmail'),
      param1: 'i',
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

  DeleteTemp(noSurat: String) {
    const json = JSON.stringify({
      code: '208',
      permitno: noSurat,
      userid: localStorage.getItem('currentEmail'),
      param1: 'i',
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

  SaveLembur(
    noSurat: String,
    company: String,
    param1: string,
    param2: string,
    param3: string,
    param4: string
  ) {
    const json = JSON.stringify({
      code: '202',
      userid: localStorage.getItem('currentEmail'),
      permitno: noSurat,
      company: company,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
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
