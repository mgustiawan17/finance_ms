import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as baseurl from '../../../../pages/baseurl';
import * as baseurlAI from '../../../../pages/baseurlAI';
import { map, Observable } from 'rxjs';

@Injectable()
export class AsideService {
  constructor(private http: HttpClient) {}

  getListMenu(code: String, param1: String, param2: String, param3: String) {
    const json = JSON.stringify({
      code: code,
      param1: param1,
      param2: param2,
      param3: param3,
    });
    if (baseurl.checkUrl()) {
      return this.http.post(baseurl.baseUrl + '/Settings/getData1', json).pipe(
        map((response: any) => {
          console.log(response);
          const data = response.data;
          return data;
        })
      );
    } else {
      return this.http
        .post(baseurl.baseUrlLuar + '/Settings/getData1', json)
        .pipe(
          map((response: any) => {
            const data = response.data;
            return data;
          })
        );
    }
  }

  generateText(prompt: string): Observable<any> {
    if (baseurlAI.checkUrl()) {
      return this.http.post(baseurlAI.baseUrl + '/gemini/generate_text', {
        prompt,
      });
    } else {
      return this.http.post(baseurlAI.baseUrlLuar + '/gemini/generate_text', {
        prompt,
      });
    }
  }
}
