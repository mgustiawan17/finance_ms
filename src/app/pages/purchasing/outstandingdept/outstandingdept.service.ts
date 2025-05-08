import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../../pages/baseurl';
import { map } from 'rxjs';

@Injectable()
export class OutstandingDeptService {

  constructor(private http: HttpClient) { }

    getDD3(code: string, company: string){
    const json = JSON.stringify({ 
        code: code, 
        company: company
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