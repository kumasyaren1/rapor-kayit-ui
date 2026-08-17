import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RaporOlusturRequest, RaporResponse } from '../models/rapor';

export interface RaporSorguKriterleri {
  raporKayitNo?: string;
  vergiKimlikNo?: string;
  tcKimlikNo?: string;
  durum?: string;
  anaRaporTuruId?: string;
  raporTuruId?: string;
  baslangicTarihi?: string;
  bitisTarihi?: string;
}

export interface SayfalanmisSonuc<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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
  raporGuncelle(id: string, request: RaporOlusturRequest): Observable<RaporResponse> {
    return this.http.put<RaporResponse>(`${this.apiUrl}/${id}`, request);
  }
  iptalEt(id: string): Observable<RaporResponse> {
    return this.http.put<RaporResponse>(`${this.apiUrl}/${id}/iptal`, {});
  }

  tahakkukKes(id: string): Observable<RaporResponse> {
    return this.http.post<RaporResponse>(`${this.apiUrl}/${id}/tahakkuk`, {});
  }

  cevapKaydet(
    id: string,
    payload: { cevapNumarasi: string; cevapTarihi: string; cevapSonucu: string },
  ): Observable<RaporResponse> {
    return this.http.post<RaporResponse>(`${this.apiUrl}/${id}/cevap`, payload);
  }

  raporSorgula(
    kriterler: RaporSorguKriterleri,
    sayfa = 0,
    boyut = 10,
  ): Observable<SayfalanmisSonuc<RaporResponse>> {
    let params = new HttpParams().set('page', sayfa.toString()).set('size', boyut.toString());

    Object.entries(kriterler).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });

    return this.http.get<SayfalanmisSonuc<RaporResponse>>(this.apiUrl, { params });
  }
}
