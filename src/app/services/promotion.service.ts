import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-httpmsg.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PromotionService {

  constructor(private http: Http,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get(baseURL + 'promotions')
      .map(res => this.processHTTPMsgService.extractData(res));
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions/' + id)
      .map(res => this.processHTTPMsgService.extractData(res));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get(baseURL + 'promotions?featured=true')
      .map(res => this.processHTTPMsgService.extractData(res)[0]);
  }

}
