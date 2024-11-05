import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../../pages/baseurl';
import { checkUrl } from '../../../../pages/baseurl';

@Injectable()
export class SuratIzinService {
  constructor(private http: HttpClient) {}

  GetNoSuratIzin() {
    const json = JSON.stringify({ code: '1', param1: 'SI' });
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

  InsertSuratizin(
    param1: string,
    param2: string,
    param3: string,
    param4: string,
    regNo: string,
    userid: string
  ) {
    const json = JSON.stringify({
      code: '410',
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
      regNo: regNo,
      userid: userid,
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

  InsertTempIzin(
    permitno: string,
    regNo: string,
    userid: string,
    param1: string,
    param2: string,
    param3: string
  ) {
    const json = JSON.stringify({
      code: '401',
      permitno: permitno,
      regNo: regNo,
      userid: userid,
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

  DeleteTemp(noSurat: String) {
    const json = JSON.stringify({
      code: '408',
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

  DeleteTempId(id: String, noSurat: String) {
    const json = JSON.stringify({
      code: '',
      id: '',
      permitno: noSurat,
      userid: '',
      param1: '',
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + '', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + '', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    }
  }

  SaveIzin(
    noSurat: String,
    param1: string,
    param2: string,
    param3: string,
    param4: string,
    param5: string
  ) {
    const json = JSON.stringify({
      code: '402',
      userid: localStorage.getItem('currentEmail'),
      permitno: noSurat,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
      param5: param5,
    });
    if (checkUrl()) {
      return this.http.post(baseurl.baseUrl + '', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    } else {
      return this.http.post(baseurl.baseUrlLuar + '', json).pipe(
        map((response: any) => {
          // const data = response.data;
          return response;
        })
      );
    }
  }
}
