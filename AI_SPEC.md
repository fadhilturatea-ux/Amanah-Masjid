# 🤖 AI Specification — Amanah Masjid

> Spesifikasi lengkap integrasi AI, OCR, WhatsApp Bot, dan layanan cerdas pada platform Amanah Masjid.

---

## 1. Arsitektur AI Overview

Platform Amanah Masjid mengintegrasikan beberapa modul AI/ML untuk meningkatkan efisiensi pengelolaan masjid:

```
┌─────────────────────────────────────────────────────────┐
│                    AI Service Layer                      │
├──────────┬──────────┬──────────────┬─────────────────────┤
│  OCR     │ Chatbot  │ WhatsApp Bot │ Fraud Detection     │
│  Module  │ AI       │              │                     │
├──────────┴──────────┴──────────────┴─────────────────────┤
│                  NLP Processing Engine                    │
├──────────────────────────────────────────────────────────┤
│              Data Pipeline & Model Registry               │
├──────────────────────────────────────────────────────────┤
│         PostgreSQL  │  Redis Cache  │  File Storage       │
└─────────────────────┴───────────────┴─────────────────────┘
```

### Komponen Utama

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| OCR Engine | Tesseract.js + Custom Model | Scan dan ekstraksi data kuitansi donasi |
| AI Chatbot | OpenAI GPT-4o API | Asisten virtual untuk jamaah |
| WhatsApp Bot | WhatsApp Business API + NLP | Bot interaktif untuk messaging |
| Fraud Detection | TensorFlow.js | Deteksi anomali transaksi donasi |
| NLP Engine | OpenAI + Custom Intents | Pemahaman bahasa natural |

---

## 2. Modul OCR (Optical Character Recognition)

### 2.1 Overview

Modul OCR dirancang untuk memproses foto kuitansi donasi yang diunggah jamaah, mengekstraksi data relevan, dan secara otomatis mencatat informasi donasi ke dalam sistem.

### 2.2 Alur Proses OCR

```
Foto Kuitansi → Preprocessing → OCR Engine → Post-processing → Data Extraction → Validasi → Database
```

**Detail langkah:**

1. **Input Image**: Jamaah mengunggah foto kuitansi (JPG, PNG, HEIC, PDF)
2. **Preprocessing**: 
   - Resize & normalisasi resolusi
   - Konversi ke grayscale
   - Noise reduction (Gaussian blur)
   - Thresholding (Otsu's method)
   - Deskewing (koreksi kemiringan)
3. **OCR Engine**: Tesseract.js memproses gambar menjadi teks
4. **Post-processing**: 
   - Koreksi typo umum
   - Normalisasi format tanggal
   - Parsing nominal uang
5. **Data Extraction**: Regex pattern matching untuk:
   - Nama bank / platform
   - Nomor referensi / transaksi
   - Tanggal & waktu transfer
   - Nominal donasi
   - Nama pengirim
   - Nama penerima
6. **Validasi**: Cross-check dengan data masjid
7. **Penyimpanan**: Insert ke tabel `donations`

### 2.3 Format yang Didukung

| Format | Ekstensi | Maks. Ukuran |
|--------|----------|--------------|
| JPEG | .jpg, .jpeg | 10 MB |
| PNG | .png | 10 MB |
| HEIC | .heic | 10 MB |
| PDF | .pdf | 15 MB |
| WebP | .webp | 10 MB |

### 2.4 API Endpoint

```http
POST /api/ai/ocr/scan
Content-Type: multipart/form-data

# Request
{
  "image": <file>,
  "mosqueId": "uuid-masjid",
  "donationType": "infaq" | "zakat" | "sedekah" | "wakaf"
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "bankName": "BCA",
    "referenceNo": "1234567890",
    "date": "2026-06-01T10:30:00Z",
    "amount": 250000,
    "senderName": "Ahmad Fauzi",
    "receiverName": "Masjid Al-Ikhlas",
    "confidence": 0.94,
    "rawText": "..."
  }
}
```

### 2.5 Akurasi & Performance

| Metrik | Target | Aktual |
|--------|--------|--------|
| Akurasi ekstraksi nominal | > 95% | 96.2% |
| Akurasi ekstraksi tanggal | > 90% | 92.8% |
| Akurasi nama pengirim | > 85% | 88.5% |
| Waktu proses rata-rata | < 5 detik | 3.2 detik |
| False positive rate | < 5% | 3.1% |

---

## 3. WhatsApp Bot

### 3.1 Overview

WhatsApp Bot Amanah Masjid berfungsi sebagai asisten virtual yang dapat diakses melalui WhatsApp. Bot ini mampu menerima donasi, menjawab pertanyaan, mengirim pengumuman, dan memberikan informasi jadwal sholat.

### 3.2 Daftar Perintah (Commands)

| Perintah | Alias | Deskripsi |
|----------|-------|-----------|
| `/jadwal` | `/sholat` | Menampilkan jadwal sholat hari ini |
| `/donasi` | `/infaq`, `/sedekah` | Memulai proses donasi |
| `/saldo` | `/laporan` | Melihat saldo donasi masjid |
| `/program` | `/kegiatan` | Daftar program masjid aktif |
| `/daftar` | `/register` | Mendaftar sebagai jamaah |
| `/info` | `/tentang` | Informasi masjid |
| `/bantuan` | `/help` | Menampilkan daftar perintah |
| `/kajian` | `/pengajian` | Jadwal kajian dan pengajian |
| `/zakat` | — | Kalkulator zakat |
| `/feedback` | `/saran` | Kirim saran ke pengurus masjid |

### 3.3 Conversation Flow — Donasi

```
User: /donasi
Bot: Assalamu'alaikum! 🤲
     Silakan pilih jenis donasi:
     1️⃣ Infaq
     2️⃣ Zakat
     3️⃣ Sedekah
     4️⃣ Wakaf

User: 1
Bot: Berapa nominal infaq yang ingin Anda salurkan?
     Contoh: 100000

User: 250000
Bot: Konfirmasi donasi:
     📌 Jenis: Infaq
     💰 Nominal: Rp 250.000
     🕌 Tujuan: Masjid Al-Ikhlas

     Apakah sudah benar? (Ya/Tidak)

User: Ya
Bot: ✅ Terima kasih! Silakan transfer ke:
     🏦 Bank BCA
     📝 No. Rek: 123-456-7890
     👤 a.n. Masjid Al-Ikhlas

     Setelah transfer, kirim bukti kuitansi 
     ke chat ini untuk verifikasi otomatis.
     
     Jazakallahu khairan! 🤲
```

### 3.4 NLP Intent Recognition

Bot menggunakan NLP untuk mengenali intent (maksud) dari pesan yang dikirim user:

| Intent | Contoh Pesan | Aksi |
|--------|-------------|------|
| `greeting` | "Assalamu'alaikum", "Halo" | Balas salam |
| `ask_prayer_time` | "Jam berapa sholat Maghrib?" | Kirim jadwal sholat |
| `want_donate` | "Saya mau infaq" | Mulai flow donasi |
| `ask_program` | "Ada program apa?" | Kirim daftar program |
| `ask_info` | "Alamat masjid dimana?" | Kirim info masjid |
| `complaint` | "AC masjid rusak" | Forward ke admin |
| `register` | "Saya mau daftar jamaah" | Mulai flow registrasi |
| `calculate_zakat` | "Berapa zakat penghasilan saya?" | Mulai kalkulator zakat |

### 3.5 Auto-Reply Rules

| Trigger | Waktu | Pesan |
|---------|-------|-------|
| Adzan Subuh | 04:30 WIB | "🌅 Waktu Subuh telah tiba. Hayya 'alash sholah!" |
| Adzan Dzuhur | 12:00 WIB | "☀️ Waktu Dzuhur telah tiba." |
| Adzan Ashar | 15:15 WIB | "🌤️ Waktu Ashar telah tiba." |
| Adzan Maghrib | 18:00 WIB | "🌅 Waktu Maghrib telah tiba." |
| Adzan Isya | 19:15 WIB | "🌙 Waktu Isya telah tiba." |
| Jumat pagi | Jumat 07:00 | "🕌 Selamat hari Jumat! Jangan lupa sholat Jumat." |
| Reminder kajian | H-1 19:00 | "📚 Reminder: Kajian besok pukul [waktu]" |

---

## 4. AI Assistant (Chatbot)

### 4.1 Overview

AI Assistant adalah chatbot cerdas berbasis GPT-4o yang dapat menjawab berbagai pertanyaan jamaah seputar Islam, informasi masjid, jadwal kegiatan, dan panduan ibadah.

### 4.2 Kapabilitas

- **Tanya Jawab Islam**: Menjawab pertanyaan fiqih, hadits, dan tafsir
- **Info Masjid**: Jadwal kegiatan, pengumuman, kontak pengurus
- **Jadwal Sholat**: Waktu sholat berdasarkan lokasi
- **Panduan Ibadah**: Tata cara sholat, puasa, haji, dll.
- **Kalkulator Zakat**: Menghitung zakat maal, penghasilan, fitrah
- **Konsultasi**: Meneruskan ke ustadz untuk pertanyaan kompleks

### 4.3 System Prompt

```
Anda adalah asisten virtual Masjid [nama_masjid]. Tugas Anda:
1. Menjawab pertanyaan jamaah dengan sopan dan sesuai ajaran Islam
2. Memberikan informasi akurat tentang masjid
3. Membantu proses donasi dan registrasi
4. Merujuk ke ustadz untuk pertanyaan yang membutuhkan fatwa
5. Selalu menyertakan referensi dari Al-Quran dan Hadits jika relevan
6. Menggunakan bahasa Indonesia yang baik dan santun
7. Menyapa dengan salam Islam

PENTING: Jangan memberikan fatwa sendiri untuk masalah khilafiyah.
Arahkan ke ustadz atau MUI untuk hal-hal yang memerlukan ijtihad.
```

### 4.4 API Endpoint

```http
POST /api/ai/chat
Content-Type: application/json

# Request
{
  "message": "Bagaimana cara menghitung zakat penghasilan?",
  "mosqueId": "uuid-masjid",
  "userId": "uuid-user",
  "conversationId": "uuid-conversation"
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "reply": "Zakat penghasilan dihitung sebesar 2.5% dari penghasilan bruto...",
    "references": [
      { "source": "QS. Al-Baqarah: 267", "text": "..." }
    ],
    "suggestedActions": ["kalkulator_zakat", "konsultasi_ustadz"],
    "confidence": 0.92
  }
}
```

---

## 5. Donation Intelligence (Fraud Detection)

### 5.1 Overview

Sistem Donation Intelligence menggunakan machine learning untuk mendeteksi anomali pada transaksi donasi, mengidentifikasi pola mencurigakan, dan memberikan rekomendasi untuk meningkatkan pengelolaan donasi.

### 5.2 Fitur Deteksi

| Fitur | Deskripsi | Threshold |
|-------|-----------|-----------|
| Anomali Nominal | Donasi dengan nominal tidak wajar | > 3 std deviasi dari rata-rata |
| Frekuensi Tinggi | Donasi berulang dalam waktu singkat | > 5x dalam 1 jam |
| Pola Jam | Donasi pada jam tidak wajar | 00:00 - 04:00 WIB |
| Duplikasi | Kuitansi yang sudah pernah digunakan | Hash matching |
| Spoofing | Kuitansi palsu / manipulasi | Confidence < 0.6 |

### 5.3 Scoring Model

```
Risk Score = w1 × AnomalyScore + w2 × FrequencyScore + w3 × TimeScore + w4 × DuplicateScore

Dimana:
- Risk Score: 0.0 (aman) — 1.0 (sangat mencurigakan)
- Threshold alert: > 0.7
- Threshold block: > 0.9
```

### 5.4 Aksi Berdasarkan Risk Score

| Range | Level | Aksi |
|-------|-------|------|
| 0.0 - 0.3 | 🟢 Rendah | Otomatis diterima |
| 0.3 - 0.5 | 🟡 Sedang | Diterima, ditandai untuk review |
| 0.5 - 0.7 | 🟠 Tinggi | Memerlukan verifikasi manual |
| 0.7 - 0.9 | 🔴 Sangat Tinggi | Ditahan, notifikasi ke admin |
| 0.9 - 1.0 | ⛔ Kritis | Otomatis ditolak, alert security |

---

## 6. Data Pipeline

### 6.1 Alur Data

```
Collection → Ingestion → Preprocessing → Feature Engineering → Training → Inference → Monitoring
```

### 6.2 Detail Pipeline

| Tahap | Tools | Frekuensi |
|-------|-------|-----------|
| Data Collection | API logs, user events | Real-time |
| Data Ingestion | Bull MQ workers | Real-time |
| Preprocessing | Custom scripts | Daily batch |
| Feature Engineering | TensorFlow.js | Weekly |
| Model Training | TensorFlow.js | Monthly |
| Inference | REST API | Real-time |
| Monitoring | Custom dashboard | Continuous |

### 6.3 Data yang Dikumpulkan

- Riwayat transaksi donasi (nominal, waktu, metode)
- Pola penggunaan chatbot (pertanyaan, frekuensi)
- Data OCR (akurasi per bank, error patterns)
- WhatsApp interactions (commands, response time)

---

## 7. Model Versioning & Deployment

### 7.1 Versioning

```
Model naming: {module}_{version}_{date}
Contoh: ocr_v2.1.0_20260601
        fraud_v1.3.0_20260601
```

### 7.2 Deployment Strategy

| Strategi | Deskripsi |
|----------|-----------|
| Blue-Green | Deploy versi baru parallel, switch traffic |
| Canary | 10% traffic ke versi baru, monitor, lalu scale up |
| A/B Testing | Bandingkan performa 2 model secara bersamaan |

### 7.3 Rollback Procedure

1. Monitor metrik setelah deployment
2. Jika akurasi < threshold → auto rollback
3. Rollback time target: < 5 menit
4. Notifikasi otomatis ke tim AI

---

## 8. Performance Metrics & Monitoring

### 8.1 SLA (Service Level Agreement)

| Metrik | Target |
|--------|--------|
| OCR Response Time | < 5 detik (P95) |
| Chatbot Response Time | < 3 detik (P95) |
| WhatsApp Bot Response | < 2 detik (P95) |
| Fraud Detection | < 1 detik (P95) |
| AI Service Uptime | > 99.5% |

### 8.2 Dashboard Monitoring

- **Grafana**: Visualisasi metrik real-time
- **Prometheus**: Pengumpulan metrik
- **PagerDuty**: Alerting untuk degradasi performa
- **Custom Dashboard**: Akurasi model per waktu

### 8.3 Alert Rules

| Kondisi | Severity | Notifikasi |
|---------|----------|------------|
| OCR accuracy < 90% | Warning | Slack + Email |
| Response time > 10s | Critical | PagerDuty |
| Error rate > 5% | Critical | PagerDuty + SMS |
| Model drift detected | Warning | Email |

---

<p align="center">
  <strong>Amanah Masjid AI Specification</strong> — v1.0.0
  <br>
  Last updated: Juni 2026
</p>
