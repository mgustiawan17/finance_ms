import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurlCSS from '../../../baseurlCSS';
import { checkUrlCSS } from '../../../baseurlCSS';

@Injectable()
export class CheckkontrabonService {
  constructor(private http: HttpClient) {}

  getSupp(code: any) {
    const json = JSON.stringify({
      code: code,
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/SP_11_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/SP_11_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  getBTB(KdSupp: any) {
    const json = JSON.stringify({
      KdSupp: KdSupp,
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/GetBTB', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/GetBTB', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  simpan(noTrx: String, tglPeriksa: Date, keterangan: String) {
    const json = JSON.stringify({
      noTrx: noTrx,
      date: tglPeriksa,
      note: keterangan,
      user: localStorage.getItem('currentUser'),
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/SP_2_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/SP_2_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }
}
