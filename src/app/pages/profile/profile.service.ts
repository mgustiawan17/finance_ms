import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../pages/baseurl';
import { map } from 'rxjs';

@Injectable()
export class ProfileService {
  // private imgUrl = '192.168.1.25:8083/KartuNamaFmtx/Foto/'
  constructor(private http: HttpClient) {}

  getData(param1: String) {
    const json = JSON.stringify({
      code: 2,
      param1: param1,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + 'Dropdown/getDataSKR', json).pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + 'Dropdown/getDataSKR', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  update(
    code: String,
    param1: String,
    param2: String,
    param3: String,
    param4: String
  ) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
    });
    if (baseurl.checkUrl()) {
      return this.http
        .post(baseurl.baseUrl + '/Settings/postData1_skr', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Settings/postData1_skr', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  // getFileNameByNoRegister(noRegister: string){
  //     return this.http.get<string>(`${this.imgUrl}${noRegister}.jpg`);
  // }
}
