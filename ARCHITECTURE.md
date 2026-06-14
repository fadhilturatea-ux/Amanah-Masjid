# 🏗️ Architecture Documentation — Amanah Masjid

> Dokumentasi arsitektur sistem platform Amanah Masjid secara menyeluruh.

---

## 1. System Overview

Amanah Masjid menggunakan arsitektur **modular monolith** yang dirancang untuk kemudahan development dan deployment, dengan kemampuan scale-out pada komponen tertentu.

### 1.1 High-Level Architecture

```
                        ┌─────────────────────┐
                        │    CDN (Cloudflare)  │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   Nginx Reverse     │
                        │   Proxy / LB        │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
   ┌──────────▼────────┐ ┌────────▼──────────┐ ┌──────▼────────┐
   │   Next.js App     │ │   API Server      │ │   AI Service  │
   │   (Frontend SSR)  │ │   (Fastify)       │ │   (Node.js)   │
   │   Port: 3000      │ │   Port: 4000      │ │   Port: 5000  │
   └──────────┬────────┘ └────────┬──────────┘ └──────┬────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
   ┌──────────▼────────┐ ┌────────▼──────────┐ ┌──────▼────────┐
   │   PostgreSQL      │ │   Redis           │ │   File Storage│
   │   (Primary DB)    │ │   (Cache/Queue)   │ │   (Cloudinary)│
   │   Port: 5432      │ │   Port: 6379      │ │               │
   └───────────────────┘ └───────────────────┘ └───────────────┘
```

### 1.2 Prinsip Arsitektur

| Prinsip | Implementasi |
|---------|-------------|
| **Separation of Concerns** | Frontend, Backend API, dan AI Service terpisah |
| **Single Responsibility** | Setiap service / module punya tanggung jawab tunggal |
| **DRY (Don't Repeat Yourself)** | Shared libraries untuk utility & validasi |
| **Security by Design** | Auth, encryption, dan validasi di setiap layer |
| **Scalability** | Horizontal scaling via Docker containers |
| **Observability** | Logging, monitoring, dan tracing terintegrasi |

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| State Management | Zustand | 4.x |
| Server State | TanStack Query | 5.x |
| Forms | React Hook Form + Zod | 7.x |
| Charts | Recharts | 2.x |
| Icons | Lucide React | Latest |

### 2.2 Struktur Folder Frontend

```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Dashboard layout (sidebar + header)
│   ├── page.tsx                # Dashboard home
│   ├── mosque/
│   │   ├── page.tsx            # Daftar masjid
│   │   └── [id]/page.tsx       # Detail masjid
│   ├── donations/
│   │   ├── page.tsx            # Daftar donasi
│   │   ├── new/page.tsx        # Form donasi baru
│   │   └── reports/page.tsx    # Laporan donasi
│   ├── programs/
│   │   ├── page.tsx            # Daftar program
│   │   └── [id]/page.tsx       # Detail program
│   ├── jamaah/
│   │   ├── page.tsx            # Daftar jamaah
│   │   └── [id]/page.tsx       # Profil jamaah
│   ├── ai/
│   │   ├── ocr/page.tsx        # OCR scan kuitansi
│   │   └── chatbot/page.tsx    # AI chatbot
│   └── settings/page.tsx       # Pengaturan
├── api/                        # API route handlers
├── layout.tsx                  # Root layout
└── page.tsx                    # Landing page
```

### 2.3 Component Architecture

```
Components/
├── ui/                 # Atomic components (Button, Input, Card, Modal, Badge)
├── forms/              # Form components (DonationForm, JamaahForm, ProgramForm)
├── layouts/            # Layout components (Sidebar, Header, Footer, PageWrapper)
├── features/           # Feature components
│   ├── dashboard/      # Dashboard widgets
│   ├── donations/      # Donation-specific components
│   ├── programs/       # Program-specific components
│   └── ai/             # AI feature components
└── shared/             # Shared components (DataTable, Pagination, SearchBar)
```

### 2.4 State Management

```
                    ┌─────────────────────┐
                    │   Server State      │
                    │   (TanStack Query)  │
                    │   - API data        │
                    │   - Caching         │
                    │   - Refetching      │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     ┌────────▼──────┐ ┌─────▼─────┐ ┌───────▼───────┐
     │ Global State  │ │ Form State│ │ UI State      │
     │ (Zustand)     │ │ (RHF)    │ │ (useState)    │
     │ - User auth   │ │ - Forms  │ │ - Modals      │
     │ - Theme       │ │ - Valid. │ │ - Toggles     │
     │ - Preferences │ │          │ │ - Local UI    │
     └───────────────┘ └──────────┘ └───────────────┘
```

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | 20.x LTS |
| Framework | Fastify | 4.x |
| ORM | Prisma | 5.x |
| Validation | Zod | 3.x |
| Auth | JWT (jsonwebtoken) | 9.x |
| Queue | BullMQ | 5.x |
| Logging | Pino | 8.x |
| Testing | Jest + Supertest | 29.x |

### 3.2 Layer Architecture

```
┌─────────────────────────────────────────────┐
│              Route / Controller Layer       │  ← HTTP request handling
├─────────────────────────────────────────────┤
│              Middleware Layer                │  ← Auth, validation, rate limit
├─────────────────────────────────────────────┤
│              Service Layer (Business Logic) │  ← Core business rules
├─────────────────────────────────────────────┤
│              Repository Layer (Data Access) │  ← Database queries (Prisma)
├─────────────────────────────────────────────┤
│              Database Layer                 │  ← PostgreSQL + Redis
└─────────────────────────────────────────────┘
```

### 3.3 Middleware Pipeline

```
Request → Rate Limiter → CORS → Auth → Permission → Validation → Controller → Response
```

| Middleware | Fungsi |
|-----------|--------|
| `rateLimiter` | Membatasi 100 req/menit per IP |
| `cors` | Cross-Origin Resource Sharing |
| `authenticate` | Validasi JWT access token |
| `authorize` | Cek role & permission user |
| `validate` | Validasi request body (Zod) |
| `errorHandler` | Centralized error handling |

### 3.4 API Response Format

```json
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nominal donasi harus lebih dari 0",
    "details": [...]
  }
}
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram (ERD)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users      │────<│ user_mosques │>────│   mosques    │
│──────────────│     │──────────────│     │──────────────│
│ id           │     │ user_id      │     │ id           │
│ email        │     │ mosque_id    │     │ name         │
│ password     │     │ role         │     │ address      │
│ name         │     │ joined_at    │     │ city         │
│ phone        │     └──────────────┘     │ province     │
│ avatar       │                          │ latitude     │
│ is_verified  │     ┌──────────────┐     │ longitude    │
│ created_at   │     │  donations   │     │ created_at   │
└──────┬───────┘     │──────────────│     └──────┬───────┘
       │             │ id           │            │
       └────────────>│ user_id      │<───────────┘
                     │ mosque_id    │
                     │ amount       │     ┌──────────────┐
                     │ type         │     │  programs    │
                     │ status       │     │──────────────│
                     │ receipt_url  │     │ id           │
                     │ verified_by  │     │ mosque_id    │
                     │ verified_at  │     │ title        │
                     │ risk_score   │     │ description  │
                     │ created_at   │     │ target_amount│
                     └──────────────┘     │ current_amt  │
                                          │ status       │
                     ┌──────────────┐     │ start_date   │
                     │   jamaah     │     │ end_date     │
                     │──────────────│     │ created_at   │
                     │ id           │     └──────────────┘
                     │ user_id      │
                     │ mosque_id    │     ┌──────────────┐
                     │ nik          │     │ audit_logs   │
                     │ address      │     │──────────────│
                     │ birth_date   │     │ id           │
                     │ gender       │     │ user_id      │
                     │ occupation   │     │ action       │
                     │ is_active    │     │ entity_type  │
                     │ joined_at    │     │ entity_id    │
                     └──────────────┘     │ changes      │
                                          │ ip_address   │
                                          │ created_at   │
                                          └──────────────┘
```

### 4.2 Tabel Utama

| Tabel | Deskripsi | Estimasi Rows |
|-------|-----------|---------------|
| `users` | Data pengguna platform | ~100K |
| `mosques` | Data masjid terdaftar | ~5K |
| `user_mosques` | Relasi user-masjid dengan role | ~200K |
| `donations` | Transaksi donasi | ~1M |
| `programs` | Program sosial/keagamaan | ~10K |
| `program_registrations` | Peserta program | ~50K |
| `jamaah` | Data jamaah masjid | ~200K |
| `notifications` | Notifikasi user | ~2M |
| `audit_logs` | Log audit semua aktivitas | ~5M |
| `chat_messages` | Log chatbot AI | ~500K |
| `whatsapp_messages` | Log WhatsApp Bot | ~1M |

### 4.3 Indexing Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_donations_mosque_date ON donations(mosque_id, created_at DESC);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_jamaah_mosque ON jamaah(mosque_id);
CREATE INDEX idx_programs_mosque_status ON programs(mosque_id, status);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

---

## 5. Caching Layer (Redis)

### 5.1 Caching Strategy

| Key Pattern | TTL | Deskripsi |
|-------------|-----|-----------|
| `mosque:{id}` | 1 jam | Detail masjid |
| `mosque:{id}:stats` | 5 menit | Statistik donasi masjid |
| `prayer:{city}:{date}` | 24 jam | Jadwal sholat per kota |
| `user:{id}:session` | 7 hari | Session user |
| `rate:{ip}` | 1 menit | Rate limiting counter |
| `otp:{phone}` | 5 menit | OTP verifikasi |

### 5.2 Redis Penggunaan

```
Redis Usage:
├── Caching          → Query results, API responses
├── Session Store    → JWT refresh tokens, user sessions  
├── Rate Limiting    → Request counter per IP
├── Message Queue    → BullMQ job queue
├── Pub/Sub          → Real-time notifications
└── Temporary Data   → OTP, email verification tokens
```

---

## 6. AI/ML Services Architecture

```
┌─────────────────────────────────────┐
│         AI Service (Port 5000)      │
├─────────────────────────────────────┤
│  ┌───────────┐  ┌───────────────┐  │
│  │ OCR       │  │ Chatbot       │  │
│  │ Controller│  │ Controller    │  │
│  └─────┬─────┘  └───────┬───────┘  │
│        │                │          │
│  ┌─────▼─────┐  ┌───────▼───────┐  │
│  │ OCR       │  │ NLP           │  │
│  │ Service   │  │ Service       │  │
│  │ (Tesseract│  │ (OpenAI API)  │  │
│  └───────────┘  └───────────────┘  │
│                                    │
│  ┌───────────┐  ┌───────────────┐  │
│  │ Fraud     │  │ WhatsApp      │  │
│  │ Detection │  │ Bot Service   │  │
│  │ (TF.js)  │  │               │  │
│  └───────────┘  └───────────────┘  │
├─────────────────────────────────────┤
│         Model Registry              │
│  (Versioned models + metadata)      │
└─────────────────────────────────────┘
```

---

## 7. Message Queue (Background Jobs)

### 7.1 Queue Architecture (BullMQ)

| Queue | Priority | Deskripsi |
|-------|----------|-----------|
| `email` | Normal | Pengiriman email notifikasi |
| `whatsapp` | High | Pengiriman pesan WhatsApp |
| `ocr-processing` | Normal | Pemrosesan OCR kuitansi |
| `report-generation` | Low | Generate laporan keuangan |
| `notification` | High | Push notification |
| `data-sync` | Low | Sinkronisasi data analytics |
| `cleanup` | Low | Pembersihan data expired |

### 7.2 Job Retry Policy

```javascript
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000  // 1s, 2s, 4s
  },
  removeOnComplete: { count: 1000 },
  removeOnFail: { count: 5000 }
};
```

---

## 8. Third-Party Integrations

| Service | Provider | Fungsi |
|---------|----------|--------|
| Payment Gateway | Midtrans | Pembayaran donasi online |
| WhatsApp API | Meta (Cloud API) | Messaging bot |
| Cloud Storage | Cloudinary | Image upload & optimization |
| Push Notification | Firebase (FCM) | Mobile & web push |
| Maps | Google Maps API | Lokasi masjid |
| Email | SendGrid | Transactional email |
| SMS | Twilio | OTP & notifikasi SMS |
| Monitoring | Grafana + Prometheus | Observability |
| Error Tracking | Sentry | Error monitoring |
| Analytics | Mixpanel | User behavior analytics |

---

## 9. Deployment Architecture

### 9.1 Docker Compose (Development)

```yaml
version: '3.9'
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [postgres, redis]
    
  api:
    build: ./api
    ports: ["4000:4000"]
    depends_on: [postgres, redis]
    
  ai-service:
    build: ./ai
    ports: ["5000:5000"]
    
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
    volumes: [postgres-data:/var/lib/postgresql/data]
    
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    depends_on: [app, api]

volumes:
  postgres-data:
```

### 9.2 CI/CD Pipeline (GitHub Actions)

```
Push to main → Lint & Test → Build → Docker Image → Deploy to Staging → E2E Tests → Deploy to Production
```

### 9.3 Production Infrastructure

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   CDN + WAF     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Load Balancer │
                    │   (Nginx)       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐ ┌────▼────┐ ┌───────▼──────┐
     │  App Node 1   │ │ Node 2  │ │   Node 3     │
     │  (Docker)     │ │(Docker) │ │  (Docker)    │
     └───────────────┘ └─────────┘ └──────────────┘
              │              │              │
     ┌────────▼──────────────▼──────────────▼──────┐
     │        PostgreSQL (Primary + Replica)        │
     │        Redis Cluster                         │
     └─────────────────────────────────────────────┘
```

---

## 10. Scalability Considerations

| Aspek | Strategi |
|-------|----------|
| **Horizontal Scaling** | Docker containers behind load balancer |
| **Database Scaling** | Read replicas, connection pooling (PgBouncer) |
| **Caching** | Redis cluster dengan multi-layer caching |
| **CDN** | Cloudflare untuk static assets dan edge caching |
| **Queue** | BullMQ dengan dedicated workers |
| **File Storage** | Cloudinary CDN untuk gambar |
| **API Rate Limiting** | Per-user dan per-IP throttling |
| **Database Optimization** | Proper indexing, query optimization, partitioning |

### 10.1 Performance Targets

| Metrik | Target |
|--------|--------|
| Page Load Time (LCP) | < 2.5 detik |
| API Response Time (P95) | < 200ms |
| Database Query Time (P95) | < 50ms |
| Concurrent Users | 10.000+ |
| Uptime SLA | 99.9% |

---

<p align="center">
  <strong>Amanah Masjid Architecture Documentation</strong> — v1.0.0
  <br>
  Last updated: Juni 2026
</p>
