import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../baseurl';
import { checkUrl } from '../../baseurl';
import { map } from 'rxjs';

@Injectable()
export class InventoryUsageService {

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

  getDEPT(code: string) {
    const json = JSON.stringify({ 
      code: code,
      });
      if (baseurl.checkUrl()) {
          return this.http
          .post(baseurl.baseUrl + '/Dropdown/getDD3', json)
          .pipe(
              map((response: any) => {
                  const data = response.data;
                  return data;
              })
          );
      } else {
          return this.http
          .post(baseurl.baseUrlLuar + '/Dropdown/getDD3', json)
          .pipe(
              map((response: any) => {
                  const data = response.data;
                  return data;
              })
          );
      }
  }

  getGROUPS(code: string) {
    const json = JSON.stringify({ 
      code: code,
      });
      if (baseurl.checkUrl()) {
          return this.http
          .post(baseurl.baseUrl + '/Dropdown/getDD3', json)
          .pipe(
              map((response: any) => {
                  const data = response.data;
                  return data;
              })
          );
      } else {
          return this.http
          .post(baseurl.baseUrlLuar + '/Dropdown/getDD3', json)
          .pipe(
              map((response: any) => {
                  const data = response.data;
                  return data;
              })
          );
      }
  }
}
