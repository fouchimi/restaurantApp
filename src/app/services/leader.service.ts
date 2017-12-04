import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-httpmsg.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LeaderService {

  constructor(private http: Http,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get(baseURL + 'leaders')
      .map(res => this.processHTTPMsgService.extractData(res));
  }

  getLeader(id: number): Observable<Leader> {
    return this.http.get(baseURL + 'leaders/' + id)
      .map(res => this.processHTTPMsgService.extractData(res));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get(baseURL + 'leaders?featured=true')
      .map(res => this.processHTTPMsgService.extractData(res)[0]);
  }

}
