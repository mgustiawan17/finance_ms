import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as baseurl from '../../baseurl';
import { Observable, map } from 'rxjs';

@Injectable()
export class PurchasereportService {

  constructor(private http: HttpClient) { }


    save(
    code: String, 
    param1: String, 
    param2: String, 
    param3: String, 
    param4: String, 
    param5: String,
    param6: String,
    param7: String,
    param8: String,
    ){
    const json = JSON.stringify({ 
        code: code,
        param1: param1,
        param2: param2,
        param3: param3,
        param4: param4,
        param5: param5, 
        param6: param6,
        param7: param7,
        param8: param8
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

    getData(code: String, param1: String, param2: String, param3: String, param4: String){
        const json = JSON.stringify({ 
            code: code, 
            param1: param1,
            param2: param2,
            param3: param3, 
            param4: param4
        });
        if (baseurl.checkUrl()) {
            return this.http
            .post(baseurl.baseUrl + '/Pembelian/Submit_SP002', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        } else {
            return this.http
            .post(baseurl.baseUrlLuar + '/Pembelian/Submit_SP002', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        }
    }

    getDD1(code: string, param1: string){
        const json = JSON.stringify({ 
            code: code, 
            param1: param1
        });
        if (baseurl.checkUrl()) {
            return this.http
            .post(baseurl.baseUrl + '/Dropdown/getDD1', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        } else {
            return this.http
            .post(baseurl.baseUrlLuar + '/Dropdown/getDD1', json)
            .pipe(
                map((response: any) => {
                    const data = response.data;
                    return data;
                })
            );
        }
    }

    getDD3(code: string){
        const json = JSON.stringify({ 
            code: code
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
