import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../baseurl';
import { checkUrl } from '../../../baseurl';
import * as baseurlCSS from '../../../baseurlCSS';
import { checkUrlCSS } from '../../../baseurlCSS';

@Injectable()
export class ReturinternService {
  constructor(private http: HttpClient) {}

  SP_22_data_gudang(code: string) {
    const json = JSON.stringify({
      code: code,
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/SP_22_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/SP_22_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  SP_22_data_chart(
    code: string,
    param1: string,
    param2: string,
    param3: string,
    param4: string
  ) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
      param4: param4,
    });
    if (checkUrlCSS()) {
      return this.http
        .post(baseurlCSS.baseUrlCss + 'Accounting/SP_22_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    } else {
      return this.http
        .post(baseurlCSS.baseUrlCssLuar + 'Accounting/SP_22_data', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }
}
