import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../baseurl';
import { Observable, map } from 'rxjs';

@Injectable()
export class PriceindexService {

    constructor(private http: HttpClient) { }


    getData2(code: string, param1: string){
        const json = JSON.stringify({ 
            code: code, 
            param1: param1
        });
        if (baseurl.checkUrl()) {
            return this.http
            .post(baseurl.baseUrl + '/Pembelian/SP002', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        } else {
            return this.http
            .post(baseurl.baseUrlLuar + '/Pembelian/SP002', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        }
    }

}