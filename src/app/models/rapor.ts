export interface RaporOlusturRequest {
  vergiKimlikNo?: string;
  tcKimlikNo?: string;
  anaRaporTuruId: string;
  raporTuruId: string;
  vergiKoduId: string;
  duzenlemeTarihi: string; // 'yyyy-MM-dd'
  aciklama?: string;
}

export interface RaporResponse {
  id: string;
  raporId: string;
  raporKayitNo: string;
  vergiKimlikNo: string | null;
  tcKimlikNo: string | null;
  adSoyadUnvan: string;
  duzenlemeTarihi: string;
  aciklama: string | null;
  durum: string;
  anaRaporTuruId: string;
  anaRaporTuruKodu: string;
  anaRaporTuruAdi: string;
  raporTuruId: string;
  raporTuruKodu: string;
  raporTuruAdi: string;
  vergiKoduId: string;
  vergiKodu: string;
  vergiKoduAdi: string;
}
