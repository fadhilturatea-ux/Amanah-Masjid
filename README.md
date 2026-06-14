# 🕌 Amanah Masjid

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Platform](https://img.shields.io/badge/platform-web-blueviolet)

> **Platform digital modern untuk pengelolaan masjid yang transparan, efisien, dan amanah.**

Amanah Masjid adalah platform digital terdepan yang dirancang khusus untuk membantu pengelolaan masjid di Indonesia. Menggabungkan teknologi AI, otomasi, dan antarmuka yang intuitif, platform ini menyediakan solusi lengkap untuk manajemen keuangan, administrasi jamaah, program sosial, dan komunikasi masjid.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|-------|-----------|
| 🕌 **Manajemen Masjid** | Dashboard terpusat untuk mengelola data masjid, jadwal kegiatan, inventaris, dan informasi pengurus |
| 💰 **Donasi Online** | Sistem donasi digital dengan berbagai metode pembayaran, laporan keuangan otomatis & transparan |
| 🤝 **Program Sosial** | Pembuatan & pengelolaan program sosial (santunan, beasiswa, bakti sosial) dengan tracking real-time |
| 👥 **Administrasi Jamaah** | Database jamaah lengkap dengan profil, riwayat kegiatan, dan notifikasi otomatis |
| 🤖 **AI Assistant** | Chatbot cerdas untuk menjawab pertanyaan jamaah tentang jadwal sholat, info masjid, dan fatwa |
| 📸 **OCR Kuitansi** | Scan dan ekstraksi data kuitansi donasi otomatis menggunakan teknologi OCR berbasis AI |
| 📱 **WhatsApp Bot** | Bot WhatsApp terintegrasi untuk donasi, pengumuman, reminder, dan tanya jawab |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework dengan App Router & Server Components
- **TypeScript** — Type safety dan developer experience
- **Tailwind CSS** — Utility-first CSS framework
- **Zustand** — State management ringan dan efisien
- **React Query** — Server state management & caching

### Backend
- **Node.js 20 LTS** — Runtime JavaScript
- **Fastify** — Web framework high-performance
- **Prisma ORM** — Database toolkit modern
- **Bull MQ** — Message queue untuk background jobs

### Database & Cache
- **PostgreSQL 16** — Database relasional utama
- **Redis 7** — Caching, session store, dan message broker

### AI / ML
- **Tesseract.js** — OCR engine untuk scan kuitansi
- **OpenAI API** — NLP untuk chatbot dan AI assistant
- **TensorFlow.js** — Model fraud detection donasi

### Integrasi
- **Midtrans** — Payment gateway
- **WhatsApp Business API** — Messaging platform
- **Firebase Cloud Messaging** — Push notifications
- **Google Maps API** — Peta lokasi masjid
- **Cloudinary** — Image storage & optimization

### DevOps
- **Docker & Docker Compose** — Containerization
- **GitHub Actions** — CI/CD pipeline
- **Nginx** — Reverse proxy & load balancer
- **PM2** — Process manager untuk Node.js

---

## 🚀 Getting Started

### Prasyarat

Pastikan Anda telah menginstal:

- **Node.js** >= 20.x LTS
- **PostgreSQL** >= 16.x
- **Redis** >= 7.x
- **Docker** >= 24.x (opsional, untuk development dengan container)
- **Git** >= 2.40

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/amanah-masjid/amanah-masjid.git
cd amanah-masjid

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env

# 4. Setup database
npx prisma migrate dev --name init
npx prisma db seed

# 5. Jalankan development server
npm run dev
```

### Environment Variables

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/amanah_masjid"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# AI Services
OPENAI_API_KEY="sk-your-openai-key"
OCR_SERVICE_URL="http://localhost:3001"

# WhatsApp
WHATSAPP_API_TOKEN="your-whatsapp-token"
WHATSAPP_PHONE_ID="your-phone-id"
WHATSAPP_VERIFY_TOKEN="your-verify-token"

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION=false

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"

# App Config
APP_URL="http://localhost:3000"
APP_PORT=3000
NODE_ENV="development"
```

---

## 📁 Struktur Project

```
amanah-masjid/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (auth)/             # Auth pages (login, register)
│   │   ├── 📁 (dashboard)/        # Dashboard pages
│   │   ├── 📁 api/                # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/             # React components
│   │   ├── 📁 ui/                 # Base UI components
│   │   ├── 📁 forms/              # Form components
│   │   ├── 📁 layouts/            # Layout components
│   │   └── 📁 features/           # Feature-specific components
│   ├── 📁 lib/                    # Utilities & helpers
│   │   ├── 📁 api/                # API client functions
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 utils/              # Utility functions
│   │   └── 📁 validations/        # Zod schemas
│   ├── 📁 server/                 # Backend logic
│   │   ├── 📁 controllers/        # Request handlers
│   │   ├── 📁 services/           # Business logic
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 models/             # Database models
│   │   └── 📁 jobs/               # Background jobs
│   ├── 📁 ai/                     # AI/ML modules
│   │   ├── 📁 ocr/                # OCR engine
│   │   ├── 📁 chatbot/            # AI chatbot
│   │   ├── 📁 whatsapp/           # WhatsApp bot
│   │   └── 📁 fraud-detection/    # Fraud detection model
│   └── 📁 types/                  # TypeScript type definitions
├── 📁 prisma/                     # Prisma schema & migrations
├── 📁 public/                     # Static assets
├── 📁 tests/                      # Test files
├── 📁 docs/                       # Documentation
├── 📁 docker/                     # Docker configurations
├── .env.example
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Overview

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/forgot-password` | Reset password |

### Masjid
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/mosques` | Daftar semua masjid |
| GET | `/api/mosques/:id` | Detail masjid |
| POST | `/api/mosques` | Buat masjid baru |
| PUT | `/api/mosques/:id` | Update data masjid |
| DELETE | `/api/mosques/:id` | Hapus masjid |

### Donasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/donations` | Daftar donasi |
| POST | `/api/donations` | Buat donasi baru |
| GET | `/api/donations/:id` | Detail donasi |
| POST | `/api/donations/:id/verify` | Verifikasi donasi |
| GET | `/api/donations/report` | Laporan donasi |

### Program
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/programs` | Daftar program |
| POST | `/api/programs` | Buat program baru |
| PUT | `/api/programs/:id` | Update program |
| POST | `/api/programs/:id/register` | Daftar peserta |
| GET | `/api/programs/:id/report` | Laporan program |

### AI Services
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/ai/ocr/scan` | Scan kuitansi |
| POST | `/api/ai/chat` | AI chatbot |
| POST | `/api/ai/whatsapp/webhook` | WhatsApp webhook |

---

## 🤝 Contributing

Kami menyambut kontribusi dari siapa saja! Silakan baca panduan kontribusi berikut:

1. **Fork** repository ini
2. **Buat branch** fitur: `git checkout -b feature/nama-fitur`
3. **Commit** perubahan: `git commit -m 'feat: menambahkan fitur baru'`
4. **Push** ke branch: `git push origin feature/nama-fitur`
5. Buat **Pull Request**

### Commit Conventions

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: menambahkan fitur donasi recurring
fix: memperbaiki bug validasi form
docs: update dokumentasi API
style: formatting kode
refactor: refactor service donasi
test: menambahkan unit test
chore: update dependencies
```

---

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Amanah Masjid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Kontak

- **Website**: [amanahmasjid.id](https://amanahmasjid.id)
- **Email**: info@amanahmasjid.id
- **WhatsApp**: +62 812 3456 7890

---

<p align="center">
  Dibuat dengan ❤️ untuk kemajuan masjid di Indonesia
  <br>
  <strong>Amanah Masjid</strong> &copy; 2026
</p>
