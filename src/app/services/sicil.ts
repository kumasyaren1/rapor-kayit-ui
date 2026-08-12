import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MukellefResponse } from '../models/mukellef-response';

@Injectable({
  providedIn: 'root'
})
export class SicilService {

  private readonly apiUrl =
    'http://localhost:8080/api/sicil/mukellef';

  constructor(private http: HttpClient) {}

  mukellefSorgula(
    vergiKimlikNo?: string,
    tcKimlikNo?: string
  ): Observable<MukellefResponse> {

    let params = new HttpParams();

    if (vergiKimlikNo?.trim()) {
      params = params.set(
        'vergiKimlikNo',
        vergiKimlikNo.trim()
      );
    }

    if (tcKimlikNo?.trim()) {
      params = params.set(
        'tcKimlikNo',
        tcKimlikNo.trim()
      );
    }

    return this.http.get<MukellefResponse>(
      this.apiUrl,
      { params }
    );
  }
}
