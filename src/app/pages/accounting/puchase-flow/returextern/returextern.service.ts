import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as baseurl from '../../../baseurl';
import { checkUrl } from '../../../baseurl';
import * as baseurlCSS from '../../../baseurlCSS';
import { checkUrlCSS } from '../../../baseurlCSS';

@Injectable()
export class ReturexternService {
  constructor(private http: HttpClient) {}
}
