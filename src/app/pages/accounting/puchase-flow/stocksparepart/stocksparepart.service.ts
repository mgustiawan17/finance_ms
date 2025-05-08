import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../baseurl';
import { checkUrl } from '../../../baseurl';
import * as baseurlCSS from '../../../baseurlCSS';
import { checkUrlCSS } from '../../../baseurlCSS';

@Injectable()
export class StocksparepartService {
  constructor(private http: HttpClient) {}

  SP_21_data_gudang(code: string) {
    const json = JSON.stringify({
      code: code,
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/SP_21_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/SP_21_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }
}
