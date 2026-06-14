# 🛠️ DEV GUIDE — Amanah Masjid

> Panduan Pengembangan Lengkap untuk Developer Platform Amanah Masjid

**Versi:** 2.0.0  
**Terakhir Diperbarui:** 1 Juni 2026  
**Penanggung Jawab:** Tim Engineering — Amanah Masjid  
**Status:** ✅ Aktif & Berlaku

---

## Daftar Isi

1. [Development Environment Setup](#1-development-environment-setup)
2. [Struktur Proyek & Konvensi Folder](#2-struktur-proyek--konvensi-folder)
3. [Coding Standards](#3-coding-standards)
4. [Git Workflow](#4-git-workflow)
5. [Database Migrations](#5-database-migrations)
6. [API Development](#6-api-development)
7. [Testing](#7-testing)
8. [Environment Variables & Konfigurasi](#8-environment-variables--konfigurasi)
9. [Logging & Debugging](#9-logging--debugging)
10. [Performance Optimization](#10-performance-optimization)
11. [Deployment](#11-deployment)
12. [CI/CD Pipeline](#12-cicd-pipeline)
13. [Monitoring & Alerting](#13-monitoring--alerting)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Development Environment Setup

### 1.1 Prerequisites

Pastikan tools berikut sudah terinstall di mesin pengembangan:

| Tool | Versi Minimum | Tujuan |
|------|---------------|--------|
| **Node.js** | v20.x LTS | Runtime JavaScript |
| **npm** | v10.x | Package manager |
| **PostgreSQL** | v16.x | Database utama |
| **Redis** | v7.x | Caching & session store |
| **Docker** | v24.x | Containerization |
| **Docker Compose** | v2.x | Multi-container orchestration |
| **Git** | v2.40+ | Version control |
| **VS Code** | Latest | IDE (recommended) |

### 1.2 Instalasi & Setup Awal

```bash
# 1. Clone repository
git clone https://github.com/amanah-masjid/platform.git
cd platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local sesuai konfigurasi lokal Anda

# 4. Jalankan database menggunakan Docker
docker compose up -d postgres redis

# 5. Jalankan migrasi database
npm run db:migrate

# 6. Seed data awal (opsional, untuk development)
npm run db:seed

# 7. Jalankan development server
npm run dev
```

### 1.3 Setup Docker (Full Stack)

```yaml
# docker-compose.yml (development)
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: amanah_masjid_dev
      POSTGRES_USER: amanah_dev
      POSTGRES_PASSWORD: dev_password_123
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass redis_dev_123

volumes:
  pgdata:
```

### 1.4 Ekstensi VS Code yang Direkomendasikan

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "humao.rest-client",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 2. Struktur Proyek & Konvensi Folder

### 2.1 Struktur Utama

```
amanah-masjid/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router pages
│   │   ├── 📁 (auth)/             # Route group: autentikasi
│   │   ├── 📁 (dashboard)/        # Route group: dashboard
│   │   ├── 📁 api/                # API routes
│   │   │   ├── 📁 v1/             # API versioning
│   │   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 donations/
│   │   │   │   ├── 📁 mosques/
│   │   │   │   ├── 📁 programs/
│   │   │   │   └── 📁 users/
│   │   │   └── 📁 webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 ui/                 # Primitif (Button, Input, Card)
│   │   ├── 📁 forms/              # Form components
│   │   ├── 📁 layouts/            # Layout components
│   │   └── 📁 features/           # Feature-specific components
│   │       ├── 📁 donations/
│   │       ├── 📁 mosque/
│   │       ├── 📁 programs/
│   │       └── 📁 ai-services/
│   ├── 📁 lib/                    # Utilities & helpers
│   │   ├── 📁 db/                 # Database client & queries
│   │   ├── 📁 auth/               # Auth utilities
│   │   ├── 📁 validators/         # Zod schemas
│   │   ├── 📁 services/           # Business logic
│   │   └── 📁 utils/              # General utilities
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 types/                  # TypeScript type definitions
│   ├── 📁 styles/                 # Global styles
│   └── 📁 constants/              # App constants & enums
├── 📁 prisma/
│   ├── 📁 migrations/             # Database migrations
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed data
├── 📁 tests/
│   ├── 📁 unit/                   # Unit tests
│   ├── 📁 integration/            # Integration tests
│   ├── 📁 e2e/                    # End-to-end tests (Cypress)
│   └── 📁 fixtures/               # Test fixtures & mocks
├── 📁 docs/                       # Dokumentasi tambahan
├── 📁 scripts/                    # Build & deployment scripts
├── 📁 .github/
│   └── 📁 workflows/             # GitHub Actions CI/CD
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### 2.2 Konvensi Penamaan File

| Jenis File | Konvensi | Contoh |
|------------|----------|--------|
| Komponen React | PascalCase | `DonationCard.tsx` |
| Hook | camelCase dengan prefix `use` | `useDonation.ts` |
| Utility/Helper | camelCase | `formatCurrency.ts` |
| Type/Interface | PascalCase | `DonationTypes.ts` |
| Constant | UPPER_SNAKE_CASE (isi), camelCase (file) | `apiEndpoints.ts` |
| API Route | kebab-case (folder) | `api/v1/donation-history/` |
| Test | sama + `.test` suffix | `DonationCard.test.tsx` |
| Style | sama + `.module` suffix | `DonationCard.module.css` |

---

## 3. Coding Standards

### 3.1 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    
    // Import ordering
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    }],
    
    // React
    'react/jsx-no-leaked-render': 'error',
    'react/self-closing-comp': 'error',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

### 3.2 Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "importOrder": [
    "^react",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

### 3.3 Konvensi Penamaan

```typescript
// ✅ Variables & Functions: camelCase
const donationAmount = 500000;
function calculateZakat(income: number): number { ... }

// ✅ Classes & Components: PascalCase
class DonationService { ... }
function DonationCard({ donation }: DonationCardProps) { ... }

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Types & Interfaces: PascalCase dengan prefix
interface IDonation { ... }
type DonationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

// ✅ Enum: PascalCase nama, UPPER_SNAKE_CASE values
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_MASJID = 'ADMIN_MASJID',
  BENDAHARA = 'BENDAHARA',
  JAMAAH = 'JAMAAH',
}

// ✅ Database columns: snake_case (via Prisma mapping)
// ✅ API endpoints: kebab-case
// ✅ Environment variables: UPPER_SNAKE_CASE
```

---

## 4. Git Workflow

### 4.1 Branching Strategy (GitFlow)

```
main (production)
├── develop (staging / integration)
│   ├── feature/donation-receipt-upload
│   ├── feature/ai-chatbot-integration
│   ├── feature/mosque-dashboard-redesign
│   ├── bugfix/payment-calculation-error
│   └── improvement/query-optimization
├── release/v2.1.0
│   └── hotfix/critical-auth-bypass
└── hotfix/emergency-data-fix
```

| Branch | Tujuan | Merge Target | Naming |
|--------|--------|-------------|--------|
| `main` | Production release | — | `main` |
| `develop` | Integration & staging | `main` (via release) | `develop` |
| `feature/*` | Fitur baru | `develop` | `feature/deskripsi-singkat` |
| `bugfix/*` | Perbaikan bug | `develop` | `bugfix/deskripsi-bug` |
| `hotfix/*` | Perbaikan kritis production | `main` + `develop` | `hotfix/deskripsi-fix` |
| `release/*` | Persiapan release | `main` + `develop` | `release/vX.Y.Z` |

### 4.2 Commit Conventions (Conventional Commits)

```
Format: <type>(<scope>): <description>

Types:
├── feat     : Fitur baru
├── fix      : Perbaikan bug
├── docs     : Perubahan dokumentasi
├── style    : Formatting, semicolon, dll (bukan CSS)
├── refactor : Refactoring kode
├── perf     : Peningkatan performa
├── test     : Penambahan/perbaikan test
├── build    : Perubahan build system
├── ci       : Perubahan CI/CD config
├── chore    : Maintenance tasks
└── revert   : Revert commit sebelumnya

Contoh:
  feat(donation): tambah fitur upload bukti transfer
  fix(auth): perbaiki JWT refresh token race condition
  docs(api): update dokumentasi endpoint donasi
  perf(query): optimasi query laporan keuangan bulanan
  test(donation): tambah unit test untuk kalkulasi zakat
```

### 4.3 Pull Request Process

```
1. Buat branch dari `develop`:
   git checkout develop
   git pull origin develop
   git checkout -b feature/nama-fitur

2. Kerjakan perubahan & commit secara atomik

3. Push dan buat Pull Request:
   git push -u origin feature/nama-fitur

4. PR Requirements:
   ├── ✅ Deskripsi jelas tentang perubahan
   ├── ✅ Screenshot/video untuk perubahan UI
   ├── ✅ Unit test untuk logika baru
   ├── ✅ Semua CI checks pass (lint, test, build)
   ├── ✅ Minimal 2 reviewer approval
   ├── ✅ No merge conflicts
   └── ✅ Branch up-to-date dengan develop

5. Merge menggunakan "Squash and Merge"

6. Hapus branch setelah merge
```

### 4.4 Template Pull Request

```markdown
## Deskripsi
[Jelaskan perubahan yang dilakukan]

## Jenis Perubahan
- [ ] Fitur baru (feat)
- [ ] Perbaikan bug (fix)
- [ ] Refactoring (refactor)
- [ ] Dokumentasi (docs)
- [ ] Lainnya: ___

## Checklist
- [ ] Kode mengikuti coding standards
- [ ] Unit test ditambahkan/diupdate
- [ ] Dokumentasi diupdate (jika perlu)
- [ ] Tidak ada console.log tersisa
- [ ] Tested secara lokal
- [ ] Migration script dibuat (jika perlu)

## Screenshots (jika ada)
[Paste screenshots di sini]

## Related Issues
Closes #[nomor issue]
```

---

## 5. Database Migrations

### 5.1 Tools

Proyek ini menggunakan **Prisma ORM** untuk mengelola database schema dan migrasi.

### 5.2 Perintah Dasar

```bash
# Buat migrasi baru dari perubahan schema
npx prisma migrate dev --name deskripsi_perubahan

# Jalankan migrasi di production
npx prisma migrate deploy

# Reset database (HANYA untuk development!)
npx prisma migrate reset

# Generate Prisma Client setelah perubahan schema
npx prisma generate

# Buka Prisma Studio untuk inspect database
npx prisma studio
```

### 5.3 Konvensi Penamaan Migrasi

```
Format: YYYYMMDDHHMMSS_deskripsi_singkat

Contoh:
├── 20260101120000_init_schema
├── 20260115093000_add_donation_receipt_table
├── 20260201140000_add_mosque_social_programs
├── 20260215110000_add_user_kyc_fields
└── 20260301083000_add_ai_chat_history
```

### 5.4 Prosedur Rollback

```bash
# Lihat status migrasi
npx prisma migrate status

# Rollback migrasi terakhir (development only)
npx prisma migrate reset --to 20260215110000_add_user_kyc_fields

# Untuk production: buat migrasi baru yang me-reverse perubahan
# JANGAN PERNAH gunakan `migrate reset` di production!
```

### 5.5 Best Practices Migrasi

1. **Satu migrasi per perubahan logis** — jangan gabung perubahan yang tidak terkait
2. **Test migrasi** sebelum merge — jalankan `migrate reset` untuk pastikan clean
3. **Backward compatible** — migrasi harus bisa dijalankan tanpa downtime jika memungkinkan
4. **Jangan edit migrasi yang sudah di-deploy** — buat migrasi baru untuk koreksi
5. **Backup database** sebelum menjalankan migrasi di production

---

## 6. API Development

### 6.1 RESTful Conventions

```
Base URL: /api/v1

HTTP Methods:
├── GET     → Mengambil data (idempotent, safe)
├── POST    → Membuat data baru
├── PUT     → Update penuh (replace)
├── PATCH   → Update parsial
└── DELETE  → Menghapus data

Contoh Endpoints:
├── GET    /api/v1/donations              → List donasi
├── GET    /api/v1/donations/:id          → Detail donasi
├── POST   /api/v1/donations              → Buat donasi baru
├── PATCH  /api/v1/donations/:id          → Update donasi
├── DELETE /api/v1/donations/:id          → Hapus donasi
├── GET    /api/v1/donations/:id/receipt  → Ambil bukti donasi
└── POST   /api/v1/donations/:id/verify   → Verifikasi donasi
```

### 6.2 Response Format (Standar)

```typescript
// Response sukses (single item)
{
  "success": true,
  "data": {
    "id": "don_abc123",
    "amount": 500000,
    "status": "VERIFIED",
    "created_at": "2026-06-01T10:00:00.000Z"
  },
  "meta": {
    "request_id": "req_xyz789",
    "timestamp": "2026-06-01T10:00:01.000Z"
  }
}

// Response sukses (list/pagination)
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_items": 150,
    "total_pages": 8
  },
  "meta": {
    "request_id": "req_xyz789",
    "timestamp": "2026-06-01T10:00:01.000Z"
  }
}

// Response error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid",
    "details": [
      {
        "field": "amount",
        "message": "Nominal donasi harus lebih dari 0"
      }
    ]
  },
  "meta": {
    "request_id": "req_xyz789",
    "timestamp": "2026-06-01T10:00:01.000Z"
  }
}
```

### 6.3 Error Handling

| HTTP Status | Code | Deskripsi |
|-------------|------|-----------|
| 400 | `VALIDATION_ERROR` | Input tidak valid |
| 401 | `UNAUTHORIZED` | Token tidak valid atau expired |
| 403 | `FORBIDDEN` | Tidak memiliki akses |
| 404 | `NOT_FOUND` | Resource tidak ditemukan |
| 409 | `CONFLICT` | Konflik data (duplikasi, dll.) |
| 422 | `UNPROCESSABLE` | Data valid tapi tidak dapat diproses |
| 429 | `RATE_LIMITED` | Terlalu banyak request |
| 500 | `INTERNAL_ERROR` | Error server internal |

```typescript
// Contoh error handler middleware
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@/lib/errors';

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data yang dikirim tidak valid',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    }, { status: 400 });
  }

  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }, { status: error.statusCode });
  }

  // Unexpected error — jangan expose detail ke client
  console.error('Unexpected error:', error);
  return NextResponse.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan pada server',
    },
  }, { status: 500 });
}
```

---

## 7. Testing

### 7.1 Strategi Testing

```
Testing Pyramid:

         ╱  E2E  ╲         → Sedikit, mahal, lambat
        ╱──────────╲
       ╱ Integration╲      → Sedang, test API & DB
      ╱──────────────╲
     ╱   Unit Tests   ╲    → Banyak, murah, cepat
    ╱──────────────────╲

Target Code Coverage: ≥ 80%
```

### 7.2 Unit Tests (Jest)

```bash
# Jalankan semua unit tests
npm run test

# Jalankan test spesifik
npm run test -- --testPathPattern=donation

# Jalankan dengan coverage report
npm run test:coverage

# Watch mode untuk development
npm run test:watch
```

```typescript
// tests/unit/services/donationService.test.ts
import { DonationService } from '@/lib/services/donationService';
import { prismaMock } from '../../fixtures/prismaMock';

describe('DonationService', () => {
  describe('calculateZakat', () => {
    it('harus menghitung zakat 2.5% dari penghasilan', () => {
      const result = DonationService.calculateZakat(10_000_000);
      expect(result).toBe(250_000);
    });

    it('harus return 0 jika di bawah nishab', () => {
      const result = DonationService.calculateZakat(500_000);
      expect(result).toBe(0);
    });
  });

  describe('createDonation', () => {
    it('harus membuat donasi baru dengan status PENDING', async () => {
      const input = {
        userId: 'usr_123',
        amount: 500000,
        type: 'INFAQ',
      };

      prismaMock.donation.create.mockResolvedValue({
        id: 'don_abc',
        ...input,
        status: 'PENDING',
        createdAt: new Date(),
      });

      const result = await DonationService.create(input);
      expect(result.status).toBe('PENDING');
      expect(result.amount).toBe(500000);
    });
  });
});
```

### 7.3 Integration Tests

```typescript
// tests/integration/api/donations.test.ts
import { createTestServer } from '../../fixtures/testServer';
import { createTestUser } from '../../fixtures/testUser';

describe('POST /api/v1/donations', () => {
  let server: TestServer;
  let authToken: string;

  beforeAll(async () => {
    server = await createTestServer();
    const user = await createTestUser({ role: 'JAMAAH' });
    authToken = user.token;
  });

  afterAll(async () => {
    await server.close();
  });

  it('harus membuat donasi baru (201)', async () => {
    const response = await server.post('/api/v1/donations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 500000,
        type: 'INFAQ',
        message: 'Semoga bermanfaat',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('PENDING');
  });

  it('harus menolak donasi tanpa autentikasi (401)', async () => {
    const response = await server.post('/api/v1/donations')
      .send({ amount: 500000 });

    expect(response.status).toBe(401);
  });
});
```

### 7.4 E2E Tests (Cypress)

```bash
# Jalankan Cypress secara interaktif
npm run test:e2e

# Jalankan Cypress di mode headless (CI)
npm run test:e2e:ci
```

```typescript
// tests/e2e/donation-flow.cy.ts
describe('Alur Donasi', () => {
  beforeEach(() => {
    cy.login('jamaah@test.com', 'password123');
  });

  it('harus dapat menyelesaikan donasi dari awal sampai akhir', () => {
    cy.visit('/dashboard/donasi');
    cy.get('[data-testid="btn-donasi-baru"]').click();
    
    // Isi form donasi
    cy.get('[data-testid="input-nominal"]').type('500000');
    cy.get('[data-testid="select-jenis"]').select('INFAQ');
    cy.get('[data-testid="input-pesan"]').type('Semoga bermanfaat');
    
    // Upload bukti transfer
    cy.get('[data-testid="input-bukti"]').attachFile('bukti-transfer.jpg');
    
    // Submit
    cy.get('[data-testid="btn-submit-donasi"]').click();
    
    // Verifikasi
    cy.get('[data-testid="donasi-status"]').should('contain', 'Menunggu Verifikasi');
    cy.get('[data-testid="donasi-nominal"]').should('contain', 'Rp 500.000');
  });
});
```

---

## 8. Environment Variables & Konfigurasi

### 8.1 File Environment

```
Hierarki Environment Files (prioritas tinggi → rendah):
├── .env.local          → Override lokal (TIDAK masuk git)
├── .env.development    → Default untuk development
├── .env.staging        → Default untuk staging
├── .env.production     → Default untuk production
└── .env.example        → Template referensi (masuk git)
```

### 8.2 Variabel yang Diperlukan

```bash
# .env.example

# ============================================
# APPLICATION
# ============================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Amanah Masjid"
APP_SECRET_KEY=                    # Generate: openssl rand -hex 32

# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://user:pass@localhost:5432/amanah_masjid_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ============================================
# REDIS
# ============================================
REDIS_URL=redis://:password@localhost:6379
REDIS_PREFIX=amanah:

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=                        # Generate: openssl rand -hex 64
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUNDS=12

# ============================================
# FILE STORAGE
# ============================================
STORAGE_PROVIDER=local             # local | s3 | gcs
STORAGE_BUCKET=amanah-uploads
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1

# ============================================
# EMAIL
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM="Amanah Masjid <noreply@amanahmasjid.id>"

# ============================================
# PAYMENT GATEWAY
# ============================================
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# ============================================
# AI SERVICES
# ============================================
OPENAI_API_KEY=
AI_MODEL=gpt-4o
AI_MAX_TOKENS=4096

# ============================================
# MONITORING
# ============================================
SENTRY_DSN=
LOG_LEVEL=debug                    # debug | info | warn | error
```

> ⚠️ **PENTING:** Jangan pernah commit file `.env.local` ke repository. Gunakan `.env.example` sebagai referensi.

---

## 9. Logging & Debugging

### 9.1 Logging Framework

Proyek menggunakan **Pino** sebagai logging library untuk performa tinggi.

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' } 
    : undefined,
  base: {
    service: 'amanah-masjid',
    env: process.env.NODE_ENV,
  },
  redact: ['password', 'token', 'authorization', 'cookie'],
});

// Penggunaan:
logger.info({ userId: 'usr_123', action: 'LOGIN' }, 'User berhasil login');
logger.error({ err, donationId: 'don_456' }, 'Gagal memproses donasi');
logger.warn({ ip: '192.168.1.1' }, 'Rate limit hampir tercapai');
```

### 9.2 Log Levels

| Level | Penggunaan | Contoh |
|-------|------------|--------|
| `error` | Error yang membutuhkan tindakan segera | Database connection lost |
| `warn` | Kondisi tidak normal tapi sistem masih berjalan | Rate limit mendekati batas |
| `info` | Event bisnis penting | User login, donasi dibuat |
| `debug` | Detail teknis untuk debugging | Query result, request payload |
| `trace` | Detail sangat granular | Function entry/exit |

### 9.3 Debugging Tips

```bash
# Debug mode dengan Node.js inspector
NODE_OPTIONS='--inspect' npm run dev

# Aktifkan verbose Prisma logging
DEBUG="prisma:*" npm run dev

# Lihat query SQL yang dijalankan Prisma
# Tambahkan di schema.prisma:
# generator client {
#   provider = "prisma-client-js"
#   log      = ["query", "info", "warn", "error"]
# }
```

---

## 10. Performance Optimization

### 10.1 Database

```typescript
// ✅ Gunakan select untuk mengambil field yang diperlukan saja
const donations = await prisma.donation.findMany({
  select: { id: true, amount: true, status: true },
  where: { status: 'VERIFIED' },
});

// ✅ Gunakan index pada kolom yang sering di-query
// Di schema.prisma:
// @@index([status, createdAt])
// @@index([userId])

// ✅ Pagination menggunakan cursor untuk dataset besar
const donations = await prisma.donation.findMany({
  take: 20,
  cursor: { id: lastDonationId },
  skip: 1,
  orderBy: { createdAt: 'desc' },
});

// ❌ HINDARI: N+1 queries
// ✅ GUNAKAN: Include/Join untuk relasi
const mosques = await prisma.mosque.findMany({
  include: { programs: true, donations: true },
});
```

### 10.2 Caching Strategy

```typescript
// Redis caching layer
import { redis } from '@/lib/redis';

async function getCachedDonationStats(mosqueId: string) {
  const cacheKey = `stats:donation:${mosqueId}`;
  
  // Cek cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const stats = await calculateDonationStats(mosqueId);
  
  // Simpan ke cache (TTL: 5 menit)
  await redis.set(cacheKey, JSON.stringify(stats), 'EX', 300);
  
  return stats;
}
```

### 10.3 Frontend Performance

- **Image optimization**: Gunakan `next/image` dengan lazy loading
- **Code splitting**: Dynamic imports untuk komponen besar
- **Memoization**: `React.memo`, `useMemo`, `useCallback` untuk menghindari re-render
- **Bundle analysis**: `npm run analyze` untuk identifikasi bundle besar
- **Web Vitals target**: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 11. Deployment

### 11.1 Environments

| Environment | URL | Branch | Tujuan |
|-------------|-----|--------|--------|
| Development | `localhost:3000` | `develop` | Pengembangan lokal |
| Staging | `staging.amanahmasjid.id` | `develop` | Testing & QA |
| Production | `amanahmasjid.id` | `main` | Live untuk publik |

### 11.2 Deployment Workflow

```
Development → Staging → Production

1. Feature branch di-merge ke `develop`
2. Auto-deploy ke staging via CI/CD
3. QA testing di staging
4. Buat release branch dari develop
5. Final testing & approval
6. Merge release ke main
7. Auto-deploy ke production
8. Tag version release
9. Merge kembali ke develop
```

### 11.3 Rollback Procedures

```bash
# Rollback ke versi sebelumnya
# Option 1: Revert commit
git revert HEAD --no-edit
git push origin main

# Option 2: Deploy versi spesifik (via tag)
git checkout v2.0.3
# Trigger deployment pipeline

# Option 3: Database rollback (jika migrasi bermasalah)
# ⚠️ Hanya jika migrasi backward-compatible!
npx prisma migrate resolve --rolled-back 20260301083000_problematic_migration
```

---

## 12. CI/CD Pipeline

### 12.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [develop]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: 🔍 Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  test:
    name: 🧪 Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: amanah_test
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/amanah_test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4

  build:
    name: 🏗️ Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  deploy-staging:
    name: 🚀 Deploy Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # Add deployment commands here

  deploy-production:
    name: 🚀 Deploy Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
```

---

## 13. Monitoring & Alerting

### 13.1 Stack Monitoring

| Tool | Fungsi | Dashboard |
|------|--------|-----------|
| **Sentry** | Error tracking & performance | sentry.io/amanah-masjid |
| **Grafana** | Metrics visualization | grafana.amanahmasjid.id |
| **Prometheus** | Metrics collection | Internal |
| **Loki** | Log aggregation | Via Grafana |
| **Uptime Robot** | Uptime monitoring | uptimerobot.com |

### 13.2 Metrics yang Dimonitor

```
Application Metrics:
├── Response time (p50, p95, p99)
├── Error rate (4xx, 5xx)
├── Request throughput (RPM)
├── Active users (concurrent)
└── Business metrics (donasi/hari, registrasi/hari)

Infrastructure Metrics:
├── CPU usage
├── Memory usage
├── Disk I/O
├── Network throughput
└── Database connections pool

Custom Alerts:
├── Error rate > 5% selama 5 menit → P2 Alert
├── Response time p95 > 3 detik → P3 Alert
├── Transaksi gagal beruntun > 3 → P1 Alert
├── Database connection pool > 80% → P2 Alert
└── Disk usage > 85% → P3 Alert
```

### 13.3 On-Call Rotation

Tim engineering menjalankan rotasi on-call mingguan. Engineer on-call bertanggung jawab untuk merespons alert P1 dan P2 di luar jam kerja.

---

## 14. Troubleshooting

### 14.1 Masalah Umum & Solusi

| Masalah | Kemungkinan Penyebab | Solusi |
|---------|----------------------|--------|
| `npm install` gagal | Node.js version mismatch | Pastikan Node.js v20.x via `nvm use 20` |
| Database connection refused | PostgreSQL belum jalan | `docker compose up -d postgres` |
| Prisma migrate error | Schema conflict | `npx prisma migrate reset` (dev only!) |
| Redis connection error | Redis belum jalan | `docker compose up -d redis` |
| Build error: type mismatch | TypeScript strict mode | Periksa type definitions |
| API 401 Unauthorized | JWT expired | Refresh token atau login ulang |
| Upload gagal (413) | File terlalu besar | Cek `MAX_UPLOAD_SIZE` di config |
| Slow queries | Missing index | Jalankan `EXPLAIN ANALYZE` pada query |

### 14.2 Debugging Database

```bash
# Masuk ke PostgreSQL container
docker exec -it amanah-postgres psql -U amanah_dev -d amanah_masjid_dev

# Lihat semua tabel
\dt

# Lihat struktur tabel
\d donations

# Query debug
EXPLAIN ANALYZE SELECT * FROM donations WHERE status = 'PENDING';

# Lihat active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

### 14.3 Debugging Redis

```bash
# Masuk ke Redis container
docker exec -it amanah-redis redis-cli -a redis_dev_123

# Lihat semua keys
KEYS amanah:*

# Cek TTL key
TTL amanah:stats:donation:mosque_123

# Monitor commands real-time
MONITOR

# Lihat memory usage
INFO memory
```

### 14.4 Kontak Tim

Jika mengalami masalah yang tidak bisa diselesaikan, hubungi:

| Tim | Channel | Response Time |
|-----|---------|---------------|
| Backend | #backend-help (Slack) | 1-2 jam |
| Frontend | #frontend-help (Slack) | 1-2 jam |
| DevOps | #devops (Slack) | 30 menit - 1 jam |
| Security | #security-alert (Slack) | 15-30 menit |

---

> **💡 Tips:** Bookmark halaman ini dan jadikan referensi utama saat pengembangan. Jika ada yang perlu diupdate, buat PR ke branch `docs/dev-guide-update`.

---

*Dokumen ini disusun oleh Tim Engineering Amanah Masjid. Versi terbaru selalu tersedia di repository proyek.*
