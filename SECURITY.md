# 🔒 SECURITY — Amanah Masjid

> Kebijakan Keamanan & Panduan Implementasi Platform Amanah Masjid

**Versi:** 2.0.0  
**Terakhir Diperbarui:** 1 Juni 2026  
**Penanggung Jawab:** Tim Security & Infrastructure — Amanah Masjid  
**Status:** ✅ Aktif & Berlaku

---

## Daftar Isi

1. [Security Policy Overview](#1-security-policy-overview)
2. [Authentication](#2-authentication)
3. [Authorization (RBAC)](#3-authorization-rbac)
4. [Data Encryption](#4-data-encryption)
5. [Input Validation & Sanitization](#5-input-validation--sanitization)
6. [SQL Injection Prevention](#6-sql-injection-prevention)
7. [XSS & CSRF Protection](#7-xss--csrf-protection)
8. [Rate Limiting & DDoS Protection](#8-rate-limiting--ddos-protection)
9. [File Upload Security](#9-file-upload-security)
10. [API Security](#10-api-security)
11. [Backup Strategy](#11-backup-strategy)
12. [Monitoring & Deteksi Anomali](#12-monitoring--deteksi-anomali)
13. [Incident Response](#13-incident-response)
14. [Vulnerability Management](#14-vulnerability-management)
15. [Security Training](#15-security-training)
16. [Penetration Testing](#16-penetration-testing)

---

## 1. Security Policy Overview

### 1.1 Visi Keamanan

Platform Amanah Masjid menerapkan prinsip **Defense in Depth** — keamanan berlapis di setiap level arsitektur. Kepercayaan jamaah adalah aset utama, dan keamanan data serta transaksi menjadi prioritas tertinggi.

### 1.2 Prinsip Keamanan

| Prinsip | Deskripsi | Implementasi |
|---------|-----------|--------------|
| **Least Privilege** | Berikan hak akses minimum yang diperlukan | RBAC ketat, permission granular |
| **Defense in Depth** | Keamanan berlapis di setiap layer | WAF + App Security + DB Security |
| **Zero Trust** | Jangan percaya, selalu verifikasi | Validasi setiap request, token expiry pendek |
| **Secure by Default** | Konfigurasi aman sejak awal | Default deny, opt-in untuk akses |
| **Fail Securely** | Saat gagal, jatuh ke kondisi aman | Error handling tanpa leak informasi |
| **Separation of Duties** | Pemisahan tanggung jawab | Multi-level approval untuk transaksi |

### 1.3 Arsitektur Keamanan

```
                         ┌─────────────────┐
                         │   CloudFlare     │ ← DDoS Protection
                         │   WAF + CDN      │ ← Web Application Firewall
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │   Load Balancer   │ ← TLS 1.3 Termination
                         │   (Nginx/ALB)     │ ← Rate Limiting
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼─────┐ ┌────▼─────┐ ┌────▼─────┐
              │  App Node  │ │ App Node │ │ App Node │ ← JWT Validation
              │  (Next.js) │ │ (Next.js)│ │ (Next.js)│ ← Input Validation
              └─────┬─────┘ └────┬─────┘ └────┬─────┘ ← RBAC Enforcement
                    │             │             │
              ┌─────▼─────────────▼─────────────▼─────┐
              │           Internal Network             │
              │  ┌──────────┐  ┌───────┐  ┌─────────┐ │
              │  │PostgreSQL│  │ Redis │  │ Storage │ │ ← Encrypted at Rest
              │  │ (AES-256)│  │       │  │  (S3)   │ │ ← Network Isolation
              │  └──────────┘  └───────┘  └─────────┘ │
              └───────────────────────────────────────┘
```

---

## 2. Authentication

### 2.1 JWT (JSON Web Token)

Sistem autentikasi menggunakan mekanisme JWT dengan access token dan refresh token.

```typescript
// Konfigurasi JWT
const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',            // Expire dalam 15 menit
    algorithm: 'HS256' as const,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',             // Expire dalam 7 hari
    algorithm: 'HS256' as const,
  },
};
```

### 2.2 Alur Autentikasi

```
Login Flow:
┌──────┐     ┌──────────┐     ┌──────────┐     ┌────────┐
│Client│────▶│ Validate │────▶│ Generate │────▶│ Return │
│      │     │Credentials│     │  Tokens  │     │ Tokens │
└──────┘     └──────────┘     └──────────┘     └────────┘
                  │
                  ▼ (jika gagal 5x)
            ┌──────────┐
            │Lock Akun │ → Durasi: 30 menit
            │+ Alert   │ → Notifikasi ke admin
            └──────────┘

Token Refresh Flow:
┌──────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│Client│────▶│Kirim Refresh │────▶│Validasi Token│────▶│Access Token│
│      │     │   Token      │     │ + Rotate     │     │   Baru     │
└──────┘     └──────────────┘     └──────────────┘     └────────────┘
```

### 2.3 Session Management

| Aspek | Kebijakan |
|-------|-----------|
| **Session Storage** | Redis dengan TTL otomatis |
| **Concurrent Sessions** | Maksimal 3 perangkat per user |
| **Idle Timeout** | 30 menit tanpa aktivitas |
| **Absolute Timeout** | 24 jam (wajib login ulang) |
| **Session Invalidation** | Logout menghapus semua token terkait |
| **Device Tracking** | User agent + fingerprint dicatat |

### 2.4 Two-Factor Authentication (2FA)

```
Implementasi 2FA:

Metode yang Didukung:
├── TOTP (Time-based One-Time Password)  → Google Authenticator, Authy
├── SMS OTP                               → Sebagai fallback
└── Email OTP                             → Untuk recovery

Wajib 2FA untuk:
├── SUPER_ADMIN           → Wajib (TOTP only)
├── ADMIN_MASJID          → Wajib (TOTP atau SMS)
├── BENDAHARA             → Wajib (TOTP atau SMS)
└── JAMAAH                → Opsional (semua metode)

Kebijakan 2FA:
├── Recovery codes: 10 kode single-use saat setup
├── Backup method: Wajib minimal 1 metode cadangan
├── Grace period: 7 hari setelah diaktifkan untuk setup
└── Lock on failure: 5 percobaan gagal → lock 15 menit
```

### 2.5 Password Policy

```typescript
const PASSWORD_POLICY = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,     // Cek terhadap daftar 10.000 password umum
  preventPersonalInfo: true,        // Tidak boleh mengandung nama/email
  historyCount: 5,                  // Tidak boleh sama dengan 5 password terakhir
  maxAge: 90,                       // Wajib ganti setiap 90 hari
  hashAlgorithm: 'bcrypt',
  saltRounds: 12,
};
```

---

## 3. Authorization (RBAC)

### 3.1 Definisi Role

| Role | Deskripsi | Level Akses |
|------|-----------|-------------|
| `SUPER_ADMIN` | Administrator platform | Akses penuh ke seluruh sistem |
| `ADMIN_MASJID` | Administrator per masjid | Manajemen masjid tertentu |
| `BENDAHARA` | Pengelola keuangan masjid | Transaksi & laporan keuangan |
| `PENGURUS` | Pengurus DKM | Program & kegiatan masjid |
| `JAMAAH` | Anggota jamaah terdaftar | Donasi, profil, riwayat |
| `AUDITOR` | Auditor internal/eksternal | Read-only semua data |
| `AI_SERVICE` | Service account untuk AI | Akses API terbatas |

### 3.2 Permission Matrix

| Permission | SUPER_ADMIN | ADMIN_MASJID | BENDAHARA | PENGURUS | JAMAAH | AUDITOR |
|-----------|:-----------:|:------------:|:---------:|:--------:|:------:|:-------:|
| **User Management** | ✅ | ✅¹ | ❌ | ❌ | ❌ | ❌ |
| **Mosque Settings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Donations** | ✅ | ✅ | ✅ | ✅² | ✅³ | ✅ |
| **Verify Donations** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create Donations** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Financial Reports** | ✅ | ✅ | ✅ | ✅² | ❌ | ✅ |
| **Manage Programs** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **AI Admin Panel** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Audit Logs** | ✅ | ✅⁴ | ❌ | ❌ | ❌ | ✅ |
| **System Config** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> ¹ Hanya user di masjid yang dikelola  
> ² Hanya ringkasan/summary  
> ³ Hanya donasi milik sendiri  
> ⁴ Hanya log masjid yang dikelola

### 3.3 Implementasi Middleware RBAC

```typescript
// src/lib/auth/rbac.ts
import { NextRequest, NextResponse } from 'next/server';

type Permission = 'donations:read' | 'donations:write' | 'donations:verify' 
  | 'users:manage' | 'reports:read' | 'programs:manage' | 'audit:read' 
  | 'system:config';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: ['*'], // Semua permission
  ADMIN_MASJID: [
    'donations:read', 'donations:write', 'donations:verify',
    'users:manage', 'reports:read', 'programs:manage', 'audit:read',
  ],
  BENDAHARA: [
    'donations:read', 'donations:write', 'donations:verify', 'reports:read',
  ],
  PENGURUS: [
    'donations:read', 'donations:write', 'programs:manage',
  ],
  JAMAAH: [
    'donations:read', 'donations:write',
  ],
  AUDITOR: [
    'donations:read', 'reports:read', 'audit:read',
  ],
};

export function requirePermission(...permissions: Permission[]) {
  return async (req: NextRequest) => {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Token tidak valid' } },
        { status: 401 }
      );
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const hasPermission = userPermissions.includes('*') || 
      permissions.every((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Anda tidak memiliki akses' } },
        { status: 403 }
      );
    }

    return null; // Lanjutkan ke handler
  };
}
```

---

## 4. Data Encryption

### 4.1 Encryption at Rest (AES-256)

| Data | Metode Enkripsi | Key Management |
|------|-----------------|----------------|
| Database (PostgreSQL) | AES-256-CBC via pgcrypto | AWS KMS / HashiCorp Vault |
| File uploads | AES-256-GCM | Per-file encryption key |
| Backup files | AES-256-CBC | Rotasi key setiap 90 hari |
| Redis cache | Enkripsi data sensitif sebelum simpan | Application-level key |
| Log files | Redaction + enkripsi arsip | Terpisah dari data key |

```typescript
// src/lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 4.2 Encryption in Transit (TLS 1.3)

```nginx
# Konfigurasi Nginx untuk TLS 1.3
server {
    listen 443 ssl http2;
    server_name amanahmasjid.id;

    # Sertifikat SSL
    ssl_certificate     /etc/ssl/certs/amanahmasjid.id.pem;
    ssl_certificate_key /etc/ssl/private/amanahmasjid.id.key;

    # Protokol & Cipher
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256;
    ssl_prefer_server_ciphers on;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
}
```

---

## 5. Input Validation & Sanitization

### 5.1 Strategi Validasi

```
Validasi Berlapis:

[Client-side] → Validasi form (UX, responsif)
       │
[API Gateway] → Rate limiting, size check
       │
[Application] → Zod schema validation (source of truth)
       │
[Database]    → Constraints, triggers, check constraints
```

### 5.2 Implementasi dengan Zod

```typescript
// src/lib/validators/donation.ts
import { z } from 'zod';

export const createDonationSchema = z.object({
  amount: z
    .number()
    .positive('Nominal harus lebih dari 0')
    .max(1_000_000_000, 'Nominal maksimal Rp 1 miliar')
    .refine((val) => Number.isInteger(val), 'Nominal harus bilangan bulat'),
    
  type: z.enum(['ZAKAT', 'INFAQ', 'SEDEKAH', 'WAKAF', 'FIDYAH', 'QURBAN'], {
    errorMap: () => ({ message: 'Jenis donasi tidak valid' }),
  }),
  
  mosqueId: z
    .string()
    .uuid('ID masjid tidak valid'),
    
  message: z
    .string()
    .max(500, 'Pesan maksimal 500 karakter')
    .optional()
    .transform((val) => val ? sanitizeHtml(val) : undefined),
    
  isAnonymous: z
    .boolean()
    .default(false),
});

// Sanitasi HTML untuk mencegah XSS
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

### 5.3 Daftar Validasi Wajib

| Field | Validasi | Contoh |
|-------|----------|--------|
| Email | Format email + domain check | RFC 5322 compliant |
| Telepon | Format Indonesia (+62) | `+62812xxxxxxxx` |
| Nominal | Positif, integer, max limit | `1 — 1.000.000.000` |
| Nama | Alfanumerik + spasi, max 100 | Strip special chars |
| Alamat | Max 500 chars, sanitize | HTML entity encoding |
| File upload | Type, size, content check | Lihat bagian 9 |
| URL | Protocol whitelist (https) | Reject `javascript:` |
| ID/UUID | Format UUID v4 valid | Regex validation |

---

## 6. SQL Injection Prevention

### 6.1 Penggunaan Prisma ORM

Prisma ORM secara otomatis melindungi dari SQL injection melalui parameterized queries.

```typescript
// ✅ AMAN — Prisma parameterized query
const donations = await prisma.donation.findMany({
  where: {
    userId: userId,         // Parameter di-escape otomatis
    status: 'VERIFIED',
    amount: { gte: 100000 },
  },
});

// ✅ AMAN — Raw query dengan parameter
const result = await prisma.$queryRaw`
  SELECT * FROM donations 
  WHERE user_id = ${userId} 
  AND status = ${status}
`;

// ❌ BERBAHAYA — Jangan pernah lakukan ini!
// const result = await prisma.$queryRawUnsafe(
//   `SELECT * FROM donations WHERE user_id = '${userId}'`
// );
```

### 6.2 Aturan Ketat

1. **DILARANG** menggunakan `$queryRawUnsafe()` — tanpa pengecualian
2. **DILARANG** melakukan string concatenation untuk query SQL
3. **WAJIB** menggunakan Prisma client atau `$queryRaw` dengan tagged template
4. **WAJIB** validasi dan sanitasi semua input sebelum masuk ke query
5. **WAJIB** gunakan prepared statements jika akses database langsung

---

## 7. XSS & CSRF Protection

### 7.1 Cross-Site Scripting (XSS) Prevention

| Jenis XSS | Perlindungan | Implementasi |
|------------|-------------|--------------|
| **Reflected XSS** | Input sanitization + CSP | Zod validation + helmet |
| **Stored XSS** | Output encoding + sanitization | React auto-escaping + DOMPurify |
| **DOM-based XSS** | Avoid `dangerouslySetInnerHTML` | ESLint rule + code review |

```typescript
// Content Security Policy header
const CSP_HEADER = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'nonce-{RANDOM}'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.amanahmasjid.id",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};
```

### 7.2 Cross-Site Request Forgery (CSRF) Prevention

```typescript
// CSRF Protection menggunakan Double Submit Cookie
import { csrf } from '@/lib/security/csrf';

// Middleware CSRF
export async function csrfMiddleware(req: NextRequest) {
  // Skip untuk GET, HEAD, OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return;
  }
  
  const cookieToken = req.cookies.get('csrf_token')?.value;
  const headerToken = req.headers.get('X-CSRF-Token');
  
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return NextResponse.json(
      { success: false, error: { code: 'CSRF_INVALID', message: 'CSRF token tidak valid' } },
      { status: 403 }
    );
  }
}

// Set CSRF cookie pada setiap response
export function setCsrfCookie(response: NextResponse): NextResponse {
  const token = crypto.randomBytes(32).toString('hex');
  response.cookies.set('csrf_token', token, {
    httpOnly: false,    // Harus bisa dibaca oleh JavaScript
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 3600,       // 1 jam
  });
  return response;
}
```

### 7.3 Cookie Security

```typescript
const COOKIE_OPTIONS = {
  httpOnly: true,        // Tidak bisa diakses via JavaScript
  secure: true,          // Hanya HTTPS
  sameSite: 'strict',    // Mencegah CSRF
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 hari untuk refresh token
  domain: '.amanahmasjid.id',
};
```

---

## 8. Rate Limiting & DDoS Protection

### 8.1 Rate Limiting Rules

| Endpoint Category | Limit | Window | Action on Exceed |
|-------------------|-------|--------|------------------|
| **Auth (login)** | 5 requests | 15 menit | Block 30 menit + alert |
| **Auth (register)** | 3 requests | 1 jam | Block 1 jam |
| **Auth (password reset)** | 3 requests | 1 jam | Block 1 jam |
| **API (authenticated)** | 100 requests | 1 menit | 429 response + backoff |
| **API (public)** | 30 requests | 1 menit | 429 response |
| **File upload** | 10 requests | 10 menit | 429 response |
| **AI services** | 20 requests | 1 menit | 429 response + queue |
| **Webhook** | 50 requests | 1 menit | Drop + alert |

### 8.2 Implementasi Rate Limiter

```typescript
// src/lib/security/rateLimiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter untuk API umum
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1m'),
  analytics: true,
  prefix: 'ratelimit:api',
});

// Rate limiter ketat untuk auth
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, '15m'),
  analytics: true,
  prefix: 'ratelimit:auth',
});

// Middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.ip ?? '127.0.0.1';
  const identifier = `${ip}:${req.nextUrl.pathname}`;
  
  const { success, limit, reset, remaining } = await apiRateLimiter.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Terlalu banyak permintaan' } },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
}
```

### 8.3 DDoS Protection

```
Strategi Berlapis:

Layer 1: CloudFlare
├── Automatic DDoS mitigation
├── Bot management
├── IP reputation filtering
└── Challenge pages untuk traffic mencurigakan

Layer 2: Load Balancer
├── Connection limiting
├── Request throttling
├── Geographic filtering (jika perlu)
└── Health check & auto-scaling

Layer 3: Application
├── Rate limiting per user/IP
├── Request size limiting (max 10MB)
├── Timeout enforcement (30 detik)
└── Circuit breaker untuk downstream services
```

---

## 9. File Upload Security

### 9.1 Validasi Upload (Bukti Transfer & Dokumen)

```typescript
// src/lib/security/fileUpload.ts

const UPLOAD_CONFIG = {
  // Tipe file yang diizinkan
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ],
  
  // Ekstensi yang diizinkan
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  
  // Ukuran maksimal
  maxFileSize: 5 * 1024 * 1024, // 5MB
  
  // Dimensi gambar
  maxImageWidth: 4096,
  maxImageHeight: 4096,
  
  // Jumlah file per upload
  maxFiles: 3,
};

export async function validateUpload(file: File): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // 1. Cek ukuran file
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    errors.push('Ukuran file maksimal 5MB');
  }
  
  // 2. Cek ekstensi file
  const ext = path.extname(file.name).toLowerCase();
  if (!UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
    errors.push(`Ekstensi ${ext} tidak diizinkan`);
  }
  
  // 3. Cek MIME type (jangan hanya percaya pada ekstensi)
  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = await detectFileType(buffer);
  if (!UPLOAD_CONFIG.allowedMimeTypes.includes(detectedType)) {
    errors.push('Tipe file tidak valid');
  }
  
  // 4. Cek magic bytes (file signature)
  if (!isValidMagicBytes(buffer, ext)) {
    errors.push('File signature tidak cocok dengan ekstensi');
  }
  
  // 5. Scan malware (via ClamAV atau layanan cloud)
  const isSafe = await scanForMalware(buffer);
  if (!isSafe) {
    errors.push('File terdeteksi mengandung malware');
  }
  
  // 6. Strip metadata EXIF (untuk privacy)
  // Dilakukan setelah validasi berhasil
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### 9.2 Penyimpanan File Aman

```
Proses Upload File:

1. Validasi (type, size, magic bytes, malware scan)
2. Strip metadata EXIF
3. Generate nama file unik (UUID + hash)
4. Enkripsi file (AES-256-GCM)
5. Upload ke storage terpisah (S3/GCS)
6. Simpan metadata di database
7. Generate signed URL untuk akses (expire: 1 jam)

Aturan:
├── ❌ File TIDAK boleh diakses langsung via URL publik
├── ✅ Akses hanya melalui signed URL dengan expiry
├── ✅ File disimpan di bucket terpisah dari kode aplikasi
├── ✅ Nama file asli tidak digunakan (rename ke UUID)
└── ✅ Direktori upload tidak memiliki execute permission
```

---

## 10. API Security

### 10.1 API Authentication Methods

| Metode | Penggunaan | Implementasi |
|--------|------------|--------------|
| **JWT Bearer Token** | Client apps, SPA | `Authorization: Bearer <token>` |
| **API Key** | Server-to-server | `X-API-Key: <key>` header |
| **OAuth2** | Integrasi pihak ketiga | Authorization Code flow |
| **HMAC Signature** | Webhook verification | Request body signing |

### 10.2 API Key Management

```typescript
// Struktur API Key
interface ApiKey {
  id: string;
  key: string;              // Prefix: 'am_live_' atau 'am_test_'
  name: string;             // Nama deskriptif
  permissions: string[];    // Daftar permission yang diizinkan
  rateLimitTier: string;    // 'standard' | 'premium' | 'unlimited'
  ipWhitelist: string[];    // IP yang diizinkan (opsional)
  expiresAt: Date | null;   // Tanggal kedaluwarsa
  lastUsedAt: Date | null;
  createdAt: Date;
}

// Format API Key: am_{env}_{random_32_chars}
// Contoh: am_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 10.3 Request Signing (untuk Webhooks)

```typescript
// Verifikasi webhook signature
import crypto from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  // Gunakan timing-safe comparison untuk mencegah timing attack
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```

### 10.4 API Security Checklist

- [x] Semua endpoint menggunakan HTTPS
- [x] Authentication di setiap endpoint (kecuali public)
- [x] Authorization check sesuai RBAC
- [x] Input validation menggunakan Zod schema
- [x] Rate limiting diterapkan
- [x] Response tidak mengekspos informasi sensitif
- [x] Error messages generik untuk production
- [x] CORS dikonfigurasi ketat
- [x] Request size limit diterapkan
- [x] API versioning (`/api/v1/`)

---

## 11. Backup Strategy

### 11.1 Jadwal Backup

| Jenis Backup | Frekuensi | Retensi | Lokasi |
|--------------|-----------|---------|--------|
| **Full Database** | Harian (02:00 WIB) | 30 hari | Primary + Offsite |
| **Incremental DB** | Setiap 6 jam | 7 hari | Primary |
| **WAL Archiving** | Continuous | 7 hari | Offsite (S3) |
| **File Storage** | Harian | 30 hari | Cross-region S3 |
| **Configuration** | Setiap perubahan | 90 hari | Git + encrypted backup |
| **Redis Snapshot** | Setiap 1 jam | 24 jam | Primary |

### 11.2 Backup Automation

```bash
#!/bin/bash
# scripts/backup-database.sh

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
BACKUP_FILE="${BACKUP_DIR}/amanah_masjid_${TIMESTAMP}.sql.gz"
S3_BUCKET="s3://amanah-masjid-backups/postgres"

# Buat backup
echo "[$(date)] Memulai backup database..."
pg_dump \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --username="${DB_USER}" \
  --dbname="${DB_NAME}" \
  --format=custom \
  --compress=9 \
  --file="${BACKUP_FILE}"

# Enkripsi backup
echo "[$(date)] Mengenkripsi backup..."
gpg --symmetric --cipher-algo AES256 \
  --passphrase-file /etc/backup-key \
  "${BACKUP_FILE}"

# Upload ke S3
echo "[$(date)] Mengupload ke offsite storage..."
aws s3 cp "${BACKUP_FILE}.gpg" \
  "${S3_BUCKET}/${TIMESTAMP}/" \
  --storage-class STANDARD_IA

# Hapus file lokal yang lebih dari 30 hari
find "${BACKUP_DIR}" -name "*.sql.gz*" -mtime +30 -delete

echo "[$(date)] Backup selesai: ${BACKUP_FILE}"
```

### 11.3 Recovery Testing

```
Jadwal Uji Recovery:

├── Bulanan  : Restore backup ke environment test, validasi integritas
├── Triwulan : Full disaster recovery drill
├── Tahunan  : Simulasi skenario worst-case (total data loss)

Metrik Recovery:
├── RPO (Recovery Point Objective)  : < 6 jam
├── RTO (Recovery Time Objective)   : < 2 jam
└── Tingkat keberhasilan recovery   : Target 100%
```

### 11.4 Prosedur Restore

```bash
# Restore dari backup terenkripsi

# 1. Download backup dari S3
aws s3 cp s3://amanah-masjid-backups/postgres/20260601_020000/amanah_masjid_20260601_020000.sql.gz.gpg .

# 2. Dekripsi
gpg --decrypt --output amanah_masjid_backup.sql.gz amanah_masjid_20260601_020000.sql.gz.gpg

# 3. Restore
pg_restore \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --username="${DB_USER}" \
  --dbname="${DB_NAME}" \
  --clean \
  --if-exists \
  amanah_masjid_backup.sql.gz

# 4. Validasi integritas
psql -c "SELECT COUNT(*) FROM donations;" -d "${DB_NAME}"
psql -c "SELECT COUNT(*) FROM users;" -d "${DB_NAME}"
```

---

## 12. Monitoring & Deteksi Anomali

### 12.1 Real-Time Monitoring

| Komponen | Tool | Alert Channel |
|----------|------|---------------|
| Application errors | Sentry | Slack + Email |
| Infrastructure | Prometheus + Grafana | PagerDuty |
| Security events | SIEM (ELK Stack) | Slack + PagerDuty |
| Uptime | Uptime Robot | SMS + Slack |
| Database | pganalyze | Email |
| SSL Certificate | Cert monitoring | Email (30 hari sebelum expire) |

### 12.2 Alert Rules

```yaml
# Contoh alert rules (Prometheus AlertManager)

groups:
  - name: security_alerts
    rules:
      # Alert: Login gagal berulang
      - alert: BruteForceDetected
        expr: rate(auth_login_failures_total[5m]) > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Percobaan brute force terdeteksi"
          description: "Lebih dari 10 login gagal per menit selama 2 menit terakhir"

      # Alert: Anomali transaksi
      - alert: UnusualTransactionVolume
        expr: rate(donations_total[1h]) > 5 * avg_over_time(donations_total[7d])
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Volume transaksi tidak biasa"
          description: "Volume donasi 5x lebih tinggi dari rata-rata 7 hari"

      # Alert: Error rate tinggi
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error rate melebihi 5%"

      # Alert: Akses data sensitif di luar jam kerja
      - alert: OffHoursDataAccess
        expr: admin_data_access_total{hour!~"0[89]|1[0-7]"} > 0
        labels:
          severity: warning
        annotations:
          summary: "Akses data admin di luar jam kerja"
```

### 12.3 Log Analysis

```
Log yang Dianalisis:

├── Access logs     → Pattern akses tidak wajar
├── Auth logs       → Brute force, credential stuffing
├── Transaction logs → Anomali jumlah/frekuensi
├── Error logs      → Indikasi serangan atau kerentanan
├── Admin logs      → Privilege escalation, unauthorized access
└── API logs        → Abuse, scraping, enumeration
```

### 12.4 Anomaly Detection

Sistem deteksi anomali berbasis AI menganalisis:

1. **Pola login** — Lokasi baru, device baru, jam tidak biasa
2. **Pola transaksi** — Nominal tidak wajar, frekuensi tinggi
3. **Pola akses API** — Endpoint scanning, parameter fuzzing
4. **Pola data** — Bulk data access, data exfiltration attempts

---

## 13. Incident Response

### 13.1 Tahapan Respons Insiden

```
┌───────────────────────────────────────────────────────┐
│                INCIDENT RESPONSE LIFECYCLE             │
│                                                       │
│  ┌──────────┐  ┌────────────┐  ┌─────────────┐       │
│  │1.DETEKSI │→ │2.CONTAINMENT│→ │3.ERADICATION│       │
│  │& ANALISIS│  │  (Isolasi)  │  │ (Hapus Akar)│       │
│  └──────────┘  └────────────┘  └─────────────┘       │
│       │                                    │          │
│       │         ┌─────────────┐  ┌────────▼───────┐  │
│       └─────────│5.LESSONS    │← │4.RECOVERY      │  │
│                 │  LEARNED    │  │  (Pemulihan)   │  │
│                 └─────────────┘  └────────────────┘  │
└───────────────────────────────────────────────────────┘
```

### 13.2 Detail Setiap Tahap

**Phase 1: Deteksi & Analisis**

| Aktivitas | Detail | PIC |
|-----------|--------|-----|
| Menerima alert | Via monitoring tools atau laporan manual | Security Team |
| Triage awal | Tentukan severity (P1-P4) | On-call engineer |
| Kumpulkan evidence | Log, screenshot, network capture | Technical Lead |
| Notifikasi | Informasi ke stakeholder sesuai severity | Incident Commander |

**Phase 2: Containment**

| Aktivitas | Detail |
|-----------|--------|
| Isolasi sistem | Putuskan koneksi sistem yang terdampak |
| Blokir akses | Revoke token, blokir IP, disable akun |
| Preserve evidence | Forensic copy sebelum perubahan |
| Komunikasi | Update ke stakeholder secara berkala |

**Phase 3: Eradication**

| Aktivitas | Detail |
|-----------|--------|
| Root cause analysis | Identifikasi penyebab utama |
| Patch kerentanan | Perbaiki vulnerability yang dieksploitasi |
| Clean up | Hapus malware, backdoor, akun tidak sah |
| Validasi | Pastikan threat sudah dieliminasi |

**Phase 4: Recovery**

| Aktivitas | Detail |
|-----------|--------|
| Restore sistem | Dari backup bersih jika diperlukan |
| Monitoring intensif | 72 jam pasca-recovery |
| Verifikasi | Pastikan semua layanan normal |
| Komunikasi publik | Jika diperlukan oleh regulasi |

**Phase 5: Lessons Learned**

| Aktivitas | Detail |
|-----------|--------|
| Post-mortem meeting | Dalam 5 hari kerja setelah insiden |
| Dokumentasi | Tulis laporan insiden lengkap |
| Action items | Buat daftar perbaikan |
| Update prosedur | Perbarui runbook dan SOP |

---

## 14. Vulnerability Management

### 14.1 Scanning Schedule

| Jenis Scan | Tool | Frekuensi | Target |
|------------|------|-----------|--------|
| Dependency scan | `npm audit` + Snyk | Setiap build (CI) | Node.js packages |
| SAST (Static Analysis) | SonarQube + CodeQL | Setiap PR | Source code |
| DAST (Dynamic Analysis) | OWASP ZAP | Mingguan | Running application |
| Container scan | Trivy | Setiap build | Docker images |
| Infrastructure scan | Nessus / OpenVAS | Bulanan | Server & network |
| Secret scanning | GitLeaks + GitHub | Setiap commit | Repository |

### 14.2 Patching Policy

| Severity | Patch Timeline | Contoh |
|----------|---------------|--------|
| **Kritis (CVSS 9.0+)** | Dalam 24 jam | Remote Code Execution |
| **Tinggi (CVSS 7.0-8.9)** | Dalam 7 hari | SQL Injection |
| **Sedang (CVSS 4.0-6.9)** | Dalam 30 hari | Information Disclosure |
| **Rendah (CVSS 0.1-3.9)** | Dalam 90 hari | Minor info leak |

### 14.3 Responsible Disclosure Policy

```
Kebijakan Pengungkapan Kerentanan:

1. Laporkan kerentanan ke: security@amanahmasjid.id
2. Gunakan PGP key kami untuk enkripsi (key tersedia di website)
3. Sertakan:
   ├── Deskripsi kerentanan
   ├── Langkah reproduksi
   ├── Potensi dampak
   └── Saran perbaikan (jika ada)
4. Kami akan merespons dalam 48 jam
5. Jangan publikasikan sebelum patch di-deploy
6. Kami memberikan Hall of Fame untuk pelapor yang valid

Timeline:
├── Acknowledgement  : 48 jam
├── Triage            : 5 hari kerja
├── Perbaikan         : Sesuai severity
└── Publikasi         : Setelah patch di-deploy
```

---

## 15. Security Training

### 15.1 Program Training

| Training | Audiens | Frekuensi | Durasi |
|----------|---------|-----------|--------|
| Security Awareness | Seluruh tim | Tahunan (wajib) | 4 jam |
| Secure Coding | Developer | Semester | 8 jam |
| OWASP Top 10 | Developer + QA | Tahunan | 4 jam |
| Incident Response | Tim Security | Triwulan | 2 jam |
| Social Engineering | Seluruh tim | Tahunan | 2 jam |
| Data Privacy | Seluruh tim | Tahunan | 3 jam |

### 15.2 Materi Training Developer

```
Modul Secure Coding:

1. Input Validation & Output Encoding
   ├── SQL Injection prevention
   ├── XSS prevention
   └── Command injection prevention

2. Authentication & Session Management
   ├── Secure password handling
   ├── Token management
   └── Multi-factor authentication

3. Access Control
   ├── RBAC implementation
   ├── Principle of least privilege
   └── Insecure Direct Object References (IDOR)

4. Cryptography
   ├── When and how to use encryption
   ├── Key management
   └── Hashing vs encryption

5. Error Handling & Logging
   ├── Secure error messages
   ├── What to log (and what NOT to log)
   └── Log injection prevention

6. API Security
   ├── Authentication methods
   ├── Rate limiting
   └── Data exposure prevention
```

### 15.3 Simulasi & Drill

- **Phishing simulation**: Triwulan — test awareness tim terhadap email phishing
- **Tabletop exercise**: Semester — simulasi skenario insiden keamanan
- **Red team exercise**: Tahunan — simulasi serangan penuh oleh tim internal/eksternal
- **CTF (Capture the Flag)**: Tahunan — kompetisi keamanan internal untuk developer

---

## 16. Penetration Testing

### 16.1 Jadwal & Cakupan

| Jenis Test | Frekuensi | Scope | Penyedia |
|------------|-----------|-------|----------|
| **External Pentest** | Triwulan | Web app, API, infrastruktur publik | Vendor keamanan tersertifikasi |
| **Internal Pentest** | Semester | Jaringan internal, lateral movement | Vendor keamanan |
| **Mobile App Test** | Per release major | Aplikasi mobile (jika ada) | Vendor keamanan |
| **Social Engineering** | Tahunan | Phishing, pretexting, physical | Red team |
| **Automated Scan** | Mingguan | Full application | OWASP ZAP (automated) |

### 16.2 Metodologi Testing

```
Pentest mengikuti standar:
├── OWASP Testing Guide v4.2
├── PTES (Penetration Testing Execution Standard)
└── NIST SP 800-115

Tahapan:
1. Reconnaissance   → Pengumpulan informasi
2. Scanning          → Identifikasi kerentanan
3. Exploitation      → Eksploitasi kerentanan
4. Post-Exploitation → Lateral movement, privilege escalation
5. Reporting         → Laporan lengkap dengan rekomendasi
```

### 16.3 Kriteria Pentest Vendor

1. Memiliki sertifikasi: OSCP, CEH, CREST, atau setara
2. Pengalaman minimal 3 tahun di penetration testing
3. Memiliki asuransi profesional
4. Bersedia menandatangani NDA
5. Memberikan laporan yang actionable dengan proof of concept
6. Menawarkan re-test setelah perbaikan

### 16.4 Penanganan Temuan Pentest

| Severity | Response Time | Approval untuk Deploy |
|----------|---------------|----------------------|
| Kritis | Perbaikan dalam 24 jam | Tidak boleh deploy sebelum fix |
| Tinggi | Perbaikan dalam 7 hari | Tidak boleh deploy fitur terkait |
| Sedang | Perbaikan dalam 30 hari | Boleh deploy dengan risk acceptance |
| Rendah | Perbaikan dalam 90 hari | Boleh deploy |
| Info | Backlog | Tidak menghalangi deploy |

---

## Kontak Keamanan

| Kebutuhan | Kontak | Ketersediaan |
|-----------|--------|-------------|
| Laporan Kerentanan | security@amanahmasjid.id | 24/7 |
| Insiden Keamanan | incident@amanahmasjid.id | 24/7 |
| Security Team | #security (Slack) | Jam kerja |
| Emergency Hotline | +62-xxx-xxxx-xxxx | 24/7 |

**PGP Key Fingerprint:** `XXXX XXXX XXXX XXXX XXXX  XXXX XXXX XXXX XXXX XXXX`

---

> **⚠️ Klasifikasi Dokumen:** INTERNAL — Hanya untuk tim Amanah Masjid dan pihak yang terotorisasi. Dilarang mendistribusikan tanpa persetujuan Security Lead.

---

*Dokumen ini disusun oleh Tim Security Amanah Masjid dan telah direview oleh Chief Technology Officer. Versi terbaru selalu tersedia di repository proyek.*
