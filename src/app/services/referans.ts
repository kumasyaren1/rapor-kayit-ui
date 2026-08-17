import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AnaRaporTuruResponse, RaporTuruResponse, VergiKoduResponse } from '../models/referans';

@Injectable({ providedIn: 'root' })
export class ReferansService {
  private readonly baseUrl = 'http://localhost:8080/api/referanslar';

  constructor(private http: HttpClient) {}

  anaRaporTurleriniGetir(): Observable<AnaRaporTuruResponse[]> {
    return this.http.get<AnaRaporTuruResponse[]>(`${this.baseUrl}/ana-rapor-turleri`);
  }

  raporTurleriniGetir(anaRaporTuruId: string): Observable<RaporTuruResponse[]> {
    return this.http.get<RaporTuruResponse[]>(
      `${this.baseUrl}/ana-rapor-turleri/${anaRaporTuruId}/rapor-turleri`,
    );
  }

  vergiKodlariniGetir(): Observable<VergiKoduResponse[]> {
    return this.http.get<VergiKoduResponse[]>(`${this.baseUrl}/vergi-kodlari`);
  }
}
