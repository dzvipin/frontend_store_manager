import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpParams} from '@angular/common/http';
import {config} from '../../config/config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private httpClient: HttpClient) {}

  getGeoLocationData(userInput): Observable<any>{
    let params = new HttpParams();
    params = params.append('address', userInput);
    params = params.append('key', config.geoAPIKey);
    return this.httpClient.get(config.geoAPI, {params});

  }


  createStore(payload): Observable<any>{
    let params = new HttpParams();
    // params = params.append('key', config.geoAPIKey);
    console.log('payload')
    return this.httpClient.post(config.createStore, payload, {params});
  }

  searchStore(payload,pageNumber,pageSize): Observable<any>{
    let params = new HttpParams();
    console.log('pagenumber ::',pageNumber,' and pagesize ::: ',pageSize)
    //params = params.append('key', config.geoAPIKey);
    let url = config.searchShop
    if(pageNumber !== null && pageNumber !== undefined && pageSize){
      console.log('coming::::::::::::::::::')
      url = config.searchShop+`?pageNumber=${pageNumber}` + `&pageSize=${pageSize}`
    }
    return this.httpClient.post(url,payload, {params});
  }

  getShopDetails(payload, pageNumber, pageSize): Observable<any> {
    return this.httpClient.get(config.getShops + `?pageNumber=${pageNumber}` + `&pageSize=${pageSize}`);
  }

}
