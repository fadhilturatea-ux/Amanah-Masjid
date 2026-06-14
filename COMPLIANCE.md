# 📋 COMPLIANCE — Amanah Masjid

> Dokumen Kepatuhan Regulasi & Standar Operasional Platform Amanah Masjid

**Versi:** 2.0.0  
**Terakhir Diperbarui:** 1 Juni 2026  
**Penanggung Jawab:** Tim Compliance & Legal — Amanah Masjid  
**Status:** ✅ Aktif & Berlaku

---

## Daftar Isi

1. [Standar Kepatuhan Overview](#1-standar-kepatuhan-overview)
2. [Regulasi yang Berlaku](#2-regulasi-yang-berlaku)
3. [Audit Trail](#3-audit-trail)
4. [Verifikasi Donasi](#4-verifikasi-donasi)
5. [Laporan Keuangan](#5-laporan-keuangan)
6. [KYC (Know Your Customer)](#6-kyc-know-your-customer)
7. [Anti-Money Laundering (AML)](#7-anti-money-laundering-aml)
8. [Data Privacy & Perlindungan Data](#8-data-privacy--perlindungan-data)
9. [Incident Response Plan](#9-incident-response-plan)
10. [Compliance Checklist & Self-Assessment](#10-compliance-checklist--self-assessment)
11. [Audit Pihak Ketiga](#11-audit-pihak-ketiga)
12. [Jadwal Review Kepatuhan](#12-jadwal-review-kepatuhan)

---

## 1. Standar Kepatuhan Overview

### 1.1 Tujuan

Platform Amanah Masjid berkomitmen untuk mematuhi seluruh regulasi yang berlaku di Indonesia dalam pengelolaan data pribadi, transaksi keuangan, dan operasional digital. Dokumen ini menjadi pedoman utama bagi seluruh tim dalam menjaga kepatuhan terhadap standar hukum, etika, dan operasional.

### 1.2 Ruang Lingkup

Kepatuhan mencakup seluruh aspek operasional platform:

| Aspek | Cakupan |
|-------|---------|
| **Data Pribadi** | Pengumpulan, penyimpanan, pemrosesan, dan penghapusan data jamaah |
| **Transaksi Keuangan** | Donasi, zakat, infaq, sedekah, dan pengelolaan dana masjid |
| **Keamanan Sistem** | Perlindungan infrastruktur, akses, dan integritas data |
| **Pelaporan** | Laporan keuangan, audit trail, dan transparansi publik |
| **Layanan AI** | Penggunaan AI yang bertanggung jawab dan etis |

### 1.3 Prinsip Dasar Kepatuhan

1. **Transparansi** — Semua proses harus dapat diaudit dan dipertanggungjawabkan
2. **Akuntabilitas** — Setiap tindakan memiliki penanggung jawab yang jelas
3. **Integritas Data** — Data harus akurat, lengkap, dan terlindungi
4. **Keadilan** — Tidak ada diskriminasi dalam penggunaan layanan
5. **Proporsionalitas** — Pengumpulan data sesuai kebutuhan minimum

---

## 2. Regulasi yang Berlaku

### 2.1 UU Perlindungan Data Pribadi (UU PDP)

Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi menjadi landasan utama pengelolaan data pada platform ini.

**Kewajiban Utama:**

| No | Kewajiban | Implementasi di Amanah Masjid |
|----|-----------|-------------------------------|
| 1 | Persetujuan eksplisit subjek data | Consent form digital saat registrasi |
| 2 | Hak akses data oleh subjek | Fitur "Data Saya" di dashboard jamaah |
| 3 | Hak koreksi data | Fitur edit profil dengan verifikasi |
| 4 | Hak penghapusan data | Mekanisme "Right to be Forgotten" |
| 5 | Penunjukan DPO | Data Protection Officer ditunjuk secara resmi |
| 6 | Notifikasi pelanggaran data | Sistem alert otomatis dalam 1×24 jam |
| 7 | Transfer data lintas batas | Dilarang tanpa persetujuan eksplisit |

### 2.2 Peraturan Keuangan

```
Regulasi yang dipatuhi:
├── UU No. 8 Tahun 2010 — Pencegahan dan Pemberantasan TPPU
├── PP No. 43 Tahun 2015 — Pelaporan Transaksi Keuangan
├── Peraturan PPATK — Transaksi Keuangan Mencurigakan
├── PSAK 45 — Pelaporan Keuangan Organisasi Nirlaba
└── Peraturan Menag — Pengelolaan Keuangan Masjid
```

### 2.3 Regulasi Teknologi Informasi

- **UU No. 11 Tahun 2008 (ITE)** — sebagaimana diubah dengan UU No. 19 Tahun 2016
- **PP No. 71 Tahun 2019** — Penyelenggaraan Sistem dan Transaksi Elektronik
- **Permenkominfo No. 20 Tahun 2016** — Perlindungan Data Pribadi dalam Sistem Elektronik

---

## 3. Audit Trail

### 3.1 Prinsip Pencatatan

Semua aktivitas pada platform dicatat secara otomatis dan tidak dapat dimodifikasi (immutable logging).

### 3.2 Kategori Log yang Dicatat

| Kategori | Detail yang Dicatat | Retensi |
|----------|---------------------|---------|
| **Transaksi Keuangan** | Jumlah, pengirim, penerima, waktu, status | 10 tahun |
| **Perubahan Data** | Data lama, data baru, siapa yang mengubah | 7 tahun |
| **Akses User** | Login, logout, IP address, device info | 5 tahun |
| **Akses Admin** | Semua tindakan admin dengan detail lengkap | 10 tahun |
| **Perubahan Konfigurasi** | Setting sistem, role, permission | 10 tahun |
| **Error & Incident** | Stack trace, severity, resolution | 3 tahun |

### 3.3 Format Log

```json
{
  "log_id": "uuid-v4",
  "timestamp": "2026-06-01T10:30:00.000Z",
  "event_type": "TRANSACTION_CREATED",
  "actor": {
    "user_id": "usr_abc123",
    "role": "DONATUR",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
  },
  "resource": {
    "type": "DONATION",
    "id": "don_xyz789",
    "action": "CREATE"
  },
  "details": {
    "amount": 500000,
    "currency": "IDR",
    "method": "BANK_TRANSFER",
    "previous_state": null,
    "new_state": "PENDING_VERIFICATION"
  },
  "metadata": {
    "session_id": "sess_abc",
    "correlation_id": "corr_def",
    "checksum": "sha256:..."
  }
}
```

### 3.4 Penyimpanan & Akses Log

- Log disimpan di database terpisah dengan akses read-only
- Backup log dilakukan setiap hari ke penyimpanan offsite
- Akses log hanya untuk role `SUPER_ADMIN` dan `AUDITOR`
- Log tidak dapat dihapus sebelum masa retensi berakhir

---

## 4. Verifikasi Donasi

### 4.1 Multi-Level Approval

Proses verifikasi donasi menggunakan sistem persetujuan bertingkat:

```
Alur Verifikasi Donasi:

[Donatur Submit] → [Sistem Auto-Check] → [Verifikator L1] → [Verifikator L2] → [Approved]
                          │                      │                    │
                          ▼                      ▼                    ▼
                    [Auto-Reject]          [Manual Review]      [Escalation]
                   (jika invalid)         (jika mencurigakan)  (jika > threshold)
```

| Level | Threshold Nominal | Pihak Verifikasi | SLA |
|-------|-------------------|------------------|-----|
| Auto | < Rp 500.000 | Sistem otomatis | Real-time |
| L1 | Rp 500.000 — Rp 5.000.000 | Staff Keuangan | 1×24 jam |
| L2 | Rp 5.000.000 — Rp 50.000.000 | Bendahara Masjid | 2×24 jam |
| L3 | > Rp 50.000.000 | Ketua DKM + Bendahara | 3×24 jam + KYC |

### 4.2 Bukti Transfer

Setiap donasi wajib menyertakan:

1. **Bukti transfer digital** — Screenshot/foto bukti bayar (format: JPG, PNG, PDF; max 5MB)
2. **Validasi otomatis** — OCR untuk mengekstrak data dari bukti transfer
3. **Cross-check** — Pencocokan dengan mutasi rekening bank masjid
4. **Timestamping** — Bukti diberi timestamp digital yang tidak dapat dimanipulasi

### 4.3 Reconciliation

```
Jadwal Reconciliation:
├── Harian   : Automatic matching transaksi dengan mutasi bank
├── Mingguan : Review manual untuk transaksi yang tidak cocok
├── Bulanan  : Full reconciliation seluruh akun
└── Tahunan  : Audit keuangan menyeluruh oleh akuntan publik
```

---

## 5. Laporan Keuangan

### 5.1 Standar Akuntansi

Laporan keuangan Amanah Masjid mengikuti standar:

- **PSAK 45** — Pelaporan Keuangan Entitas Nirlaba
- **PSAK 109** — Akuntansi Zakat dan Infak/Sedekah
- **SAK ETAP** — Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik

### 5.2 Jenis Laporan

| Laporan | Frekuensi | Audiens | Format |
|---------|-----------|---------|--------|
| Laporan Harian | Setiap hari | Internal (Bendahara) | Dashboard digital |
| Laporan Mingguan | Setiap Jumat | DKM & Pengurus | PDF + Dashboard |
| Laporan Bulanan | Setiap akhir bulan | Jamaah (publik) | PDF + Web |
| Laporan Triwulan | Setiap 3 bulan | Yayasan & Donatur utama | PDF formal |
| Laporan Tahunan | Akhir tahun | Publik & Regulator | PDF + Cetak |

### 5.3 Transparansi Publik

- Dashboard publik menampilkan ringkasan keuangan secara real-time
- Laporan bulanan dipublikasikan di website dan papan pengumuman masjid
- Setiap jamaah berhak meminta detail laporan melalui fitur "Permintaan Informasi"
- Laporan tahunan diaudit oleh Kantor Akuntan Publik (KAP) independen

---

## 6. KYC (Know Your Customer)

### 6.1 Kategori KYC

| Kategori Donatur | Threshold | Level Verifikasi |
|------------------|-----------|------------------|
| **Reguler** | < Rp 5.000.000/bulan | Registrasi dasar (nama, email, telepon) |
| **Premium** | Rp 5.000.000 — Rp 50.000.000/bulan | KYC Standar (+ KTP, alamat) |
| **VIP** | > Rp 50.000.000/bulan | Enhanced Due Diligence (EDD) |
| **Korporasi** | Semua nominal | KYC Korporasi (akta, NPWP, struktur organisasi) |

### 6.2 Proses Verifikasi KYC

```
KYC Standar:
1. Upload KTP/Identitas resmi
2. Verifikasi biometrik (foto selfie + KTP)
3. Validasi data melalui Dukcapil API (jika tersedia)
4. Review manual oleh tim compliance
5. Approval/Rejection dengan alasan tertulis

Enhanced Due Diligence (EDD):
1. Semua langkah KYC Standar
2. Verifikasi sumber dana
3. Screening terhadap daftar terduga teroris (DTTOT)
4. Pemeriksaan Politically Exposed Person (PEP)
5. Wawancara (jika diperlukan)
6. Review oleh Compliance Officer senior
```

### 6.3 Penyimpanan Data KYC

- Data KYC disimpan terenkripsi (AES-256) di server terpisah
- Akses hanya untuk tim Compliance yang terotorisasi
- Data KTP/identitas di-hash setelah verifikasi selesai
- Retensi data KYC: 5 tahun setelah hubungan berakhir

---

## 7. Anti-Money Laundering (AML)

### 7.1 Red Flags — Indikator Transaksi Mencurigakan

| No | Indikator | Tindakan |
|----|-----------|----------|
| 1 | Donasi berulang dengan nominal mendekati threshold | Auto-flag + review manual |
| 2 | Donasi dari IP address yang sama dengan akun berbeda | Blokir sementara + investigasi |
| 3 | Donasi besar dari akun baru tanpa riwayat | Hold dana + KYC wajib |
| 4 | Pola donasi yang tidak wajar (jam malam, frekuensi tinggi) | Alert ke Compliance Officer |
| 5 | Penggunaan VPN/proxy untuk menyembunyikan lokasi | Tambahan verifikasi identitas |
| 6 | Permintaan refund segera setelah donasi | Investigasi mendalam |
| 7 | Nominal donasi selalu genap/bulat dalam jumlah besar | Monitoring berkelanjutan |

### 7.2 Transaction Monitoring

```javascript
// Contoh rule engine untuk deteksi transaksi mencurigakan
const AML_RULES = {
  // Rule 1: Structuring Detection
  structuring: {
    threshold: 10_000_000,     // Rp 10 juta
    window: '24h',
    maxTransactions: 3,
    action: 'FLAG_AND_REVIEW'
  },
  
  // Rule 2: Velocity Check
  velocity: {
    maxAmount: 50_000_000,     // Rp 50 juta per hari
    maxCount: 10,              // Max 10 transaksi per hari
    window: '24h',
    action: 'BLOCK_AND_ALERT'
  },
  
  // Rule 3: Unusual Pattern
  unusualPattern: {
    deviationFromAverage: 5,   // 5x dari rata-rata
    lookbackPeriod: '90d',
    action: 'FLAG_FOR_REVIEW'
  }
};
```

### 7.3 Pelaporan ke PPATK

- Transaksi mencurigakan dilaporkan ke PPATK dalam 3 hari kerja
- Transaksi tunai > Rp 500 juta dilaporkan otomatis
- Format pelaporan sesuai ketentuan PPATK yang berlaku
- Tim Compliance menyimpan salinan laporan selama 10 tahun

---

## 8. Data Privacy & Perlindungan Data

### 8.1 Consent Management

| Jenis Consent | Wajib/Opsional | Dapat Ditarik | Metode |
|---------------|----------------|---------------|--------|
| Data dasar registrasi | Wajib | Ya (hapus akun) | Checkbox saat registrasi |
| Notifikasi email | Opsional | Ya | Toggle di pengaturan |
| Analitik penggunaan | Opsional | Ya | Cookie consent banner |
| Berbagi data dengan mitra | Opsional | Ya | Persetujuan terpisah |
| Data untuk AI features | Opsional | Ya | Opt-in eksplisit |

### 8.2 Data Minimization

Prinsip pengumpulan data minimum yang diterapkan:

- Hanya kumpulkan data yang benar-benar diperlukan untuk layanan
- Review berkala terhadap data yang disimpan (quarterly)
- Hapus data yang tidak lagi diperlukan secara otomatis
- Anonimisasi data untuk keperluan analitik dan pelatihan AI

### 8.3 Right to be Forgotten

```
Prosedur Penghapusan Data:

1. Jamaah mengajukan permintaan melalui fitur "Hapus Data Saya"
2. Sistem memverifikasi identitas pemohon (2FA wajib)
3. Tim Compliance mereview permintaan (SLA: 3 hari kerja)
4. Data dihapus dari semua sistem (termasuk backup)
   ⚠️ Kecuali: data yang wajib disimpan secara hukum
5. Konfirmasi penghapusan dikirim ke pemohon
6. Log penghapusan dicatat (tanpa data pribadi)

Timeline: Maksimal 30 hari kalender dari permintaan
```

### 8.4 Data Breach Notification

- Notifikasi ke subjek data: maksimal 3×24 jam setelah deteksi
- Laporan ke regulator: maksimal 1×24 jam setelah deteksi
- Publikasi pengumuman: jika kebocoran berdampak luas
- Laporan insiden lengkap: 14 hari setelah deteksi

---

## 9. Incident Response Plan

### 9.1 Tingkat Severity Insiden

| Severity | Deskripsi | Response Time | Eskalasi |
|----------|-----------|---------------|----------|
| **P1 — Kritis** | Kebocoran data massal, sistem down total | 15 menit | CTO + DPO + CEO |
| **P2 — Tinggi** | Akses tidak sah ke data sensitif | 1 jam | CTO + Compliance Lead |
| **P3 — Sedang** | Anomali transaksi terdeteksi | 4 jam | Tech Lead + Compliance |
| **P4 — Rendah** | Percobaan akses gagal berulang | 24 jam | Security Team |

### 9.2 Prosedur Respons Insiden

```
Phase 1: DETEKSI & IDENTIFIKASI (0-30 menit)
├── Terima alert dari monitoring system
├── Identifikasi jenis dan scope insiden
├── Tentukan severity level
└── Aktifkan tim respons yang sesuai

Phase 2: CONTAINMENT (30 menit - 2 jam)
├── Isolasi sistem yang terdampak
├── Blokir akses mencurigakan
├── Preserve evidence (forensic copy)
└── Komunikasi internal ke stakeholder

Phase 3: ERADICATION (2-24 jam)
├── Identifikasi root cause
├── Patch kerentanan yang dieksploitasi
├── Scan sistem untuk backdoor/malware
└── Validasi integritas data

Phase 4: RECOVERY (24-72 jam)
├── Restore sistem dari backup bersih
├── Monitoring intensif pasca-recovery
├── Verifikasi semua layanan berjalan normal
└── Komunikasi ke jamaah/publik jika diperlukan

Phase 5: LESSONS LEARNED (1-2 minggu)
├── Post-incident review meeting
├── Dokumentasi insiden lengkap
├── Update prosedur keamanan
└── Training tambahan jika diperlukan
```

### 9.3 Tim Respons Insiden

| Peran | Tanggung Jawab | Kontak |
|-------|----------------|--------|
| Incident Commander | Koordinasi keseluruhan respons | On-call 24/7 |
| Technical Lead | Investigasi teknis dan mitigasi | On-call 24/7 |
| Compliance Officer | Aspek hukum dan pelaporan regulasi | Jam kerja + eskalasi |
| Communications Lead | Komunikasi internal dan eksternal | Jam kerja + eskalasi |
| Data Protection Officer | Perlindungan data dan notifikasi | Jam kerja + eskalasi |

---

## 10. Compliance Checklist & Self-Assessment

### 10.1 Checklist Bulanan

- [ ] Review log akses user dan admin
- [ ] Verifikasi semua transaksi donasi tercatat dengan benar
- [ ] Cek kadaluarsa sertifikat SSL/TLS
- [ ] Review consent management — pastikan opt-out diproses
- [ ] Validasi backup berjalan sesuai jadwal
- [ ] Review dan update daftar akses role/permission
- [ ] Cek kepatuhan terhadap kebijakan retensi data
- [ ] Review alert AML yang belum di-resolve

### 10.2 Checklist Triwulan

- [ ] Full reconciliation keuangan
- [ ] Review kebijakan privasi — update jika ada perubahan
- [ ] Penetration testing oleh pihak ketiga
- [ ] Review dan update dokumentasi compliance
- [ ] Training awareness keamanan untuk tim
- [ ] Evaluasi vendor/pihak ketiga (Data Processing Agreement)
- [ ] Self-assessment terhadap UU PDP
- [ ] Review incident log dan tindak lanjut

### 10.3 Checklist Tahunan

- [ ] Audit keuangan oleh KAP independen
- [ ] Review menyeluruh kebijakan keamanan dan privasi
- [ ] Sertifikasi ulang ISO 27001 (jika berlaku)
- [ ] Evaluasi kinerja Data Protection Officer
- [ ] Update Disaster Recovery Plan & uji coba
- [ ] Review kontrak dengan seluruh vendor
- [ ] Laporan tahunan compliance ke DKM dan yayasan
- [ ] Benchmarking terhadap best practice industri

---

## 11. Audit Pihak Ketiga

### 11.1 Jenis Audit Eksternal

| Jenis Audit | Frekuensi | Penyedia | Output |
|-------------|-----------|----------|--------|
| Audit Keuangan | Tahunan | Kantor Akuntan Publik (KAP) | Opini audit & laporan keuangan |
| Penetration Test | Triwulan | Perusahaan keamanan siber | Laporan kerentanan & rekomendasi |
| Compliance Audit | Tahunan | Konsultan hukum/compliance | Laporan kepatuhan regulasi |
| Privacy Impact Assessment | Per fitur baru | Konsultan privasi data | Risk assessment & mitigasi |
| IT Infrastructure Audit | Semester | Konsultan IT | Review arsitektur & keamanan |

### 11.2 Kriteria Pemilihan Auditor

1. Terdaftar dan memiliki izin resmi dari regulator terkait
2. Pengalaman minimal 5 tahun di bidang audit yang relevan
3. Independen dan tidak memiliki konflik kepentingan
4. Memiliki sertifikasi profesional (CPA, CISA, CISSP, dll.)
5. Bersedia menandatangani NDA dan DPA

### 11.3 Tindak Lanjut Temuan Audit

```
Prioritas Penanganan Temuan:

[Kritis]  → Perbaikan dalam 24 jam, eskalasi ke manajemen
[Tinggi]  → Perbaikan dalam 7 hari kerja
[Sedang]  → Perbaikan dalam 30 hari kerja
[Rendah]  → Masuk ke backlog, selesaikan dalam 90 hari
```

---

## 12. Jadwal Review Kepatuhan

### 12.1 Kalender Compliance Tahunan

| Bulan | Aktivitas | PIC |
|-------|-----------|-----|
| Januari | Kick-off compliance tahunan, review kebijakan | Compliance Officer |
| Februari | Training awareness keamanan Batch 1 | Security Team |
| Maret | Penetration testing Q1 | Vendor Keamanan |
| April | Review Q1, self-assessment | Compliance Officer |
| Mei | Training awareness keamanan Batch 2 | Security Team |
| Juni | Penetration testing Q2, mid-year review | Vendor Keamanan |
| Juli | Review Q2, update dokumentasi | Compliance Officer |
| Agustus | Disaster Recovery drill | IT Team |
| September | Penetration testing Q3 | Vendor Keamanan |
| Oktober | Review Q3, persiapan audit tahunan | Compliance Officer |
| November | Audit keuangan tahunan oleh KAP | KAP Independen |
| Desember | Laporan tahunan compliance, planning tahun depan | Compliance Officer |

### 12.2 Continuous Monitoring

Selain jadwal berkala, sistem menjalankan monitoring berkelanjutan:

- **Real-time**: Alert otomatis untuk anomali transaksi dan keamanan
- **Harian**: Report otomatis ringkasan aktivitas dan insiden
- **Mingguan**: Dashboard compliance untuk manajemen
- **Event-driven**: Review otomatis saat ada perubahan regulasi

---

## Kontak Compliance

| Peran | Email | Ketersediaan |
|-------|-------|-------------|
| Data Protection Officer | dpo@amanahmasjid.id | Jam kerja |
| Compliance Officer | compliance@amanahmasjid.id | Jam kerja |
| Incident Hotline | incident@amanahmasjid.id | 24/7 |
| Whistleblower Channel | whistleblower@amanahmasjid.id | 24/7 (anonim) |

---

> **⚠️ Catatan Penting:** Dokumen ini harus di-review dan diperbarui minimal setiap 6 bulan, atau segera setelah ada perubahan regulasi yang berlaku. Seluruh anggota tim wajib membaca dan memahami isi dokumen ini.

---

*Dokumen ini disusun oleh Tim Compliance Amanah Masjid dan telah disetujui oleh manajemen. Versi terbaru selalu tersedia di repository proyek.*
