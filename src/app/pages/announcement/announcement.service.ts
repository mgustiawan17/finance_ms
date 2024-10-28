import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../baseurl';
import { checkUrl } from '../baseurl';
import { map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AnnouncementService {
  constructor(private http: HttpClient) {}

  getAnno() {
    if (baseurl.checkUrl()) {
      return this.http.get(baseurl.baseUrl + 'Information/getInfo').pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http.get(baseurl.baseUrlLuar + 'Information/getInfo').pipe(
        map((response: any) => {
          const data = response.data;
          return data;
        })
      );
    }
  }
}
