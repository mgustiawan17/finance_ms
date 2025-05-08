import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../baseurl';
import { checkUrl } from '../../../baseurl';

@Injectable()
export class ReturkontrabonService {
  constructor(private http: HttpClient) {}
}
