import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RaporOlusturRequest, RaporResponse } from '../models/rapor';

@Injectable({ providedIn: 'root' })
export class RaporService {
  private readonly apiUrl = 'http://localhost:8080/api/raporlar';

  constructor(private http: HttpClient) {}

  raporOlustur(request: RaporOlusturRequest): Observable<RaporResponse> {
    return this.http.post<RaporResponse>(this.apiUrl, request);
  }
  raporGetir(id: string): Observable<RaporResponse> {
    return this.http.get<RaporResponse>(`${this.apiUrl}/${id}`);
  }
}
