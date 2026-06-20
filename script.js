import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-supabase-anon-key');

let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase Client initialized successfully!");
  } catch (err) {
    console.error("Error creating Supabase client:", err);
  }
} else {
  console.warn("Supabase not configured. Falling back to LocalStorage mode.");
}

/* ============================================
   AMANAH MASJID — Interactive JavaScript
   Animations, Counters, Scroll Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // === Scroll Progress Bar ===
  const scrollProgress = document.getElementById('scrollProgress');
  
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // === Navbar Scroll Effect ===
  const navbar = document.getElementById('navbar');
  
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // === Back to Top Button ===
  const backToTop = document.getElementById('backToTop');
  
  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Combined scroll handler (performance: single listener)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateBackToTop();
        handleScrollAnimations();
        ticking = false;
      });
      ticking = true;
    }
  });

  // === Mobile Menu Toggle ===
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // === Scroll Animations (Intersection Observer) ===
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation delay based on sibling index
        const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
        let staggerIndex = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) staggerIndex = i;
        });
        
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, staggerIndex * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // Fallback for elements already in view
  function handleScrollAnimations() {
    // handled by IntersectionObserver above
  }

  // === Animated Number Counter ===
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeOut * target;
      
      // Format number: if target has decimal, format with 1 decimal, else no decimal
      let formatted;
      if (target % 1 === 0) {
        formatted = Math.floor(currentValue).toLocaleString('id-ID');
      } else {
        formatted = currentValue.toFixed(1).replace('.', ',');
      }
      
      el.textContent = prefix + formatted + (progress >= 1 ? (suffix || '') : '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }
    
    requestAnimationFrame(updateCount);
  }

  // Observe counter elements
  const counterElements = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => counterObserver.observe(el));

  // === Donation Amount Buttons ===
  const amountBtns = document.querySelectorAll('.amount-btn');
  let selectedAmount = 250000;

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.dataset.amount);
      
      // Add a subtle scale animation
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 200);
    });
  });

  // Hubungkan tombol "Donasi Sekarang" di Landing Page ke Portal Donatur
  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Buka portal dashboard
      dashboardPortal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Langsung arahkan ke Portal Donatur
      loginGate.style.display = 'none';
      donorPortalContainer.style.display = 'flex';
      donorPortalContainer.style.width = '100%';
      donorPortalContainer.style.height = '100%';
      
      populateMosquesDropdown();
      if (donorSelectMosque) {
        populateDonorProgramsDropdown(donorSelectMosque.value);
        donorSelectMethod.dispatchEvent(new Event('change'));
      }
      
      syncDonorDashboardView();
      
      // Klik tab "Kirim Donasi" secara otomatis
      const donorSendLink = donorPortalContainer.querySelector('[data-tab="donor-send"]');
      if (donorSendLink) {
        donorSendLink.click();
      }
      
      // Isi otomatis nominal donasi sesuai pilihan di landing page
      const donorInputAmount = document.getElementById('donorInputAmount');
      if (donorInputAmount) {
        donorInputAmount.value = selectedAmount;
        donorInputAmount.dispatchEvent(new Event('input'));
      }
    });
  }

  // === Contact Form Handler ===
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Log the message details for debugging/admin visibility
    console.log(`Pesan masuk dari ${name} (${email}) - Subjek: ${subject}`);
    console.log(`Isi Pesan: ${message}`);
    
    // Button loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simulate sending
    setTimeout(() => {
      submitBtn.textContent = 'Terkirim! ✅';
      submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      
      // Reset form
      contactForm.reset();
      
      // Show success notification
      showNotification(`Jazakallah khair, ${name}! Pesan Anda mengenai "${subject}" telah terkirim.`);
      
      // Reset button
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
      }, 3000);
    }, 1500);
  });

  // === Notification System ===
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 16px 28px;
      background: rgba(16, 185, 129, 0.95);
      color: white;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
      backdrop-filter: blur(10px);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-width: 90%;
      text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(100px)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  // === Parallax Effect for Hero ===
  const mosqueArt = document.querySelector('.hero-mosque-art');
  
  if (mosqueArt) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const parallaxSpeed = 0.3;
        mosqueArt.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }
    });
  }

  // === Mouse Glow Effect on Feature Cards ===
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.background = `
        radial-gradient(
          300px circle at ${x}px ${y}px,
          rgba(16, 185, 129, 0.06),
          transparent 60%
        ),
        rgba(255, 255, 255, 0.04)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // === Tilt Effect on Program Cards ===
  // === Tilt Effect on Program Cards (Event Delegation) ===
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.program-card');
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 8;
    const tiltY = (x - 0.5) * -8;
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });
  
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.program-card');
    if (!card) return;
    
    const related = e.relatedTarget;
    if (related && card.contains(related)) return;
    
    card.style.transform = '';
  });

  // === Typing Effect for Hero Badge ===
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      heroBadge.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      heroBadge.style.opacity = '1';
      heroBadge.style.transform = 'translateY(0)';
    }, 300);
  }

  // === Progress Bar Animation on Scroll ===
  const progressFills = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
          fill.style.width = targetWidth;
        }, 300);
        
        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  progressFills.forEach(fill => progressObserver.observe(fill));

  // === Active Nav Link Highlighting ===
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navMenu.querySelectorAll('a').forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.style.color = '#34d399';
          } else if (!link.classList.contains('btn-nav-cta')) {
            link.style.color = '';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // === Initialize ===
  updateScrollProgress();
  updateNavbar();
  updateBackToTop();
  updateActiveNav();

  // === Easter Egg: Konami Code ===
  let konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
      showNotification('🎉 Rahasia terbuka! Jazakallah khairan telah mengunjungi Amanah Masjid!');
      document.body.style.transition = 'filter 1s';
      document.body.style.filter = 'hue-rotate(60deg)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 3000);
    }
  });

  // ==================== DASHBOARD PORTAL LOGIC & REFACTORED HANDLERS ====================
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  const closeDashboardBtn = document.getElementById('closeDashboardBtn');
  const dashboardPortal = document.getElementById('dashboardPortal');

  // DKM Sidebar Switcher
  const dkmSidebarLinks = document.querySelectorAll('#dkmPortalContainer .sidebar-link');
  const dkmPanels = document.querySelectorAll('#dkmPortalContainer .dashboard-panel');
  dkmSidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      dkmSidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const tab = link.getAttribute('data-tab');
      dkmPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === 'panel-' + tab) {
          panel.classList.add('active');
        }
      });
    });
  });

  // Set Date on Dashboard Header
  const dashboardDate = document.getElementById('dashboardDate');
  if (dashboardDate) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    dashboardDate.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }

  // === AI Chatbot Asisten Virtual (Database Connected) ===
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');

  function getContextMosqueName() {
    const donorPortal = document.getElementById('donorPortalContainer');
    if (donorPortal && donorPortal.style.display !== 'none') {
      const selectMosque = document.getElementById('donorSelectMosque');
      if (selectMosque) return selectMosque.value;
    }
    return activeMosqueName;
  }

  function appendChatMessage(container, sender, text, reference = '') {
    if (!container) return null;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    let contentHtml = `<div class="message-content">${text}`;
    if (reference) {
      contentHtml += `<div class="chat-reference-box">📚 Rujukan: ${reference}</div>`;
    }
    contentHtml += `</div>`;
    msg.innerHTML = contentHtml;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return msg;
  }

  // DKM Chatbot
  if (chatbotForm && chatbotInput && chatbotMessages) {
    chatbotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = chatbotInput.value.trim();
      if (!query) return;
      
      appendChatMessage(chatbotMessages, 'user', query);
      chatbotInput.value = '';
      
      const typingIndicator = appendChatMessage(chatbotMessages, 'assistant', 'Asisten AI sedang memikirkan jawaban...');
      
      setTimeout(async () => {
        try {
          const response = await getAIResponse(query);
          typingIndicator.remove();
          appendChatMessage(chatbotMessages, 'assistant', response.text, response.reference);
        } catch (err) {
          console.error("Asisten AI error:", err);
          typingIndicator.remove();
          appendChatMessage(chatbotMessages, 'assistant', 'Maaf, terjadi kesalahan saat menghubungi Asisten AI. Silakan coba beberapa saat lagi.');
        }
      }, 1000);
    });

    suggestionBtns.forEach(btn => {
      if (!btn.classList.contains('donor-suggestion-btn')) {
        btn.addEventListener('click', () => {
          chatbotInput.value = btn.getAttribute('data-query');
          chatbotForm.dispatchEvent(new Event('submit'));
        });
      }
    });
  }

  // Donor Chatbot (Tanya Ustadz AI)
  const donorChatbotForm = document.getElementById('donorChatbotForm');
  const donorChatbotInput = document.getElementById('donorChatbotInput');
  const donorChatbotMessages = document.getElementById('donorChatbotMessages');
  const donorSuggestionBtns = document.querySelectorAll('.donor-suggestion-btn');

  if (donorChatbotForm && donorChatbotInput && donorChatbotMessages) {
    donorChatbotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = donorChatbotInput.value.trim();
      if (!query) return;
      
      appendChatMessage(donorChatbotMessages, 'user', query);
      donorChatbotInput.value = '';
      
      const typingIndicator = appendChatMessage(donorChatbotMessages, 'assistant', 'Asisten AI sedang memikirkan jawaban...');
      
      setTimeout(async () => {
        try {
          const response = await getAIResponse(query);
          typingIndicator.remove();
          appendChatMessage(donorChatbotMessages, 'assistant', response.text, response.reference);
        } catch (err) {
          console.error("Ustadz AI error:", err);
          typingIndicator.remove();
          appendChatMessage(donorChatbotMessages, 'assistant', 'Maaf, terjadi kesalahan saat menghubungi Ustadz AI. Silakan coba beberapa saat lagi.');
        }
      }, 1000);
    });

    donorSuggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        donorChatbotInput.value = btn.getAttribute('data-query');
        donorChatbotForm.dispatchEvent(new Event('submit'));
      });
    });
  }

  async function getAIResponse(query) {
    const q = query.toLowerCase();
    const currentMosqueName = getContextMosqueName();
    const currentMosque = mosques.find(m => m.name === currentMosqueName) || mosques[0];
    const filteredProgs = mosquePrograms.filter(p => p.mosqueName === currentMosqueName);
    
    // 1. Local quick matches for specific queries
    if (q.includes('zakat') && (q.includes('hitung') || q.includes('gaji') || q.includes('nominal'))) {
      const salaryMatch = query.match(/\d[\d.]*/);
      let income = 10000000;
      if (salaryMatch) {
        income = parseInt(salaryMatch[0].replace(/\./g, ''));
      }
      const monthlyNishab = 6600000;
      
      if (income >= monthlyNishab) {
        const zakat = income * 0.025;
        return {
          text: `Berdasarkan nominal penghasilan bulanan Anda sebesar **Rp ${income.toLocaleString('id-ID')}**, Anda telah memenuhi kriteria **wajib zakat** (nisab bulanan ~Rp 6,6 juta). <br><br>Zakat penghasilan bulanan yang wajib disalurkan (2,5%) adalah **Rp ${zakat.toLocaleString('id-ID')}**. <br><br>Apakah Anda ingin menyalurkan zakat ini sekarang?`,
          reference: 'QS. Al-Baqarah: 267 & Ketetapan BAZNAS 2026'
        };
      } else {
        return {
          text: `Penghasilan bulanan Anda sebesar **Rp ${income.toLocaleString('id-ID')}** berada di bawah batas minimal nishab wajib zakat (~Rp 6,6 juta). <br><br>Anda tidak memiliki kewajiban zakat maal/penghasilan bulanan, namun sangat dianjurkan untuk menyalurkan infaq/sedekah sesuai kelapangan hati.`,
          reference: 'Hadits Riwayat Bukhari & Muslim'
        };
      }
    } else if (q.includes('sholat') || q.includes('jadwal') || q.includes('maghrib') || q.includes('subuh')) {
      return {
        text: `Berikut adalah Jadwal Shalat hari ini untuk wilayah ${currentMosque.city} & sekitarnya:<br><br>🌅 **Subuh**: 04:35 WIB<br>☀️ **Dzuhur**: 11:54 WIB<br>🌤️ **Ashar**: 15:15 WIB<br>🌇 **Maghrib**: 17:50 WIB<br>🌙 **Isya**: 19:04 WIB<br><br>Ayo shalat berjamaah tepat waktu di ${currentMosque.name}!`,
        reference: 'QS. An-Nisa: 103'
      };
    } else if (q.includes('program') || q.includes('sosial') || q.includes('aktif') || q.includes('bantu')) {
      if (filteredProgs.length === 0) {
        return {
          text: `Saat ini belum ada program sosial khusus di ${currentMosque.name}. Namun, Anda tetap dapat menyalurkan donasi ke program **Infaq Umum Masjid** untuk operasional harian kemakmuran masjid.`,
          reference: 'QS. Al-Maidah: 2'
        };
      }
      
      let progText = `Berikut adalah program sosial aktif di **${currentMosque.name}** yang membutuhkan dukungan Anda:<br><br>`;
      filteredProgs.forEach((p, index) => {
        const pct = Math.min((p.collected / p.target) * 100, 100).toFixed(0);
        progText += `${index + 1}. **${p.emoji} ${p.title}** (Target: Rp ${p.target.toLocaleString('id-ID')} - Terkumpul: Rp ${p.collected.toLocaleString('id-ID')} [${pct}%])<br>`;
      });
      progText += `<br>Anda dapat berdonasi langsung ke program-program tersebut melalui portal Donatur.`;
      
      return {
        text: progText,
        reference: 'QS. Al-Maidah: 2'
      };
    } else if (q.includes('saldo') || q.includes('kas') || q.includes('keuangan')) {
      return {
        text: `Jumlah saldo kas masjid **${currentMosque.name}** saat ini tercatat sebesar **Rp ${currentMosque.cash.toLocaleString('id-ID')}**.<br><br>Seluruh laporan pemasukan dan pengeluaran donasi dikelola secara transparan dan amanah melalui sistem terpadu kami.`,
        reference: 'Laporan Keuangan Transparan Amanah Masjid'
      };
    } else if (q.includes('dkm') || q.includes('pengurus') || q.includes('kontak') || q.includes('ketua')) {
      return {
        text: `Pengurus DKM **${currentMosque.name}** dipimpin oleh **${currentMosque.dkm}**. <br>Jika Anda memerlukan koordinasi lebih lanjut, Anda dapat menghubungi no resmi WhatsApp pengurus di **${currentMosque.phone}** atau berkunjung ke kantor sekretariat masjid.`,
        reference: `Profil Pengurus DKM ${currentMosque.name}`
      };
    }

    // 2. Google Gemini API integration if API key is provided
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey && !geminiApiKey.includes('your-gemini-api-key')) {
      try {
        const systemPrompt = `Anda adalah Ustadz AI, asisten virtual cerdas untuk ${currentMosque.name}.
Tugas Anda:
1. Menjawab pertanyaan keagamaan (fiqih, akidah, akhlak, ibadah, dll.) dengan ramah, sopan, dan sesuai ajaran Islam Ahlussunnah wal Jama'ah.
2. Selalu menyapa dengan salam Islam yang hangat ("Assalamu'alaikum").
3. Menyertakan rujukan ringkas dari Al-Quran atau Hadits sahih jika relevan.
4. Jika pertanyaan sangat kompleks atau memerlukan fatwa khusus, sarankan berkonsultasi langsung dengan Ustadz ${currentMosque.dkm} di masjid setelah shalat.
5. Format jawaban menggunakan tag HTML sederhana (gunakan <br> untuk baris baru, <strong> untuk teks tebal). Gunakan Bahasa Indonesia yang baik.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nPertanyaan jamaah: ${query}` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) {
            // Clean markdown style bold to html bold
            replyText = replyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            replyText = replyText.replace(/\*(.*?)\*/g, '<em>$1</em>');
            replyText = replyText.replace(/\n/g, '<br>');
            
            let referenceText = `Ustadz AI ${currentMosque.name}`;
            const refMatch = replyText.match(/(?:Rujukan|Referensi|QS\.|HR\.)\s*:\s*([^\n<]+)/i);
            if (refMatch) {
              referenceText = refMatch[0].trim();
            }

            return {
              text: replyText,
              reference: referenceText
            };
          }
        }
      } catch (err) {
        console.error("Gemini API call failed:", err);
      }
    }

    // 3. Fallback response with setup advice
    return {
      text: `Jazakallahu khairan atas pertanyaan Anda. Untuk pertanyaan keagamaan/fiqih mendalam, Anda dapat berkonsultasi langsung dengan ustadz atau dewan pembina **${currentMosque.name}** setelah shalat berjamaah.<br><br><small style="color: var(--text-muted); display: block; margin-top: 1rem; border-top: 1px dashed #ddd; padding-top: 0.5rem;">💡 <strong>Developer Tip:</strong> Hubungkan Ustadz AI ke Google Gemini API secara langsung dengan mendefinisikan <code>VITE_GEMINI_API_KEY</code> pada file <code>.env</code> Anda.</small>`,
      reference: `Layanan Umat ${currentMosque.name}`
    };
  }

  // === WhatsApp Simulator (Database Connected) ===
  const waForm = document.getElementById('waForm');
  const waInput = document.getElementById('waInput');
  const waChatBody = document.getElementById('waChatBody');
  const btnWaCmds = document.querySelectorAll('.btn-wa-cmd');

  if (waForm && waInput && waChatBody) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = waInput.value.trim();
      if (!text) return;
      
      appendWaMessage('outgoing', text);
      waInput.value = '';
      
      setTimeout(() => {
        const botReply = getWaBotReply(text);
        appendWaMessage('incoming', botReply);
      }, 700);
    });

    btnWaCmds.forEach(btn => {
      btn.addEventListener('click', () => {
        waInput.value = btn.getAttribute('data-cmd');
        waForm.dispatchEvent(new Event('submit'));
      });
    });
  }

  function appendWaMessage(type, text) {
    const msg = document.createElement('div');
    msg.className = `wa-message ${type}`;
    msg.innerHTML = text;
    waChatBody.appendChild(msg);
    waChatBody.scrollTop = waChatBody.scrollHeight;
  }

  function getWaBotReply(cmd) {
    const c = cmd.toLowerCase().trim();
    const currentMosqueName = getContextMosqueName();
    const currentMosque = mosques.find(m => m.name === currentMosqueName) || mosques[0];
    const filteredProgs = mosquePrograms.filter(p => p.mosqueName === currentMosqueName);
    
    if (c === '/bantuan' || c === '/help') {
      return `🤖 *Layanan WhatsApp Bot ${currentMosque.name}*<br><br>Ketik perintah berikut:<br>👉 */jadwal* - Jadwal sholat hari ini<br>👉 */donasi* - Mulai donasi cepat<br>👉 */saldo* - Saldo kas masjid terkini<br>👉 */program* - Info program sosial aktif<br>👉 */zakat* - Info & hitung zakat cepat<br><br>Jazakallah khairan!`;
    } else if (c === '/jadwal' || c === '/sholat') {
      return `📅 *Jadwal Shalat Hari Ini (${currentMosque.city})*:<br>• Subuh: 04:35 WIB<br>• Dzuhur: 11:54 WIB<br>• Ashar: 15:15 WIB<br>• Maghrib: 17:50 WIB<br>• Isya: 19:04 WIB`;
    } else if (c === '/donasi' || c === '/infaq') {
      return `🤲 *Mulai Proses Donasi Digital ke ${currentMosque.name}*<br><br>Silakan pilih jenis donasi:<br>1️⃣ *Infaq Umum Masjid*<br>2️⃣ *Zakat Maal / Penghasilan*<br>3️⃣ *Program Sosial Aktif*<br><br>_Ketik angka pilihan Anda (Contoh: 1)_`;
    } else if (c === '1') {
      return `💰 *Berapa nominal infaq yang ingin Anda salurkan ke ${currentMosque.name}?*<br>Contoh: ketik *100000* untuk Rp 100.000.`;
    } else if (c === '2') {
      return `🧮 *Berapa nominal zakat yang ingin Anda salurkan ke ${currentMosque.name}?*<br>Contoh: ketik *250000* untuk Rp 250.000.`;
    } else if (c === '3') {
      if (filteredProgs.length === 0) {
        return `Maaf, saat ini belum ada program sosial khusus di masjid ini. Silakan ketik *1* untuk Infaq Umum.`;
      }
      let progListText = `Silakan pilih Program Sosial tujuan Anda:<br>`;
      filteredProgs.forEach((p, idx) => {
        progListText += `${idx + 4}️⃣ *${p.title}*<br>`;
      });
      return progListText;
    } else if (parseInt(c) >= 1000) {
      const bcaNum = currentMosque.bankBca || '123-456-7890';
      return `✅ *Konfirmasi Donasi Anda*:<br>📌 Jenis: Donasi Digital<br>💰 Nominal: Rp ${parseInt(c).toLocaleString('id-ID')}<br>🕌 Tujuan: ${currentMosque.name}<br><br>Silakan transfer ke rekening:<br>*Bank BCA - ${bcaNum} a.n. ${currentMosque.name}*<br><br>Setelah transfer, kirimkan foto kuitansi bukti transfer Anda untuk verifikasi OCR otomatis!`;
    } else if (c === '/saldo' || c === '/laporan') {
      return `📊 *Saldo Keuangan ${currentMosque.name}*<br>Total Kas saat ini: *Rp ${currentMosque.cash.toLocaleString('id-ID')}* (Transparan & Terbuka).<br><br>Laporan selengkapnya dapat dipantau secara real-time di portal dashboard kami.`;
    } else if (c === '/program') {
      if (filteredProgs.length === 0) {
        return `Saat ini tidak ada program aktif di ${currentMosque.name}.`;
      }
      let progText = `🤝 *Program Sosial ${currentMosque.name} Aktif*:<br>`;
      filteredProgs.forEach((p, idx) => {
        const pct = Math.min((p.collected / p.target) * 100, 100).toFixed(0);
        progText += `${idx + 1}. *${p.title}* (Terkumpul ${pct}% dari target Rp ${p.target.toLocaleString('id-ID')})<br>`;
      });
      return progText;
    } else if (c === '/zakat') {
      return `🧮 *Kalkulator Zakat Penghasilan*<br>Zakat wajib 2.5% dikeluarkan apabila penghasilan bulanan Anda mencapai nishab (~Rp 6.6jt).<br><br>Ketik *zakat [nominal]* untuk menghitung cepat. Contoh: *zakat 10000000*`;
    } else if (c.startsWith('zakat ')) {
      const amtStr = c.replace('zakat ', '').replace(/\./g, '');
      const amt = parseInt(amtStr);
      if (isNaN(amt)) return `Format tidak valid. Contoh ketik: *zakat 10000000*`;
      if (amt >= 6600000) {
        return `🧮 *Kalkulator Zakat*:<br>Penghasilan: Rp ${amt.toLocaleString('id-ID')}<br>Zakat Wajib (2.5%): *Rp ${(amt * 0.025).toLocaleString('id-ID')}*<br><br>Hukum: *Wajib mengeluarkan zakat* (Telah mencapai nishab).`;
      } else {
        return `🧮 *Kalkulator Zakat*:<br>Penghasilan: Rp ${amt.toLocaleString('id-ID')}<br>Hukum: *Tidak wajib zakat* (Di bawah batas nishab).`;
      }
    } else {
      const choice = parseInt(c);
      if (!isNaN(choice) && choice >= 4 && choice < 4 + filteredProgs.length) {
        const selectedProg = filteredProgs[choice - 4];
        return `Anda memilih program *${selectedProg.title}*.<br>Ketik nominal donasi Anda. Contoh: *500000*`;
      }
      return `Perintah tidak dikenali. Silakan ketik */bantuan* untuk melihat menu bot WhatsApp. 🤲`;
    }
  }

  // === Tambah Program Sosial Baru (Database Persisted) ===
  const newProgramForm = document.getElementById('newProgramForm');
  if (newProgramForm) {
    newProgramForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('programTitle').value.trim();
      const desc = document.getElementById('programDesc').value.trim();
      const target = parseInt(document.getElementById('programTarget').value);
      const tag = document.getElementById('programTag').value;
      const emoji = document.getElementById('programEmoji').value.trim() || '🕋';
      
      const newProg = {
        mosqueName: activeMosqueName,
        emoji: emoji,
        title: title,
        desc: desc,
        target: target,
        collected: 0,
        tag: tag
      };
      
      mosquePrograms.push(newProg);
      localStorage.setItem('mosque_programs', JSON.stringify(mosquePrograms));

      if (supabase) {
        try {
          await supabase.from('programs').insert([{
            mosque_name: activeMosqueName,
            emoji: emoji,
            title: title,
            desc_text: desc,
            target: target,
            collected: 0,
            tag: tag
          }]);
          
          // Refresh local programs list to get Supabase IDs
          const { data } = await supabase.from('programs').select('*');
          if (data) {
            mosquePrograms = data.map(p => ({
              id: p.id,
              mosqueName: p.mosque_name,
              emoji: p.emoji,
              title: p.title,
              desc: p.desc_text,
              target: parseFloat(p.target) || 0,
              collected: parseFloat(p.collected) || 0,
              tag: p.tag
            }));
          }
        } catch (err) {
          console.error("Failed to save program to Supabase:", err);
        }
      }
      
      await addComplianceLog(activeMosqueName, `<strong>Program Baru dibuat</strong>: ${title} oleh Admin`, 'Admin');
      
      syncDkmDashboard(activeMosqueName);
      
      newProgramForm.reset();
      showNotification('Sukses! Program sosial baru berhasil didaftarkan ke database. 🎉');
    });
  }

  // ==================== MULTI-ROLE & REGISTRATION LOGIC ====================
  // Force reset database to clean state (run once when script updates to zeroed-out state)
  const DB_VERSION = "v4_zeroed_real";
  if (localStorage.getItem("db_version") !== DB_VERSION) {
    localStorage.removeItem("mosques");
    localStorage.removeItem("mosque_programs");
    localStorage.removeItem("mosque_donations");
    localStorage.removeItem("donor_activities");
    localStorage.removeItem("mosque_logs");
    localStorage.setItem("db_version", DB_VERSION);
  }

  // 1. LocalStorage Databases & Fallbacks
  let defaultMosques = [
    { name: 'Masjid Al-Ikhlas', city: 'Jakarta Pusat', address: 'Jl. Masjid Raya No. 7, Jakarta Pusat 10110', dkm: 'H. Ahmad Fauzi', phone: '+62 812 3456 7890', cash: 0, bankBca: '123-456-7890', bankMandiri: '987-654-3210', enableWa: true, jamaah: 0 },
    { name: 'Masjid Ar-Rahman', city: 'Bandung', address: 'Jl. Diponegoro No. 12, Bandung', dkm: 'Ustadz Syahrul', phone: '+62 813 9081 2234', cash: 0, bankBca: '111-222-3333', bankMandiri: '444-555-6666', enableWa: true, jamaah: 0 }
  ];

  let defaultPrograms = [
    { mosqueName: 'Masjid Al-Ikhlas', emoji: '🕋', title: 'Beasiswa Tahfidz Al-Quran', desc: 'Program beasiswa untuk penghafal Al-Quran, mencakup biaya pendidikan, tempat tinggal, dan bimbingan tahfidz intensif.', target: 100000000, collected: 0, tag: 'active' },
    { mosqueName: 'Masjid Al-Ikhlas', emoji: '🍲', title: 'Dapur Ramadhan', desc: 'Program penyediaan makanan berbuka puasa gratis untuk masyarakat sekitar masjid selama bulan Ramadhan.', target: 50000000, collected: 0, tag: 'active' },
    { mosqueName: 'Masjid Al-Ikhlas', emoji: '🏗️', title: 'Renovasi Masjid', desc: 'Program renovasi dan perluasan area sholat untuk mengakomodasi jamaah yang semakin bertambah.', target: 500000000, collected: 0, tag: 'upcoming' },
    { mosqueName: 'Masjid Ar-Rahman', emoji: '🍲', title: 'Dapur Ramadhan', desc: 'Pemberian takjil gratis untuk jamaah.', target: 30000000, collected: 0, tag: 'active' },
    { mosqueName: 'Masjid Ar-Rahman', emoji: '🏗️', title: 'Renovasi Kubah', desc: 'Pengecatan dan penambalan kubah masjid.', target: 50000000, collected: 0, tag: 'active' }
  ];

  let defaultDonations = [];
  let defaultDonorActivities = [];
  let defaultLogs = [];

  let mosques = [];
  let mosquePrograms = [];
  let mosqueDonations = [];
  let donorActivities = [];
  let mosqueLogs = [];

  async function loadAllData() {
    if (supabase) {
      try {
        const [
          { data: dbMosques, error: errMosques },
          { data: dbPrograms, error: errPrograms },
          { data: dbDonations, error: errDonations },
          { data: dbActivities, error: errActivities },
          { data: dbLogs, error: errLogs }
        ] = await Promise.all([
          supabase.from('mosques').select('*'),
          supabase.from('programs').select('*'),
          supabase.from('donations').select('*'),
          supabase.from('donor_activities').select('*'),
          supabase.from('mosque_logs').select('*')
        ]);

        if (errMosques) throw errMosques;
        if (errPrograms) throw errPrograms;
        if (errDonations) throw errDonations;
        if (errActivities) throw errActivities;
        if (errLogs) throw errLogs;

        mosques = dbMosques.map(m => ({
          name: m.name,
          city: m.city,
          address: m.address,
          dkm: m.dkm,
          phone: m.phone,
          cash: parseFloat(m.cash) || 0,
          bankBca: m.bank_bca,
          bankMandiri: m.bank_mandiri,
          enableWa: m.enable_wa,
          jamaah: m.jamaah || 0
        }));

        mosquePrograms = dbPrograms.map(p => ({
          id: p.id,
          mosqueName: p.mosque_name,
          emoji: p.emoji,
          title: p.title,
          desc: p.desc_text,
          target: parseFloat(p.target) || 0,
          collected: parseFloat(p.collected) || 0,
          tag: p.tag
        }));

        mosqueDonations = dbDonations.map(d => ({
          id: d.id,
          mosqueName: d.mosque_name,
          sender: d.sender,
          bank: d.bank,
          amount: parseFloat(d.amount) || 0,
          risk: d.risk,
          status: d.status
        }));

        donorActivities = dbActivities.map(a => ({
          sender: a.sender,
          time: a.time_str,
          desc: a.desc_text,
          tag: a.tag
        }));

        mosqueLogs = dbLogs.map(l => ({
          mosqueName: l.mosque_name,
          time: l.time_str,
          desc: l.desc_text,
          tag: l.tag
        }));

        console.log("Successfully synced all data from Supabase Cloud!");
      } catch (err) {
        console.error("Supabase sync failed, falling back to LocalStorage:", err);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }

    // Refresh UI with synced values
    populateMosquesDropdown();
    populateLoginMosquesDropdown();
    if (donorSelectMosque) {
      populateDonorProgramsDropdown(donorSelectMosque.value);
    }
    updateLandingPageStats();
    syncDkmDashboard(activeMosqueName);
    syncDonorDashboardView();
  }

  function loadFromLocalStorage() {
    if (!localStorage.getItem('mosques')) {
      localStorage.setItem('mosques', JSON.stringify(defaultMosques));
    }
    mosques = JSON.parse(localStorage.getItem('mosques'));

    if (!localStorage.getItem('mosque_programs')) {
      localStorage.setItem('mosque_programs', JSON.stringify(defaultPrograms));
    }
    mosquePrograms = JSON.parse(localStorage.getItem('mosque_programs'));

    if (!localStorage.getItem('mosque_donations')) {
      localStorage.setItem('mosque_donations', JSON.stringify(defaultDonations));
    }
    mosqueDonations = JSON.parse(localStorage.getItem('mosque_donations'));

    if (!localStorage.getItem('donor_activities')) {
      localStorage.setItem('donor_activities', JSON.stringify(defaultDonorActivities));
    }
    donorActivities = JSON.parse(localStorage.getItem('donor_activities'));

    if (!localStorage.getItem('mosque_logs')) {
      localStorage.setItem('mosque_logs', JSON.stringify(defaultLogs));
    }
    mosqueLogs = JSON.parse(localStorage.getItem('mosque_logs'));
  }

  // Global State for active logged in DKM mosque
  let activeMosqueName = 'Masjid Al-Ikhlas';

  // Compliance Log Helper
  async function addComplianceLog(mosqueName, desc, tag) {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newLog = {
      mosqueName,
      time: timeStr,
      desc,
      tag
    };
    mosqueLogs.unshift(newLog);
    localStorage.setItem('mosque_logs', JSON.stringify(mosqueLogs));

    if (supabase) {
      try {
        await supabase.from('mosque_logs').insert([{
          mosque_name: mosqueName,
          time_str: timeStr,
          desc_text: desc,
          tag: tag
        }]);
      } catch (err) {
        console.error("Failed to insert log to Supabase:", err);
      }
    }
  }

  // Update stats on landing page
  // Render dynamic programs list on landing page
  function renderLandingPagePrograms() {
    const programsGrid = document.querySelector('.programs-grid');
    if (!programsGrid) return;
    programsGrid.innerHTML = '';
    
    // Show active programs of all registered mosques
    const activeProgs = mosquePrograms.filter(p => p.tag === 'active');
    
    if (activeProgs.length === 0) {
      programsGrid.innerHTML = '<p class="description" style="text-align: center; grid-column: 1/-1; padding: 2rem;">Belum ada program sosial aktif.</p>';
      return;
    }
    
    activeProgs.slice(0, 3).forEach(p => {
      const pct = Math.min((p.collected / p.target) * 100, 100).toFixed(0);
      
      let collectedText = 'Rp ' + p.collected.toLocaleString('id-ID');
      let targetText = 'Rp ' + p.target.toLocaleString('id-ID');
      
      if (p.collected >= 1000000) {
        collectedText = 'Rp ' + (p.collected / 1000000).toFixed(1).replace('.', ',') + ' Juta';
      }
      if (p.target >= 1000000) {
        targetText = 'Rp ' + (p.target / 1000000).toFixed(0) + ' Juta';
      }
      
      let bgGrad = 'linear-gradient(135deg, #065f46, #0a0f1e)';
      if (p.emoji === '🍲') bgGrad = 'linear-gradient(135deg, #7c2d12, #0a0f1e)';
      else if (p.emoji === '🏗️') bgGrad = 'linear-gradient(135deg, #1e3a5f, #0a0f1e)';
      
      const card = document.createElement('div');
      card.className = 'program-card animate-on-scroll animated';
      
      card.innerHTML = `
        <div class="program-card-image" style="background: ${bgGrad};">
          ${p.emoji}
        </div>
        <div class="program-card-body">
          <span class="program-tag active">Sedang Berjalan</span>
          <h3>${p.title} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(${p.mosqueName})</span></h3>
          <p>${p.desc}</p>
          <div class="program-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="progress-info">
              <span>Terkumpul: ${collectedText}</span>
              <span>Target: ${targetText}</span>
            </div>
          </div>
        </div>
      `;
      programsGrid.appendChild(card);
    });
  }

  // Update stats on landing page
  function updateLandingPageStats() {
    const activeMosques = JSON.parse(localStorage.getItem('mosques')) || mosques;
    const activePrograms = JSON.parse(localStorage.getItem('mosque_programs')) || mosquePrograms;
    const activeDonations = JSON.parse(localStorage.getItem('mosque_donations')) || mosqueDonations;

    const totalMosquesCount = activeMosques.length;
    const totalJamaahCount = activeMosques.reduce((sum, m) => sum + (m.jamaah || 0), 0);
    const totalDonationsAmount = activeDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalActivePrograms = activePrograms.filter(p => p.tag === 'active').length;

    // Hero stats
    const heroStatsEl = document.querySelector('.hero-stats');
    if (heroStatsEl) {
      const statItems = heroStatsEl.querySelectorAll('.stat-item');
      if (statItems.length >= 3) {
        const mosqueNum = statItems[0].querySelector('.stat-number');
        if (mosqueNum) {
          mosqueNum.dataset.target = totalMosquesCount;
          mosqueNum.textContent = '0';
        }
        const jamaahNum = statItems[1].querySelector('.stat-number');
        if (jamaahNum) {
          jamaahNum.dataset.target = totalJamaahCount;
          jamaahNum.textContent = '0';
        }
        const donationNum = statItems[2].querySelector('.stat-number');
        if (donationNum) {
          if (totalDonationsAmount === 0) {
            donationNum.dataset.target = '0';
            donationNum.dataset.suffix = '';
            donationNum.dataset.prefix = 'Rp ';
          } else if (totalDonationsAmount < 1000000) {
            donationNum.dataset.target = totalDonationsAmount;
            donationNum.dataset.suffix = '';
            donationNum.dataset.prefix = 'Rp ';
          } else {
            donationNum.dataset.target = parseFloat((totalDonationsAmount / 1000000).toFixed(1));
            donationNum.dataset.suffix = ' Juta+';
            donationNum.dataset.prefix = 'Rp ';
          }
          donationNum.textContent = '0';
        }
      }
    }

    // Stats Section cards
    const statsSection = document.getElementById('stats');
    if (statsSection) {
      const cards = statsSection.querySelectorAll('.stat-card');
      if (cards.length >= 4) {
        const mosqueCardNum = cards[0].querySelector('.stat-card-number');
        if (mosqueCardNum) {
          mosqueCardNum.dataset.target = totalMosquesCount;
          mosqueCardNum.textContent = '0';
        }
        const jamaahCardNum = cards[1].querySelector('.stat-card-number');
        if (jamaahCardNum) {
          jamaahCardNum.dataset.target = totalJamaahCount;
          jamaahCardNum.textContent = '0';
        }
        const donationCardNum = cards[2].querySelector('.stat-card-number');
        if (donationCardNum) {
          donationCardNum.dataset.target = totalDonationsAmount;
          donationCardNum.dataset.prefix = 'Rp ';
          donationCardNum.textContent = '0';
        }
        const programCardNum = cards[3].querySelector('.stat-card-number');
        if (programCardNum) {
          programCardNum.dataset.target = totalActivePrograms;
          programCardNum.textContent = '0';
        }
      }
    }

    // Render dynamic landing page programs
    renderLandingPagePrograms();

    // Animate counters
    const targetCounterElements = document.querySelectorAll('[data-target]');
    targetCounterElements.forEach(el => animateCounter(el));
  }

  // 2. Synchronize Dashboards
  function syncDkmDashboard(mosqueName) {
    const currentMosque = mosques.find(m => m.name === mosqueName);
    if (!currentMosque) return;
    
    // Update labels and titles
    document.querySelectorAll('.dkm-mosque-title').forEach(el => el.textContent = currentMosque.name);
    const adminNameEl = document.querySelector('.admin-name');
    if (adminNameEl) adminNameEl.textContent = currentMosque.dkm;
    
    // Update cash value
    const cashEl = document.getElementById('dkmCashValue');
    if (cashEl) {
      cashEl.textContent = 'Rp ' + currentMosque.cash.toLocaleString('id-ID');
    }

    // Update jamaah value
    const jamaahEl = document.getElementById('dkmJamaahValue');
    if (jamaahEl) {
      jamaahEl.textContent = (currentMosque.jamaah || 0).toLocaleString('id-ID') + ' Orang';
    }
    
    // Refresh program lists on DKM panel
    const dkmProgramsList = document.getElementById('dashboardProgramsList');
    if (dkmProgramsList) {
      dkmProgramsList.innerHTML = '';
      const filteredProgs = mosquePrograms.filter(p => p.mosqueName === mosqueName);
      if (filteredProgs.length === 0) {
        dkmProgramsList.innerHTML = '<p class="description" style="text-align: center; padding: 1.5rem; width: 100%;">Belum ada program sosial aktif. Buat program baru di sebelah kiri!</p>';
      } else {
        filteredProgs.forEach(p => {
          const pct = Math.min((p.collected / p.target) * 100, 100).toFixed(0);
          const card = document.createElement('div');
          card.className = 'program-item-card';
          card.innerHTML = `
            <div class="program-item-header">
              <span class="program-item-emoji">${p.emoji}</span>
              <div class="program-item-title">
                <h4>${p.title}</h4>
                <span class="program-tag ${p.tag}">${p.tag === 'active' ? 'Sedang Berjalan' : 'Akan Datang'}</span>
              </div>
            </div>
            <div class="program-item-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${pct}%;"></div>
              </div>
              <div class="progress-info">
                <span>Terkumpul: Rp ${p.collected.toLocaleString('id-ID')}</span>
                <span>Target: Rp ${p.target.toLocaleString('id-ID')}</span>
              </div>
            </div>
          `;
          dkmProgramsList.appendChild(card);
        });
      }
    }

    // Refresh dynamic programs chart
    const programsChart = document.getElementById('dkmProgramsChart');
    if (programsChart) {
      programsChart.innerHTML = '';
      const filteredProgs = mosquePrograms.filter(p => p.mosqueName === mosqueName);
      if (filteredProgs.length === 0) {
        programsChart.innerHTML = '<p class="description" style="text-align: center; width: 100%; padding: 2rem;">Belum ada program aktif untuk di-render.</p>';
      } else {
        filteredProgs.forEach(p => {
          const pct = Math.min((p.collected / p.target) * 100, 100).toFixed(0);
          const barWrapper = document.createElement('div');
          barWrapper.className = 'chart-program-bar-wrapper';
          barWrapper.innerHTML = `
            <div class="chart-program-bar" style="height: ${Math.max(parseInt(pct), 8)}%;" data-pct="${pct}%"></div>
            <span class="chart-program-label" title="${p.title}">${p.title}</span>
          `;
          programsChart.appendChild(barWrapper);
        });
      }
    }

    // Refresh Compliance Audit Log List
    const auditList = document.getElementById('dkmAuditList');
    if (auditList) {
      auditList.innerHTML = '';
      const filteredLogs = mosqueLogs.filter(l => l.mosqueName === mosqueName);
      if (filteredLogs.length === 0) {
        auditList.innerHTML = '<li class="audit-item" style="text-align: center; color: var(--text-muted);">Belum ada riwayat aktivitas sistem.</li>';
      } else {
        filteredLogs.slice(0, 5).forEach(l => {
          const item = document.createElement('li');
          item.className = 'audit-item';
          item.innerHTML = `
            <span class="audit-time">${l.time}</span>
            <span class="audit-desc">${l.desc}</span>
            <span class="audit-tag level-${l.tag.toLowerCase()}">${l.tag}</span>
          `;
          auditList.appendChild(item);
        });
      }
    }

    // Refresh Donations Table
    syncDkmDonationsTable(mosqueName);
  }

  function syncDkmDonationsTable(mosqueName) {
    const tableBody = document.getElementById('donationsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const filteredDonations = mosqueDonations.filter(d => d.mosqueName === mosqueName);
    if (filteredDonations.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Belum ada donasi masuk ke masjid ini.</td></tr>';
    } else {
      filteredDonations.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${d.id}</td>
          <td>${d.sender}</td>
          <td>${d.bank}</td>
          <td>Rp ${d.amount.toLocaleString('id-ID')}</td>
          <td><span class="risk-badge ${parseFloat(d.risk) > 0.3 ? 'medium' : 'low'}">${d.risk}</span></td>
          <td><span class="status-badge ${d.status.includes('Review') ? 'review' : 'verified'}">${d.status}</span></td>
        `;
        tableBody.appendChild(row);
      });
    }
  }

  function syncDonorDashboardView() {
    const donorStatTotal = document.getElementById('donorStatTotal');
    const donorStatMosques = document.getElementById('donorStatMosques');
    const donorStatCerts = document.getElementById('donorStatCerts');
    
    const donorName = document.querySelector('.donor-name')?.textContent || 'Hamba Allah';
    const myActivities = donorActivities.filter(a => a.sender === donorName);
    
    let totalAmount = 0;
    let distinctMosques = new Set();
    
    myActivities.forEach(act => {
      const amtMatch = act.desc.match(/Rp\s*([\d.]+)/);
      if (amtMatch) {
        totalAmount += parseInt(amtMatch[1].replace(/\./g, ''));
      }
      
      const mosqueMatch = act.desc.match(/ke\s+([A-Za-z'0-9\s\-]+)(?:\s+\(|$)/);
      if (mosqueMatch) {
        distinctMosques.add(mosqueMatch[1].trim());
      }
    });
    
    if (donorStatTotal) donorStatTotal.textContent = 'Rp ' + totalAmount.toLocaleString('id-ID');
    if (donorStatMosques) donorStatMosques.textContent = `${distinctMosques.size} Masjid`;
    if (donorStatCerts) donorStatCerts.textContent = `${myActivities.length} Sertifikat`;

    const donorStatTransCount = document.getElementById('donorStatTransCount');
    if (donorStatTransCount) {
      donorStatTransCount.textContent = `Dari ${myActivities.length} Transaksi`;
    }
    const donorStatRegions = document.getElementById('donorStatRegions');
    if (donorStatRegions) {
      donorStatRegions.textContent = distinctMosques.size > 0 ? Array.from(distinctMosques).join(', ') : 'Belum ada penyaluran';
    }

    // Render list
    const donorRecentList = document.getElementById('donorRecentList');
    if (donorRecentList) {
      donorRecentList.innerHTML = '';
      if (myActivities.length === 0) {
        donorRecentList.innerHTML = '<li class="audit-item" style="text-align: center; color: var(--text-muted);">Belum ada riwayat aktivitas.</li>';
      } else {
        myActivities.forEach(act => {
          const item = document.createElement('li');
          item.className = 'audit-item';
          item.innerHTML = `
            <span class="audit-time">${act.time}</span>
            <span class="audit-desc">${act.desc}</span>
            <span class="audit-tag level-auto">${act.tag}</span>
          `;
          donorRecentList.appendChild(item);
        });
      }
    }

    // Populate history table
    const donorHistoryTableBody = document.getElementById('donorHistoryTableBody');
    if (donorHistoryTableBody) {
      donorHistoryTableBody.innerHTML = '';
      if (myActivities.length === 0) {
        donorHistoryTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Belum ada riwayat donasi.</td></tr>';
      } else {
        myActivities.forEach((act, idx) => {
          const row = document.createElement('tr');
          let mosqueName = 'Masjid Al-Ikhlas';
          let programName = 'Infaq Umum';
          let amount = 'Rp 0';
          let method = 'Transfer BCA';
          
          const amtMatch = act.desc.match(/Rp\s*([\d.]+)/);
          if (amtMatch) amount = 'Rp ' + amtMatch[1];
          
          const mosqueMatch = act.desc.match(/ke\s+([A-Za-z'0-9\s\-]+)(?:\s+\(|$)/);
          if (mosqueMatch) mosqueName = mosqueMatch[1].trim();
          
          const progMatch = act.desc.match(/\(([^)]+)\)/);
          if (progMatch) programName = progMatch[1];
          
          row.innerHTML = `
            <td>#DON-D${9000 - idx}</td>
            <td>${mosqueName}</td>
            <td>${programName}</td>
            <td>${amount}</td>
            <td>${act.time}</td>
            <td>${method}</td>
            <td><span class="status-badge verified">Sukses</span></td>
          `;
          donorHistoryTableBody.appendChild(row);
        });
      }
    }
  }

  // 3. Dropdowns Populators
  const donorSelectMosque = document.getElementById('donorSelectMosque');
  function populateMosquesDropdown() {
    if (!donorSelectMosque) return;
    donorSelectMosque.innerHTML = '';
    mosques.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.name;
      opt.textContent = `${m.name} (${m.city})`;
      donorSelectMosque.appendChild(opt);
    });
  }

  const loginSelectMosque = document.getElementById('loginSelectMosque');
  function populateLoginMosquesDropdown() {
    if (!loginSelectMosque) return;
    loginSelectMosque.innerHTML = '';
    mosques.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.name;
      opt.textContent = `${m.name} (${m.city})`;
      loginSelectMosque.appendChild(opt);
    });
  }

  const donorSelectProgram = document.getElementById('donorSelectProgram');
  function populateDonorProgramsDropdown(mosqueName) {
    if (!donorSelectProgram) return;
    donorSelectProgram.innerHTML = '';
    
    const filteredProgs = mosquePrograms.filter(p => p.mosqueName === mosqueName);
    filteredProgs.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.title;
      opt.textContent = `${p.emoji} ${p.title}`;
      donorSelectProgram.appendChild(opt);
    });
    
    // Fallback general infaq option
    const optGeneral = document.createElement('option');
    optGeneral.value = 'Infaq Umum Masjid';
    optGeneral.textContent = '🤲 Infaq Umum Masjid';
    donorSelectProgram.appendChild(optGeneral);
  }

  // Run on start
  // Load data (Supabase with LocalStorage fallback)
  await loadAllData();

  // Mosque Registration Logic
  const btnRegisterMosque = document.getElementById('btnRegisterMosque');
  const registerMosqueModal = document.getElementById('registerMosqueModal');
  const closeRegisterModalBtn = document.getElementById('closeRegisterModalBtn');
  const mosqueRegisterForm = document.getElementById('mosqueRegisterForm');
  const registerSuccessModal = document.getElementById('registerSuccessModal');
  const btnGoToLogin = document.getElementById('btnGoToLogin');

  if (btnRegisterMosque && registerMosqueModal && closeRegisterModalBtn) {
    btnRegisterMosque.addEventListener('click', (e) => {
      e.preventDefault();
      registerMosqueModal.classList.add('active');
    });

    closeRegisterModalBtn.addEventListener('click', () => {
      registerMosqueModal.classList.remove('active');
    });

    if (mosqueRegisterForm) {
      mosqueRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regMosqueName').value.trim();
        const address = document.getElementById('regMosqueAddress').value.trim();
        const city = document.getElementById('regMosqueCity').value.trim();
        const dkm = document.getElementById('regDkmName').value.trim();
        const phone = document.getElementById('regDkmPhone').value.trim();

        // Check if name already registered
        if (mosques.some(m => m.name.toLowerCase() === name.toLowerCase())) {
          showNotification('⚠️ Masjid dengan nama tersebut sudah terdaftar.');
          return;
        }

        // Save new mosque
        const newMosque = { name, city, address, dkm, phone, cash: 0, bankBca: '135-246-7890', bankMandiri: '975-312-4680', enableWa: true, jamaah: Math.floor(100 + Math.random() * 400) };
        mosques.push(newMosque);
        localStorage.setItem('mosques', JSON.stringify(mosques));

        if (supabase) {
          try {
            await supabase.from('mosques').insert([{
              name,
              city,
              address,
              dkm,
              phone,
              cash: 0,
              bank_bca: '135-246-7890',
              bank_mandiri: '975-312-4680',
              enable_wa: true,
              jamaah: newMosque.jamaah
            }]);
          } catch (err) {
            console.error(err);
          }
        }

        // Create default Infaq program for this mosque
        const newDefaultProg = {
          mosqueName: name,
          emoji: '🤲',
          title: 'Infaq Umum Masjid',
          desc: 'Operasional dan kemakmuran masjid sehari-hari.',
          target: 20000000,
          collected: 0,
          tag: 'active'
        };
        mosquePrograms.push(newDefaultProg);
        localStorage.setItem('mosque_programs', JSON.stringify(mosquePrograms));

        if (supabase) {
          try {
            await supabase.from('programs').insert([{
              mosque_name: name,
              emoji: '🤲',
              title: 'Infaq Umum Masjid',
              desc_text: 'Operasional dan kemakmuran masjid sehari-hari.',
              target: 20000000,
              collected: 0,
              tag: 'active'
            }]);
          } catch (err) {
            console.error(err);
          }
        }

        // Write registration log
        await addComplianceLog(name, `<strong>Registrasi Sukses</strong>: Masjid terdaftar di database`, 'System');

        // Generate temporary credentials
        const tempUsername = 'dkm_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const tempPassword = Math.random().toString(36).substring(2, 10);

        document.getElementById('successMosqueName').textContent = name;
        document.getElementById('successUsername').textContent = tempUsername;
        document.getElementById('successPassword').textContent = tempPassword;

        registerMosqueModal.classList.remove('active');
        registerSuccessModal.classList.add('active');
        mosqueRegisterForm.reset();
        
        populateMosquesDropdown();
        updateLandingPageStats();
      });
    }

    if (btnGoToLogin) {
      btnGoToLogin.addEventListener('click', () => {
        registerSuccessModal.classList.remove('active');
        openDashboardBtn.dispatchEvent(new Event('click'));
      });
    }
  }

  // 4. Switcher Gate & DKM/Donor Portals Routing
  const loginGate = document.getElementById('loginGate');
  const dkmPortalContainer = document.getElementById('dkmPortalContainer');
  const donorPortalContainer = document.getElementById('donorPortalContainer');
  const btnSelectDkm = document.getElementById('btnSelectDkm');
  const btnSelectDonor = document.getElementById('btnSelectDonor');
  const btnSwitchPortals = document.querySelectorAll('.btn-switch-portal');
  const closePortalGateBtn = document.getElementById('closePortalGateBtn');
  const closeDonorPortalBtn = document.getElementById('closeDonorPortalBtn');
  
  const loginOptionsWrapper = document.getElementById('loginOptionsWrapper');
  const dkmLoginFormWrapper = document.getElementById('dkmLoginFormWrapper');
  const btnCancelDkmLogin = document.getElementById('btnCancelDkmLogin');
  const dkmRealLoginForm = document.getElementById('dkmRealLoginForm');

  function resetPortalViews() {
    loginGate.style.display = 'flex';
    dkmPortalContainer.style.display = 'none';
    donorPortalContainer.style.display = 'none';
    if (loginOptionsWrapper && dkmLoginFormWrapper) {
      dkmLoginFormWrapper.style.display = 'none';
      loginOptionsWrapper.style.display = 'flex';
      const loginGateSub = document.getElementById('loginGateSub');
      if (loginGateSub) loginGateSub.textContent = 'Pilih jenis akses akun untuk melanjutkan ke sistem';
    }
  }

  if (openDashboardBtn) {
    const newOpenDashboardBtn = openDashboardBtn.cloneNode(true);
    openDashboardBtn.parentNode.replaceChild(newOpenDashboardBtn, openDashboardBtn);
    
    newOpenDashboardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dashboardPortal.classList.add('active');
      document.body.style.overflow = 'hidden';
      resetPortalViews();
    });
  }

  if (closePortalGateBtn) {
    closePortalGateBtn.addEventListener('click', () => {
      dashboardPortal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (btnSelectDkm && loginOptionsWrapper && dkmLoginFormWrapper) {
    btnSelectDkm.addEventListener('click', () => {
      loginOptionsWrapper.style.display = 'none';
      dkmLoginFormWrapper.style.display = 'block';
      const loginGateSub = document.getElementById('loginGateSub');
      if (loginGateSub) loginGateSub.textContent = 'Pilih masjid kelolaan dan masukkan kata sandi pengurus';
      populateLoginMosquesDropdown();
    });
  }

  if (btnCancelDkmLogin && loginOptionsWrapper && dkmLoginFormWrapper) {
    btnCancelDkmLogin.addEventListener('click', () => {
      dkmLoginFormWrapper.style.display = 'none';
      loginOptionsWrapper.style.display = 'flex';
      const loginGateSub = document.getElementById('loginGateSub');
      if (loginGateSub) loginGateSub.textContent = 'Pilih jenis akses akun untuk melanjutkan ke sistem';
    });
  }

  // LoadSettings implementation
  function loadMosqueSettings(mosqueName) {
    const currentMosque = mosques.find(m => m.name === mosqueName);
    if (!currentMosque) return;
    
    const settingsDkmName = document.getElementById('settingsDkmName');
    const settingsJamaah = document.getElementById('settingsJamaah');
    const settingsBankBca = document.getElementById('settingsBankBca');
    const settingsBankMandiri = document.getElementById('settingsBankMandiri');
    const settingsPhone = document.getElementById('settingsPhone');
    const settingsEnableWaBot = document.getElementById('settingsEnableWaBot');
    
    if (settingsDkmName) settingsDkmName.value = currentMosque.dkm || '';
    if (settingsJamaah) settingsJamaah.value = currentMosque.jamaah !== undefined ? currentMosque.jamaah : 0;
    if (settingsBankBca) settingsBankBca.value = currentMosque.bankBca || '';
    if (settingsBankMandiri) settingsBankMandiri.value = currentMosque.bankMandiri || '';
    if (settingsPhone) settingsPhone.value = currentMosque.phone || '';
    if (settingsEnableWaBot) settingsEnableWaBot.checked = currentMosque.enableWa !== false;
  }

  // Settings form submit handler
  const mosqueSettingsForm = document.getElementById('mosqueSettingsForm');
  if (mosqueSettingsForm) {
    mosqueSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const mosqueIndex = mosques.findIndex(m => m.name === activeMosqueName);
      if (mosqueIndex !== -1) {
        const dkmVal = document.getElementById('settingsDkmName').value.trim();
        const jamaahVal = parseInt(document.getElementById('settingsJamaah').value) || 0;
        const bcaVal = document.getElementById('settingsBankBca').value.trim();
        const mandiriVal = document.getElementById('settingsBankMandiri').value.trim();
        const phoneVal = document.getElementById('settingsPhone').value.trim();
        const enableWaVal = document.getElementById('settingsEnableWaBot').checked;

        mosques[mosqueIndex].dkm = dkmVal;
        mosques[mosqueIndex].jamaah = jamaahVal;
        mosques[mosqueIndex].bankBca = bcaVal;
        mosques[mosqueIndex].bankMandiri = mandiriVal;
        mosques[mosqueIndex].phone = phoneVal;
        mosques[mosqueIndex].enableWa = enableWaVal;
        
        localStorage.setItem('mosques', JSON.stringify(mosques));

        if (supabase) {
          try {
            await supabase.from('mosques').update({
              dkm: dkmVal,
              jamaah: jamaahVal,
              bank_bca: bcaVal,
              bank_mandiri: mandiriVal,
              phone: phoneVal,
              enable_wa: enableWaVal
            }).eq('name', activeMosqueName);
          } catch (err) {
            console.error("Failed to update settings in Supabase:", err);
          }
        }
        
        // Add log
        await addComplianceLog(activeMosqueName, `<strong>Profil & Setelan Masjid diperbarui</strong> oleh DKM`, 'Admin');
        
        // Sync
        syncDkmDashboard(activeMosqueName);
        updateLandingPageStats();
        showNotification('Pengaturan operasional masjid berhasil disimpan! 💾');
      }
    });
  }

  if (dkmRealLoginForm) {
    dkmRealLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selected = loginSelectMosque.value;
      activeMosqueName = selected;
      
      loginGate.style.display = 'none';
      dkmPortalContainer.style.display = 'flex';
      dkmPortalContainer.style.width = '100%';
      dkmPortalContainer.style.height = '100%';
      
      syncDkmDashboard(activeMosqueName);
      loadMosqueSettings(activeMosqueName);
      showNotification(`Berhasil masuk sebagai Pengurus DKM ${activeMosqueName}`);
      
      dkmRealLoginForm.reset();
      
      const summaryLink = dkmPortalContainer.querySelector('[data-tab="summary"]');
      if (summaryLink) summaryLink.click();
    });
  }

  if (btnSelectDonor) {
    btnSelectDonor.addEventListener('click', () => {
      loginGate.style.display = 'none';
      donorPortalContainer.style.display = 'flex';
      donorPortalContainer.style.width = '100%';
      donorPortalContainer.style.height = '100%';
      
      populateMosquesDropdown();
      if (donorSelectMosque) {
        populateDonorProgramsDropdown(donorSelectMosque.value);
        donorSelectMethod.dispatchEvent(new Event('change'));
      }
      
      syncDonorDashboardView();
      
      const donorSummaryLink = donorPortalContainer.querySelector('[data-tab="donor-summary"]');
      if (donorSummaryLink) donorSummaryLink.click();
    });
  }

  btnSwitchPortals.forEach(btn => {
    btn.addEventListener('click', () => {
      resetPortalViews();
    });
  });

  if (closeDashboardBtn) {
    closeDashboardBtn.addEventListener('click', () => {
      dashboardPortal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (closeDonorPortalBtn) {
    closeDonorPortalBtn.addEventListener('click', () => {
      dashboardPortal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Sidebar Switch Tabs for Donor
  const donorSidebarLinks = donorPortalContainer.querySelectorAll('.sidebar-link');
  const donorPanels = donorPortalContainer.querySelectorAll('.dashboard-panel');
  
  donorSidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      donorSidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const tab = link.getAttribute('data-tab');
      donorPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === 'panel-' + tab) {
          panel.classList.add('active');
        }
      });
      
      // Autolink to panel-donor-chatbot is handled automatically by data-tab naming standard
    });
  });

  // Calendar dates
  const dateClasses = document.querySelectorAll('.dashboardDateClass');
  if (dateClasses.length) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    dateClasses.forEach(dateEl => {
      dateEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    });
  }

  // Payment Dynamic Target Change with Mosque Object Read
  const donorSelectMethod = document.getElementById('donorSelectMethod');
  const paymentTargetAcc = document.getElementById('paymentTargetAcc');
  if (donorSelectMethod && paymentTargetAcc) {
    donorSelectMethod.addEventListener('change', () => {
      const method = donorSelectMethod.value;
      const mosqueName = donorSelectMosque.value;
      const targetMosque = mosques.find(m => m.name === mosqueName);
      
      if (!targetMosque) return;
      
      const bcaNum = targetMosque.bankBca || '123-456-7890';
      const mandiriNum = targetMosque.bankMandiri || '987-654-3210';
      
      if (method === 'BCA') {
        paymentTargetAcc.textContent = `Bank BCA: ${bcaNum} a.n. ${mosqueName}`;
      } else if (method === 'Mandiri') {
        paymentTargetAcc.textContent = `Bank Mandiri: ${mandiriNum} a.n. ${mosqueName}`;
      } else {
        paymentTargetAcc.textContent = `QRIS GOPAY/OVO: Pindai Barcode dynamic via Midtrans`;
      }
    });
  }

  if (donorSelectMosque) {
    donorSelectMosque.addEventListener('change', () => {
      const mosqueName = donorSelectMosque.value;
      populateDonorProgramsDropdown(mosqueName);
      donorSelectMethod.dispatchEvent(new Event('change'));
    });
  }

  // 5. OCR Scanner Demo Buttons & File Scan Handler
  const ocrDropzone = document.getElementById('ocrDropzone');
  const ocrFileInput = document.getElementById('ocrFileInput');
  const scannerLaser = document.getElementById('scannerLaser');
  const ocrResultForm = document.getElementById('ocrResultForm');
  const btnConfirmOcr = document.getElementById('btnConfirmOcr');
  const btnResetOcr = document.getElementById('btnResetOcr');

  if (ocrDropzone && ocrFileInput && scannerLaser) {
    ocrDropzone.addEventListener('click', () => ocrFileInput.click());
    ocrDropzone.addEventListener('dragover', (e) => { e.preventDefault(); ocrDropzone.classList.add('dragover'); });
    ocrDropzone.addEventListener('dragleave', () => ocrDropzone.classList.remove('dragover'));
    ocrDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      ocrDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) startOcrScan(e.dataTransfer.files[0]);
    });
    ocrFileInput.addEventListener('change', () => {
      if (ocrFileInput.files.length) startOcrScan(ocrFileInput.files[0]);
    });
  }

  function startOcrScan(file) {
    scannerLaser.style.display = 'block';
    ocrDropzone.style.opacity = '0.7';
    setTimeout(() => {
      scannerLaser.style.display = 'none';
      ocrDropzone.style.opacity = '1';
      ocrResultForm.style.display = 'block';
      
      const mockNames = ['Budi Santoso', 'Siti Rahma', 'Diana Putri', 'Faisal Akbar', 'Muhammad Rizky'];
      const mockBanks = ['BCA', 'BNI', 'Mandiri', 'BRI', 'BSI'];
      const mockAmounts = [150000, 200000, 500000, 1000000, 2500000];
      
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const randomBank = mockBanks[Math.floor(Math.random() * mockBanks.length)];
      const randomAmount = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
      
      document.getElementById('ocrSenderName').value = randomName;
      document.getElementById('ocrBankName').value = randomBank;
      document.getElementById('ocrDate').value = new Date().toLocaleString('id-ID');
      document.getElementById('ocrAmount').value = randomAmount.toLocaleString('id-ID');
      document.getElementById('ocrRiskScore').value = '0.04 (Sangat Aman)';
      document.getElementById('ocrStatus').value = '🟢 Auto Verifikasi';
      
      btnConfirmOcr.disabled = false;
      btnConfirmOcr.style.opacity = '1';
      btnConfirmOcr.style.cursor = 'pointer';
      
      showNotification('OCR Scan selesai! Data kuitansi berhasil diekstrak.');
      ocrResultForm.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  // DKM OCR Demo Shortcuts
  const btnDemoOcrs = document.querySelectorAll('.btn-demo-ocr');
  btnDemoOcrs.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-demo-type');
      let demoData = {};
      
      if (type === 'valid-1') {
        demoData = { sender: 'Budi Santoso', bank: 'BCA', amount: 250000, risk: '0.02 (Sangat Aman)', status: '🟢 Auto Verifikasi' };
      } else if (type === 'valid-2') {
        demoData = { sender: 'Siti Rahma', bank: 'Mandiri', amount: 1000000, risk: '0.04 (Sangat Aman)', status: '🟢 Auto Verifikasi' };
      } else {
        demoData = { sender: 'Faisal Akbar', bank: 'BRI', amount: 5000000, risk: '0.98 (RISIKO TINGGI)', status: '🔴 Duplikasi Kuitansi / Pixel Manipulasi Terdeteksi' };
      }
      
      scannerLaser.style.display = 'block';
      ocrDropzone.style.opacity = '0.7';
      
      setTimeout(() => {
        scannerLaser.style.display = 'none';
        ocrDropzone.style.opacity = '1';
        ocrResultForm.style.display = 'block';
        
        document.getElementById('ocrSenderName').value = demoData.sender;
        document.getElementById('ocrBankName').value = demoData.bank;
        document.getElementById('ocrDate').value = new Date().toLocaleString('id-ID');
        document.getElementById('ocrAmount').value = demoData.amount.toLocaleString('id-ID');
        document.getElementById('ocrRiskScore').value = demoData.risk;
        document.getElementById('ocrStatus').value = demoData.status;
        
        if (type === 'fraud') {
          showNotification('⚠️ Peringatan: Sistem AI mendeteksi kecurangan pada kuitansi!');
          addComplianceLog(activeMosqueName, `<strong>ALERT</strong>: Upaya manipulasi bukti bayar terdeteksi (Fraud Score: 0.98)`, 'Fraud');
          btnConfirmOcr.disabled = true;
          btnConfirmOcr.style.opacity = '0.5';
          btnConfirmOcr.style.cursor = 'not-allowed';
        } else {
          showNotification('OCR Scan selesai! Data kuitansi valid berhasil diekstrak.');
          btnConfirmOcr.disabled = false;
          btnConfirmOcr.style.opacity = '1';
          btnConfirmOcr.style.cursor = 'pointer';
        }
        ocrResultForm.scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    });
  });

  if (btnConfirmOcr) {
    btnConfirmOcr.addEventListener('click', async () => {
      const sender = document.getElementById('ocrSenderName').value;
      const bank = document.getElementById('ocrBankName').value;
      const amountStr = document.getElementById('ocrAmount').value;
      const amount = parseInt(amountStr.replace(/\./g, ''));
      const risk = document.getElementById('ocrRiskScore').value.split(' ')[0];
      
      // Update cash in active mosque database
      const mosqueIndex = mosques.findIndex(m => m.name === activeMosqueName);
      if (mosqueIndex !== -1) {
        mosques[mosqueIndex].cash += amount;
        localStorage.setItem('mosques', JSON.stringify(mosques));

        if (supabase) {
          try {
            await supabase.from('mosques').update({
              cash: mosques[mosqueIndex].cash
            }).eq('name', activeMosqueName);
          } catch (err) {
            console.error("Failed to update cash in Supabase:", err);
          }
        }
      }

      // Add to database donations
      const donId = '#DON-' + Math.floor(1025 + Math.random() * 8000);
      const newDon = {
        id: donId,
        mosqueName: activeMosqueName,
        sender,
        bank,
        amount,
        risk: risk + ' (Aman)',
        status: 'Otomatis Diterima'
      };
      mosqueDonations.push(newDon);
      localStorage.setItem('mosque_donations', JSON.stringify(mosqueDonations));

      if (supabase) {
        try {
          await supabase.from('donations').insert([{
            id: donId,
            mosque_name: activeMosqueName,
            sender: sender,
            bank: bank,
            amount: amount,
            risk: risk + ' (Aman)',
            status: 'Otomatis Diterima'
          }]);
        } catch (err) {
          console.error("Failed to save donation to Supabase:", err);
        }
      }

      // Log compliance
      await addComplianceLog(activeMosqueName, `<strong>Donasi Terverifikasi</strong> otomatis via OCR (Rp ${amount.toLocaleString('id-ID')}, ${sender})`, 'Auto');

      // Sync views
      syncDkmDashboard(activeMosqueName);
      updateLandingPageStats();
      
      ocrResultForm.style.display = 'none';
      ocrFileInput.value = '';
      showNotification('Sukses! Donasi berhasil dicatat dan saldo kas diperbarui.');
    });
  }

  if (btnResetOcr) {
    btnResetOcr.addEventListener('click', () => {
      ocrResultForm.style.display = 'none';
      ocrFileInput.value = '';
    });
  }

  // Donor OCR Scanner Demos & Handlers
  const donorOcrDropzone = document.getElementById('donorOcrDropzone');
  const donorOcrFileInput = document.getElementById('donorOcrFileInput');
  const donorScannerLaser = document.getElementById('donorScannerLaser');
  const donorOcrResultForm = document.getElementById('donorOcrResultForm');
  const donorOcrMessage = document.getElementById('donorOcrMessage');
  const btnConfirmDonorDonation = document.getElementById('btnConfirmDonorDonation');

  let donorUploadedAmount = 0;
  let donorUploadedName = 'Hamba Allah';

  if (donorOcrDropzone && donorOcrFileInput) {
    donorOcrDropzone.addEventListener('click', () => donorOcrFileInput.click());
    donorOcrDropzone.addEventListener('dragover', (e) => { e.preventDefault(); donorOcrDropzone.classList.add('dragover'); });
    donorOcrDropzone.addEventListener('dragleave', () => donorOcrDropzone.classList.remove('dragover'));
    donorOcrDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      donorOcrDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length) startDonorOcrScan(e.dataTransfer.files[0]);
    });
    donorOcrFileInput.addEventListener('change', () => {
      if (donorOcrFileInput.files.length) startDonorOcrScan(donorOcrFileInput.files[0]);
    });
  }

  function startDonorOcrScan(file) {
    const inputAmount = parseInt(document.getElementById('donorInputAmount').value);
    const inputName = document.getElementById('donorInputName').value.trim() || 'Hamba Allah';

    if (!inputAmount || inputAmount <= 0) {
      showNotification('Peringatan: Silakan masukkan nominal donasi terlebih dahulu!');
      donorOcrFileInput.value = '';
      return;
    }

    donorScannerLaser.style.display = 'block';
    donorOcrDropzone.style.opacity = '0.7';

    setTimeout(() => {
      donorScannerLaser.style.display = 'none';
      donorOcrDropzone.style.opacity = '1';
      donorOcrResultForm.style.display = 'block';
      
      donorUploadedAmount = inputAmount;
      donorUploadedName = inputName;

      donorOcrMessage.innerHTML = `Hasil Ekstraksi OCR: Kuitansi atas nama <strong>${inputName}</strong> sebesar <strong>Rp ${inputAmount.toLocaleString('id-ID')}</strong> terverifikasi valid sesuai input donasi. Tingkat Risiko: <strong>0.03 (Sangat Aman)</strong>.`;
      btnConfirmDonorDonation.style.display = 'inline-block';
      showNotification('OCR Scan bukti bayar sukses! Klik tombol di bawah untuk memproses.');
      donorOcrResultForm.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }

  // Donor Demo OCR clicks
  const btnDonorDemoOcrs = document.querySelectorAll('.btn-donor-demo-ocr');
  btnDonorDemoOcrs.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-demo-type');
      let amount = 250000;
      let senderName = 'Budi Santoso';
      
      if (type === 'valid-1') {
        amount = 250000;
        senderName = 'Budi Santoso';
      } else if (type === 'valid-2') {
        amount = 1000000;
        senderName = 'Siti Rahma';
      } else {
        amount = 5000000;
        senderName = 'Faisal Akbar (Palsu)';
      }
      
      const inputAmountEl = document.getElementById('donorInputAmount');
      const inputNameEl = document.getElementById('donorInputName');
      if (inputAmountEl) inputAmountEl.value = amount;
      if (inputNameEl) inputNameEl.value = senderName;

      donorScannerLaser.style.display = 'block';
      donorOcrDropzone.style.opacity = '0.7';

      setTimeout(() => {
        donorScannerLaser.style.display = 'none';
        donorOcrDropzone.style.opacity = '1';
        donorOcrResultForm.style.display = 'block';
        
        donorUploadedAmount = amount;
        donorUploadedName = senderName;
        
        if (type === 'fraud') {
          donorOcrMessage.innerHTML = `⚠️ <strong style="color: #ef4444;">Peringatan Fraud Score Tinggi!</strong> Kuitansi terindikasi manipulasi. Risk Score: <strong>0.98</strong>. Transaksi tidak dapat dilanjutkan otomatis.`;
          btnConfirmDonorDonation.style.display = 'none';
          showNotification('⚠️ Sistem mendeteksi bukti transfer palsu!');
          
          // Log compliance event to target mosque
          const currentMosqueName = donorSelectMosque.value;
          addComplianceLog(currentMosqueName, `<strong>ALERT</strong>: Upaya donasi manipulasi terdeteksi dari portal jamaah (Fraud Score: 0.98)`, 'Fraud');
        } else {
          donorOcrMessage.innerHTML = `Hasil Ekstraksi OCR: Kuitansi atas nama <strong>${senderName}</strong> sebesar <strong>Rp ${amount.toLocaleString('id-ID')}</strong> terverifikasi valid. Risk Score: <strong>0.03 (Sangat Aman)</strong>.`;
          btnConfirmDonorDonation.style.display = 'inline-block';
          showNotification('OCR Scan bukti bayar sukses!');
        }
        donorOcrResultForm.scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    });
  });

  if (btnConfirmDonorDonation) {
    btnConfirmDonorDonation.addEventListener('click', async () => {
      const selectedMosqueName = donorSelectMosque.value;
      const selectedProgramName = document.getElementById('donorSelectProgram').value;
      const method = donorSelectMethod.value;
      const donorInputNameVal = document.getElementById('donorInputName').value.trim() || 'Hamba Allah';
      
      const donorNameEl = document.querySelector('.donor-name');
      if (donorNameEl && donorInputNameVal !== 'Hamba Allah') {
        donorNameEl.textContent = donorInputNameVal;
      }
      
      // 1. Update Mosque Cash
      const mosqueIndex = mosques.findIndex(m => m.name === selectedMosqueName);
      if (mosqueIndex !== -1) {
        mosques[mosqueIndex].cash += donorUploadedAmount;
        localStorage.setItem('mosques', JSON.stringify(mosques));

        if (supabase) {
          try {
            await supabase.from('mosques').update({
              cash: mosques[mosqueIndex].cash
            }).eq('name', selectedMosqueName);
          } catch (err) {
            console.error(err);
          }
        }
      }

      // 2. Update Program Collected
      const programIndex = mosquePrograms.findIndex(p => p.mosqueName === selectedMosqueName && p.title === selectedProgramName);
      if (programIndex !== -1) {
        mosquePrograms[programIndex].collected += donorUploadedAmount;
        localStorage.setItem('mosque_programs', JSON.stringify(mosquePrograms));

        if (supabase && mosquePrograms[programIndex].id) {
          try {
            await supabase.from('programs').update({
              collected: mosquePrograms[programIndex].collected
            }).eq('id', mosquePrograms[programIndex].id);
          } catch (err) {
            console.error(err);
          }
        }
      }

      // 3. Add to Mosque Donations
      const donId = '#DON-' + Math.floor(1025 + Math.random() * 8000);
      const newDonation = {
        id: donId,
        mosqueName: selectedMosqueName,
        sender: donorUploadedName,
        bank: method,
        amount: donorUploadedAmount,
        risk: '0.03 (Aman)',
        status: 'Otomatis Diterima'
      };
      mosqueDonations.push(newDonation);
      localStorage.setItem('mosque_donations', JSON.stringify(mosqueDonations));

      if (supabase) {
        try {
          await supabase.from('donations').insert([{
            id: donId,
            mosque_name: selectedMosqueName,
            sender: donorUploadedName,
            bank: method,
            amount: donorUploadedAmount,
            risk: '0.03 (Aman)',
            status: 'Otomatis Diterima'
          }]);
        } catch (err) {
          console.error(err);
        }
      }

      // Log compliance event to target mosque
      await addComplianceLog(selectedMosqueName, `<strong>Donasi Masuk</strong> dari portal jamaah (Rp ${donorUploadedAmount.toLocaleString('id-ID')}, ${donorUploadedName})`, 'Auto');

      // 4. Add to Donor Activities
      const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const newActivity = {
        sender: donorInputNameVal,
        time: dateStr,
        desc: `Donasi <strong>Rp ${donorUploadedAmount.toLocaleString('id-ID')}</strong> ke ${selectedMosqueName} (${selectedProgramName})`,
        tag: 'Sukses'
      };
      donorActivities.push(newActivity);
      localStorage.setItem('donor_activities', JSON.stringify(donorActivities));

      if (supabase) {
        try {
          await supabase.from('donor_activities').insert([{
            sender: donorInputNameVal,
            time_str: dateStr,
            desc_text: `Donasi <strong>Rp ${donorUploadedAmount.toLocaleString('id-ID')}</strong> ke ${selectedMosqueName} (${selectedProgramName})`,
            tag: 'Sukses'
          }]);
        } catch (err) {
          console.error(err);
        }
      }

      // 5. Update Cert Recipient
      const certRecipient = document.getElementById('certRecipient');
      if (certRecipient) {
        certRecipient.textContent = donorUploadedName;
      }

      // Sync active DKM dashboard if it matches
      if (selectedMosqueName === activeMosqueName) {
        syncDkmDashboard(activeMosqueName);
      }

      // Sync donor view
      syncDonorDashboardView();
      updateLandingPageStats();

      // Reset form
      document.getElementById('donorSendForm').reset();
      donorOcrResultForm.style.display = 'none';
      donorOcrFileInput.value = '';
      showNotification('Jazakallah khair! Donasi berhasil diverifikasi dan disalurkan.');
      
      donorPortalContainer.querySelector('[data-tab="donor-summary"]').click();
    });
  }

  // 6. Dynamic Certificate Print Export
  const btnDownloadCert = document.getElementById('btnDownloadCert');
  if (btnDownloadCert) {
    btnDownloadCert.addEventListener('click', () => {
      const recipientName = document.getElementById('certRecipient')?.textContent || 'Hamba Allah';
      const refId = document.getElementById('certRecipient')?.closest('.cert-border')?.querySelector('.cert-id span')?.textContent || 'Ref ID: AM-CERT-9042';
      
      const printWindow = window.open('', '_blank', 'width=850,height=600');
      printWindow.document.write(`
        <html>
        <head>
          <title>Sertifikat Penghargaan - ${recipientName}</title>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              background-color: #030712;
              color: #f3f4f6;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .cert-border {
              border: 8px double #fbbf24;
              padding: 40px;
              width: 90%;
              max-width: 680px;
              text-align: center;
              border-radius: 12px;
              background: #0f172a;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
              position: relative;
            }
            .cert-header h4 {
              color: #fbbf24;
              font-size: 24px;
              margin: 0 0 10px 0;
              letter-spacing: 2px;
            }
            .cert-header span {
              color: #10b981;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .cert-body {
              margin: 40px 0;
            }
            .cert-text-intro {
              font-size: 14px;
              color: #9ca3af;
              margin-bottom: 10px;
            }
            .cert-recipient-name {
              font-size: 32px;
              font-weight: 800;
              color: #ffffff;
              margin: 10px 0;
              text-decoration: underline;
              text-underline-offset: 8px;
            }
            .cert-text-desc {
              font-size: 14px;
              color: #d1d5db;
              line-height: 1.6;
            }
            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 50px;
              border-top: 1px solid rgba(251, 191, 36, 0.2);
              padding-top: 20px;
            }
            .cert-sign {
              text-align: left;
            }
            .cert-sign span {
              font-size: 12px;
              color: #9ca3af;
              display: block;
            }
            .cert-sign::before {
              content: "Amanah DKM";
              font-family: 'Brush Script MT', cursive, Georgia, serif;
              font-size: 24px;
              color: #34d399;
              display: block;
              margin-bottom: 5px;
            }
            .cert-id span {
              font-size: 11px;
              color: #6b7280;
            }
            @media print {
              body {
                background: #ffffff;
                color: #000000;
              }
              .cert-border {
                border: 8px double #b45309;
                background: #ffffff;
                color: #000000;
                box-shadow: none;
                max-width: 100%;
                width: 100%;
                box-sizing: border-box;
              }
              .cert-header h4 {
                color: #b45309;
              }
              .cert-header span {
                color: #047857;
              }
              .cert-recipient-name {
                color: #000000;
              }
              .cert-text-desc {
                color: #1f2937;
              }
              .cert-sign::before {
                color: #047857;
              }
            }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="cert-header">
              <h4>SERTIFIKAT PENGHARGAAN</h4>
              <span>Amanah Masjid Indonesia</span>
            </div>
            <div class="cert-body">
              <p class="cert-text-intro">Penghargaan ini diberikan dengan tulus kepada:</p>
              <p class="cert-recipient-name">${recipientName}</p>
              <p class="cert-text-desc">Atas partisipasi aktif dan kedermawanannya dalam menyalurkan infaq, sedekah, dan zakat demi kemakmuran masjid di Indonesia secara amanah dan transparan melalui platform Amanah Masjid.</p>
            </div>
            <div class="cert-footer">
              <div class="cert-sign">
                <span>Pengurus DKM Amanah</span>
              </div>
              <div class="cert-id">
                <span>${refId}</span>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      showNotification('Membuka sertifikat cetak/PDF... 📥');
    });
  }
});