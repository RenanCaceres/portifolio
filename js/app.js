/* ==========================================================================
   RENAN CÁCERES — INTERACTIVE PORTFOLIO ENGINE (app.js)
   Features: Neural Canvas, Live GitHub Sync, Deep-Dive Modals,
             Interactive Terminal, Command Palette (Ctrl+K), i18n & Themes
   ========================================================================== */

(() => {
  const DATA = window.PORTFOLIO_DATA;
  let currentLang = localStorage.getItem("rc_lang") || "pt";
  let currentTheme = localStorage.getItem("rc_theme") || "cyber";
  let activeFilter = "all";
  let searchQuery = "";
  let typingTimeout = null;
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  // Apply stored theme immediately
  if (currentTheme !== "cyber") {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  /* --------------------------------------------------------------------------
     1. SCROLL PROGRESS & SPOTLIGHT TRACKING
     -------------------------------------------------------------------------- */
  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    const bar = document.getElementById("scroll-progress");
    if (bar) bar.style.width = `${scrolled}%`;
  });

  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".bento-card, .profile-showcase-card, .project-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
     2. INTERACTIVE NEURAL CONSTELLATION CANVAS
     -------------------------------------------------------------------------- */
  function initCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = Math.min(68, Math.floor((width * height) / 22000));
    const mouse = { x: -9999, y: -9999 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.8
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const dotColor = isLight ? "rgba(109, 40, 217, 0.35)" : "rgba(167, 139, 250, 0.45)";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 135) * (isLight ? 0.14 : 0.18);
            ctx.strokeStyle = isLight
              ? `rgba(109, 40, 217, ${alpha})`
              : `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 170) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - mDist / 170) * 0.32})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* --------------------------------------------------------------------------
     3. HERO TYPING EFFECT
     -------------------------------------------------------------------------- */
  function startTyping() {
    if (typingTimeout) clearTimeout(typingTimeout);
    const el = document.getElementById("typing-text");
    if (!el) return;

    const roles = DATA.i18n[currentLang].hero.roles;
    const currentRole = roles[roleIdx % roles.length];

    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    el.textContent = currentRole.substring(0, charIdx);

    let speed = isDeleting ? 28 : 52;
    if (!isDeleting && charIdx === currentRole.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 350;
    }

    typingTimeout = setTimeout(startTyping, speed);
  }

  /* --------------------------------------------------------------------------
     4. RENDER PROJECTS & ARCHITECTURE DEEP-DIVE MODAL
     -------------------------------------------------------------------------- */
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    const t = DATA.i18n[currentLang].projects;

    const filtered = DATA.projects.filter((p) => {
      const langData = p[currentLang];
      const matchesCategory =
        activeFilter === "all" ||
        (activeFilter === "featured" && p.featured) ||
        p.category === activeFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        langData.subtitle.toLowerCase().includes(query) ||
        langData.desc.toLowerCase().includes(query) ||
        p.tech.some((item) => item.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    grid.innerHTML = filtered
      .map((p) => {
        const d = p[currentLang];
        const spanClass = p.spanWide && activeFilter === "all" && !searchQuery ? "featured-span" : "";
        return `
        <article class="project-card ${spanClass}">
          <div class="project-banner" style="background: ${p.bannerGradient}"></div>
          <div class="project-body">
            <div class="project-top">
              <div class="project-badge-group">
                <span class="category-pill">${d.badge}</span>
                ${p.liveUrl ? `<span class="live-pill">● LIVE</span>` : ""}
              </div>
            </div>
            <h3 class="project-title">${p.name}</h3>
            <div class="project-subtitle">${d.subtitle}</div>
            <p class="project-desc">${d.desc}</p>
            <ul class="project-highlights">
              ${d.highlights.slice(0, 3).map((h) => `<li><span>${h}</span></li>`).join("")}
            </ul>
            <div class="tech-stack-row">
              ${p.tech.map((tech) => `<span class="tech-chip">${tech}</span>`).join("")}
            </div>
            <div class="project-footer">
              <div class="project-actions">
                <button class="btn btn-primary btn-sm" data-arch-id="${p.id}">
                  ⚡ ${t.btnArch}
                </button>
                <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  GitHub ↗
                </a>
                ${
                  p.liveUrl
                    ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">🌐 ${t.btnLive}</a>`
                    : ""
                }
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    // Attach modal triggers
    grid.querySelectorAll("[data-arch-id]").forEach((btn) => {
      btn.addEventListener("click", () => openArchModal(btn.getAttribute("data-arch-id")));
    });
  }

  function openArchModal(projectId) {
    const project = DATA.projects.find((p) => p.id === projectId);
    if (!project) return;
    const d = project[currentLang];
    const t = DATA.i18n[currentLang].projects;

    const modal = document.getElementById("arch-modal");
    const content = document.getElementById("arch-modal-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="margin-bottom: 18px;">
        <span class="category-pill">${d.badge}</span>
        <h2 style="font-family: var(--font-display); font-size: 1.85rem; margin-top: 10px;">${project.name}</h2>
        <p style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.88rem; margin-top: 4px;">${d.subtitle}</p>
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 22px; font-size: 0.98rem;">${d.desc}</p>

      <h4 style="font-family: var(--font-mono); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-secondary); margin-bottom: 10px;">
        ${currentLang === "pt" ? "Fluxo Arquitetural do Sistema" : "System Architecture Pipeline"}
      </h4>
      <div class="arch-flow">
        ${d.archFlow
          .map(
            (node) => `
          <div class="arch-node">
            <strong>${node.title}</strong>
            <span>${node.detail}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <h4 style="font-family: var(--font-mono); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-secondary); margin: 22px 0 12px;">
        ${currentLang === "pt" ? "Destaques de Engenharia & Regras de Negócio" : "Engineering Highlights & Business Logic"}
      </h4>
      <ul class="project-highlights" style="margin-bottom: 24px;">
        ${d.highlights.map((h) => `<li><span>${h}</span></li>`).join("")}
      </ul>

      <h4 style="font-family: var(--font-mono); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-secondary); margin-bottom: 10px;">
        Tech Stack
      </h4>
      <div class="tech-stack-row" style="margin-bottom: 26px;">
        ${project.tech.map((tech) => `<span class="tech-chip">${tech}</span>`).join("")}
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          💻 ${t.btnCode} ↗
        </a>
        ${
          project.liveUrl
            ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">🌐 ${t.btnLive} ↗</a>`
            : ""
        }
      </div>
    `;

    modal.classList.add("open");
  }

  /* --------------------------------------------------------------------------
     5. RENDER SKILLS MATRIX & TIMELINE
     -------------------------------------------------------------------------- */
  function renderSkillsAndTimeline() {
    const skillsGrid = document.getElementById("skills-grid");
    if (skillsGrid) {
      skillsGrid.innerHTML = DATA.skillsMatrix
        .map(
          (cat) => `
        <div class="skill-category-card">
          <div class="skill-cat-header">
            <div class="skill-cat-icon">${cat.icon}</div>
            <h3>${currentLang === "pt" ? cat.titlePt : cat.titleEn}</h3>
          </div>
          <div class="skill-items">
            ${cat.skills
              .map(
                (s) => `
              <div>
                <div class="skill-row-top">
                  <span>${s.name}</span>
                  <span class="skill-level-tag">${s.level}</span>
                </div>
                <div class="skill-bar-bg">
                  <div class="skill-bar-fill" style="width: ${s.pct}%"></div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("");
    }

    const timelineEl = document.getElementById("timeline-list");
    if (timelineEl) {
      timelineEl.innerHTML = DATA.timeline
        .map(
          (item) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-header">
            <h3 class="timeline-role">${currentLang === "pt" ? item.rolePt : item.roleEn}</h3>
            <span class="timeline-period">${currentLang === "pt" ? item.periodPt : item.periodEn}</span>
          </div>
          <div class="timeline-org">${item.org}</div>
          <p style="color: var(--text-secondary); font-size: 0.94rem;">
            ${currentLang === "pt" ? item.descPt : item.descEn}
          </p>
        </div>
      `
        )
        .join("");
    }
  }

  /* --------------------------------------------------------------------------
     6. INTERACTIVE DEV TERMINAL (renan@utfpr:~)
     -------------------------------------------------------------------------- */
  function initTerminal() {
    const body = document.getElementById("term-body");
    const input = document.getElementById("term-input");
    if (!body || !input) return;

    function printLine(html) {
      const div = document.createElement("div");
      div.className = "term-line";
      div.innerHTML = html;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function runCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      printLine(
        `<span class="term-prompt">renan@utfpr</span>:<span class="term-path">~/portfolio</span>$ ${rawCmd}`
      );

      if (!cmd) return;

      switch (cmd) {
        case "help":
          printLine(
            `<span style="color:#22d3ee">Comandos disponíveis / Available commands:</span>
  • <strong>whoami</strong>           → Resumo profissional e formação na UTFPR
  • <strong>projects</strong>         → Lista projetos principais com links
  • <strong>arch cyberguard</strong>  → Diagrama ASCII da arquitetura do CyberGuard Bot
  • <strong>arch beautyflow</strong>  → Diagrama ASCII do ecossistema BeautyFlow (API + Mobile)
  • <strong>cat focus.yaml</strong>   → Exibe o arquivo de configuração atual do GitHub
  • <strong>skills</strong>           → Resumo da Tech Stack (Backend, Full Stack, Mobile, DB, IA)
  • <strong>contact</strong>          → Links diretos (GitHub, LinkedIn, E-mails)
  • <strong>sudo hire renan</strong>  → Easter egg de recrutamento 🚀
  • <strong>clear</strong>            → Limpar tela do terminal`
          );
          break;

        case "whoami":
          printLine(
            `<span style="color:#a855f7; font-weight:700;">Renan Cáceres Anselmo (@RenanCaceres)</span>
📍 Cornélio Procópio, PR — Brasil
🎓 Tecnologia em Análise e Desenvolvimento de Sistemas @ UTFPR (2025–Presente)
🎓 Engenharia de Computação @ UTFPR (2022–2025)
🛡️ Diretor de RH & Criador do CyberGuard Bot no CyberGuard UTFPR
💡 Foco: Engenharia Backend, Sistemas Full Stack, Apps Mobile (React Native), PostgreSQL & IA Generativa.`
          );
          break;

        case "projects":
          printLine(
            DATA.projects
              .map(
                (p, idx) =>
                  `[${idx + 1}] <strong style="color:#22d3ee">${p.name}</strong> — ${p[currentLang].subtitle}\n    🔗 ${p.repoUrl}${p.liveUrl ? ` | 🌐 ${p.liveUrl}` : ""}`
              )
              .join("\n\n")
          );
          break;

        case "arch cyberguard":
          printLine(
            `<span style="color:#34d399">[CyberGuard Bot — Architecture Pipeline]</span>
┌────────────────────────────────────────────────────────────────────┐
│ Discord Gateway (Slash Commands, Modals, 16kHz Opus Voice Streams) │
└───────────────────────────────┬────────────────────────────────────┘
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ Core Engine (Node.js 18+ / Discord.js v14)                         │
│ ├─ Onboarding LGPD (AES-256-GCM Encryption + /meus-dados Portal)   │
│ ├─ ICP-Brasil / Gov.br Crypto PDF Validator (pdf-lib + pdfjs-dist) │
│ ├─ Ponto Eletrônico v2 (Voice Auto-Detect + Idle Check + Pódio)    │
│ └─ Atas com IA (Downsampling 16kHz Mono -> Gemini 2.5 Flash PDF)   │
└───────────────────────────────┬────────────────────────────────────┘
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ Cloud & Persistence: PostgreSQL (12 tables) • Notion API v3        │
│ Google Sheets (3 Abas) • Google Drive • Autonomous IMAP/SMTP       │
└────────────────────────────────────────────────────────────────────┘`
          );
          break;

        case "arch beautyflow":
          printLine(
            `<span style="color:#f43f5e">[BeautyFlow SaaS Ecosystem — API + Mobile]</span>
┌────────────────────────────────────────────────────────────────────┐
│ 📱 BeautyFlow Mobile (React Native + Expo Router SDK 52)           │
│ ├─ Agenda Clean Rose + Relógio Circular + Calendário de Folgas     │
│ ├─ Notificações Locais (07:00 Resumo, -30min, +12h Baixa, Mensal)  │
│ └─ Gráficos de Torres Financeiros + Chat IA + Checkboxes WAHA      │
└───────────────────────────────┬────────────────────────────────────┘
                                │ HTTP / REST JSON
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ ✿ BeautyFlow API (Node.js v22+ / Express / PostgreSQL Pool)        │
│ ├─ Retorno Inteligente (Serviço Mais Vencido via LATERAL JOIN)     │
│ ├─ Contexto IA: Google Gemini 3.1 + Clima Real (Open-Meteo API)    │
│ └─ Fila WhatsApp Anti-Ban (WAHA Docker + Delay 25-60s + Typing)    │
└────────────────────────────────────────────────────────────────────┘`
          );
          break;

        case "cat focus.yaml":
          printLine(`<span style="color:#a78bfa">${DATA.focusYaml}</span>`);
          break;

        case "skills":
          printLine(
            DATA.skillsMatrix
              .map(
                (c) =>
                  `<strong style="color:#22d3ee">${c.icon} ${c.titlePt}:</strong>\n  ` +
                  c.skills.map((s) => `${s.name} (${s.pct}%)`).join(" • ")
              )
              .join("\n\n")
          );
          break;

        case "contact":
          printLine(
            `📧 E-mail Principal : <a href="mailto:renancanselmo@gmail.com" style="color:#22d3ee">renancanselmo@gmail.com</a>
📧 E-mail UTFPR     : <a href="mailto:renan.2004@alunos.utfpr.edu.br" style="color:#22d3ee">renan.2004@alunos.utfpr.edu.br</a>
💼 LinkedIn         : <a href="https://www.linkedin.com/in/renan-caceres/" target="_blank" style="color:#22d3ee">linkedin.com/in/renan-caceres</a>
🐙 GitHub           : <a href="https://github.com/RenanCaceres" target="_blank" style="color:#22d3ee">github.com/RenanCaceres</a>`
          );
          break;

        case "sudo hire renan":
          printLine(
            `<span style="color:#10b981; font-weight:700;">[ACCESS GRANTED] 🚀 Excelente decisão!</span>
Renan Cáceres reúne experiência prática em sistemas em produção (Node.js, PostgreSQL, React, React Native, Criptografia LGPD e Google Gemini AI).
👉 Entre em contato agora mesmo: <a href="mailto:renancanselmo@gmail.com" style="color:#22d3ee; font-weight:700;">renancanselmo@gmail.com</a>`
          );
          showToast("🚀 Modo Recrutador ativado! Vamos conversar!");
          break;

        case "clear":
          body.innerHTML = "";
          return;

        default:
          printLine(
            `<span style="color:#f43f5e">Comando não reconhecido: "${rawCmd}".</span> Digite <strong>help</strong> para listar os comandos disponíveis.`
          );
      }
    }

    // Initial welcome banner
    printLine(
      `<span style="color:#a78bfa">RenanOS v2.6 (UTFPR-CP Kernel) — Interactive Portfolio Shell</span>
Digite <strong style="color:#22d3ee">help</strong> ou clique em qualquer comando acima para inspecionar a arquitetura.`
    );

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value;
        input.value = "";
        runCommand(val);
      }
    });

    document.querySelectorAll("[data-term-cmd]").forEach((chip) => {
      chip.addEventListener("click", () => {
        runCommand(chip.getAttribute("data-term-cmd"));
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. LIVE GITHUB API TELEMETRY SYNC
     -------------------------------------------------------------------------- */
  async function syncGitHubLive() {
    try {
      const res = await fetch("https://api.github.com/users/RenanCaceres");
      if (!res.ok) return;
      const user = await res.json();
      if (user && typeof user.public_repos === "number") {
        const repoCounter = document.getElementById("metric-repos");
        if (repoCounter) repoCounter.innerHTML = `${user.public_repos}<span>+</span>`;
      }
    } catch (_) {
      // Uses static verified count (24+) gracefully
    }
  }

  /* --------------------------------------------------------------------------
     8. LANGUAGE (PT/EN) & THEME SWITCHING
     -------------------------------------------------------------------------- */
  function applyTranslations() {
    const t = DATA.i18n[currentLang];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.getAttribute("data-i18n").split(".");
      let val = t;
      for (const k of path) {
        if (val && val[k] !== undefined) val = val[k];
      }
      if (typeof val === "string") {
        el.innerHTML = val;
      }
    });

    const searchInput = document.getElementById("project-search");
    if (searchInput) searchInput.placeholder = t.projects.searchPlaceholder;

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.textContent = currentLang === "pt" ? "EN" : "PT";

    renderProjects();
    renderSkillsAndTimeline();
    startTyping();
  }

  function cycleTheme() {
    const order = ["cyber", "obsidian", "light"];
    const next = order[(order.indexOf(currentTheme) + 1) % order.length];
    currentTheme = next;
    localStorage.setItem("rc_theme", currentTheme);

    if (currentTheme === "cyber") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }

    const labels = {
      cyber: "✨ Tema: Cyber-Violet",
      obsidian: "🌑 Tema: Vercel Obsidian",
      light: "☀️ Tema: Clean Light"
    };
    showToast(labels[currentTheme]);
  }

  /* --------------------------------------------------------------------------
     9. COMMAND PALETTE (Ctrl+K / Cmd+K)
     -------------------------------------------------------------------------- */
  function initCommandPalette() {
    const modal = document.getElementById("cmd-modal");
    const input = document.getElementById("cmd-input");
    const list = document.getElementById("cmd-list");
    if (!modal || !input || !list) return;

    const commands = [
      {
        label: "🛡️ Ver Arquitetura: CyberGuard Bot",
        tag: "Case Study",
        action: () => openArchModal("cyberguard-bot")
      },
      {
        label: "✿ Ver Arquitetura: BeautyFlow API (Backend + IA)",
        tag: "Case Study",
        action: () => openArchModal("beautyflow-api")
      },
      {
        label: "📱 Ver Arquitetura: BeautyFlow Mobile (React Native)",
        tag: "Case Study",
        action: () => openArchModal("beautyflow-mobile")
      },
      {
        label: "🪄 Abrir Deploy Live: Casas de Hogwarts (Vercel)",
        tag: "Live App",
        action: () => window.open("https://projeto1-full-stack.vercel.app", "_blank")
      },
      {
        label: "🧩 Abrir Portal REA: Try, Catch & Learn (Programação em C)",
        tag: "Live App",
        action: () => window.open("https://renancaceres.github.io/Certificadora-Comum/", "_blank")
      },
      {
        label: "📧 Copiar E-mail (renancanselmo@gmail.com)",
        tag: "Contato",
        action: () => copyEmail()
      },
      {
        label: "🐙 Abrir Perfil no GitHub (@RenanCaceres)",
        tag: "Social",
        action: () => window.open("https://github.com/RenanCaceres", "_blank")
      },
      {
        label: "💼 Abrir LinkedIn (linkedin.com/in/renan-caceres)",
        tag: "Social",
        action: () => window.open("https://www.linkedin.com/in/renan-caceres/", "_blank")
      },
      {
        label: "🎨 Alternar Tema Visual (Cyber-Violet / Obsidian / Light)",
        tag: "Preferências",
        action: () => cycleTheme()
      },
      {
        label: "🌐 Alternar Idioma (Português 🇧🇷 / English 🇺🇸)",
        tag: "Idioma",
        action: () => toggleLang()
      },
      {
        label: "🖨️ Imprimir / Salvar Currículo Executivo em PDF",
        tag: "CV",
        action: () => window.print()
      }
    ];

    function renderCmdList(q = "") {
      const query = q.trim().toLowerCase();
      const filtered = commands.filter(
        (c) => c.label.toLowerCase().includes(query) || c.tag.toLowerCase().includes(query)
      );
      list.innerHTML = filtered
        .map(
          (c, i) => `
        <li class="cmd-item" data-cmd-idx="${commands.indexOf(c)}">
          <span>${c.label}</span>
          <span class="cmd-kbd">${c.tag}</span>
        </li>
      `
        )
        .join("");

      list.querySelectorAll(".cmd-item").forEach((li) => {
        li.addEventListener("click", () => {
          const idx = Number(li.getAttribute("data-cmd-idx"));
          modal.classList.remove("open");
          commands[idx].action();
        });
      });
    }

    function openCmd() {
      modal.classList.add("open");
      input.value = "";
      renderCmdList("");
      setTimeout(() => input.focus(), 50);
    }

    document.getElementById("open-cmd-btn")?.addEventListener("click", openCmd);
    input.addEventListener("input", () => renderCmdList(input.value));

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (modal.classList.contains("open")) {
          modal.classList.remove("open");
        } else {
          openCmd();
        }
      }
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. HELPERS & INITIALIZATION
     -------------------------------------------------------------------------- */
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function copyEmail() {
    navigator.clipboard?.writeText(DATA.profile.emailPrimary);
    showToast(DATA.i18n[currentLang].contact.emailCopied);
  }

  function toggleLang() {
    currentLang = currentLang === "pt" ? "en" : "pt";
    localStorage.setItem("rc_lang", currentLang);
    applyTranslations();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    applyTranslations();
    initTerminal();
    initCommandPalette();
    syncGitHubLive();

    // Filter tabs
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter");
        renderProjects();
      });
    });

    // Search input
    document.getElementById("project-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });

    // Language & Theme buttons
    document.getElementById("lang-toggle")?.addEventListener("click", toggleLang);
    document.getElementById("theme-toggle")?.addEventListener("click", cycleTheme);

    // Copy email buttons
    document.querySelectorAll("[data-copy-email]").forEach((btn) => {
      btn.addEventListener("click", copyEmail);
    });

    // Print resume button
    document.querySelectorAll("[data-print-cv]").forEach((btn) => {
      btn.addEventListener("click", () => window.print());
    });

    // Modal close backdrop click
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.classList.remove("open");
      });
    });

    document.getElementById("arch-modal-close")?.addEventListener("click", () => {
      document.getElementById("arch-modal")?.classList.remove("open");
    });
  });
})();
