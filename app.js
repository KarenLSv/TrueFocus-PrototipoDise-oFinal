const ACCENTS = [
  { name: "Morado", hex: "#7B2FBE" },
  { name: "Azul", hex: "#007AFF" },
  { name: "Verde", hex: "#34C759" },
  { name: "Naranja", hex: "#FF9500" },
  { name: "Rosa", hex: "#FF2D55" },
  { name: "Rojo", hex: "#FF3B30" },
];

const state = {
  mode: "both",
  accent: ACCENTS[0],
};

const gallery = document.getElementById("gallery");
const accentPicker = document.getElementById("accent-picker");

const screens = [
  {
    id: "welcome",
    title: "Bienvenida",
    subtitle: "Entrada clara y directa al valor de la app.",
    render: renderWelcome,
  },
  {
    id: "auth",
    title: "Inicio de sesión",
    subtitle: "Formulario principal y acceso con Google.",
    render: renderAuth,
  },
  {
    id: "permissions",
    title: "Permisos",
    subtitle: "Paso de configuración para el bloqueo real.",
    render: renderPermissions,
  },
  {
    id: "ready",
    title: "Protección activa",
    subtitle: "Transición corta cuando los permisos ya están listos.",
    render: renderReady,
  },
  {
    id: "home",
    title: "Inicio",
    subtitle: "Panel del día con enfoque, racha y acciones rápidas.",
    render: renderHome,
  },
  {
    id: "focus",
    title: "Enfoque",
    subtitle: "Pantalla Pomodoro con métricas y control de sesión.",
    render: renderFocus,
  },
  {
    id: "calendar",
    title: "Agenda",
    subtitle: "Agenda real o local, creación de eventos y auto bloqueo.",
    render: renderCalendar,
  },
  {
    id: "blocks",
    title: "Apps bloqueadas",
    subtitle: "Listado de apps, filtros y estado de bloqueo.",
    render: renderBlocks,
  },
  {
    id: "streak",
    title: "Racha",
    subtitle: "Progreso, XP, consistencia semanal y logros.",
    render: renderStreak,
  },
  {
    id: "settings",
    title: "Ajustes",
    subtitle: "Perfil, apariencia, permisos y modo estricto.",
    render: renderSettings,
  },
  {
    id: "profile",
    title: "Editar perfil",
    subtitle: "Modal de nombre visible, correo y avatar.",
    render: renderEditProfile,
  },
  {
    id: "overlay",
    title: "Overlay de bloqueo",
    subtitle: "Pantalla que aparece al intentar abrir una app protegida.",
    render: renderOverlay,
  },
];

init();

function init() {
  renderAccentPicker();
  bindModeButtons();
  applyAccent(state.accent.hex);
  renderGallery();
}

function renderAccentPicker() {
  accentPicker.innerHTML = ACCENTS.map((accent, index) => `
    <button
      class="swatch ${index === 0 ? "is-active" : ""}"
      style="background:${accent.hex}"
      title="${accent.name}"
      aria-label="${accent.name}"
      data-accent="${accent.hex}"
    ></button>
  `).join("");

  accentPicker.querySelectorAll(".swatch").forEach((button) => {
    button.addEventListener("click", () => {
      const accent = ACCENTS.find((item) => item.hex === button.dataset.accent);
      if (!accent) return;
      state.accent = accent;
      applyAccent(accent.hex);
      accentPicker.querySelectorAll(".swatch").forEach((swatch) => swatch.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGallery();
    });
  });
}

function bindModeButtons() {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll(".mode-button").forEach((node) => node.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGallery();
    });
  });
}

function applyAccent(hex) {
  const rgb = hexToRgb(hex);
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
}

function renderGallery() {
  gallery.innerHTML = screens.map((screen) => renderScreenGroup(screen)).join("");
}

function renderScreenGroup(screen) {
  const themes = state.mode === "both" ? ["light", "dark"] : [state.mode];
  return `
    <article class="screen-group">
      <div class="screen-header">
        <div>
          <h3 class="screen-title">${screen.title}</h3>
          <p class="screen-subtitle">${screen.subtitle}</p>
        </div>
      </div>
      <div class="screen-phones">
        ${themes.map((theme) => screen.render(theme)).join("")}
      </div>
    </article>
  `;
}

function phoneFrame({ theme, kicker, name, status, body }) {
  const themeLabel = theme === "light" ? "Modo claro" : "Modo oscuro";
  return `
    <div class="screen-preview">
      <div class="screen-header">
        <div>
          <p class="eyebrow">${kicker}</p>
          <h4 class="screen-name">${name}</h4>
        </div>
        <div class="screen-theme">${themeLabel}</div>
      </div>
      <div class="phone-shell">
        <div class="phone-bezel">
          <div class="phone-screen ${theme}">
            <div class="dynamic-island"></div>
            <div class="screen-meta">
              <div>
                <p class="screen-kicker">TrueFocus</p>
                <p class="screen-name">${name}</p>
              </div>
              <div class="status-pill">${status}</div>
            </div>
            ${body}
          </div>
        </div>
      </div>
    </div>
  `;
}

function chip(text, kind = "soft") {
  return `<span class="chip ${kind}">${text}</span>`;
}

function metric(value, label, variant = "") {
  return `
    <div class="metric ${variant}">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function field(label, value) {
  return `
    <div class="field">
      <label>${label}</label>
      <div>${value}</div>
    </div>
  `;
}

function listItem({ icon, iconStyle = "", title, subtitle, tail = "" }) {
  return `
    <div class="list-item">
      <div class="list-icon" style="${iconStyle}">${icon}</div>
      <div>
        <h5>${title}</h5>
        <p>${subtitle}</p>
      </div>
      ${tail ? `<div class="tail">${tail}</div>` : ""}
    </div>
  `;
}

function settingItem({ icon, iconStyle = "", title, subtitle, tail }) {
  return `
    <div class="settings-item">
      <div class="settings-icon" style="${iconStyle}">${icon}</div>
      <div>
        <h5>${title}</h5>
        <p>${subtitle}</p>
      </div>
      <div class="tail">${tail}</div>
    </div>
  `;
}

function bottomNav(active) {
  const items = [
    ["inicio", "⌂", "Inicio"],
    ["enfoque", "◷", "Enfoque"],
    ["bloqueos", "▣", "Bloqueos"],
    ["agenda", "⌘", "Agenda"],
    ["racha", "✦", "Racha"],
    ["ajustes", "⚙", "Ajustes"],
  ];

  return `
    <div class="nav">
      ${items.map(([id, icon, label]) => `
        <div class="nav-item ${active === id ? "active" : ""}">
          <div class="nav-icon">${icon}</div>
          <div class="nav-label">${label}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderWelcome(theme) {
  return phoneFrame({
    theme,
    kicker: "Onboarding",
    name: "Bienvenida",
    status: "Paso 1/3",
    body: `
      <div class="stack">
        <div class="hero-card">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">TrueFocus</p>
          <h3>Menos distracción.<br>Más control.</h3>
          <p>Pomodoro, agenda y bloqueo trabajan juntos con una pantalla más directa, sin ruido ni adornos innecesarios.</p>
          <div class="badge-row">
            ${chip("Enfoque limpio", "soft")}
            ${chip("Construye una racha real", "soft")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Lo que promete la app</h4>
          <p>Cada sesión suma. Cada distracción evitada también. Aquí vienes a avanzar, no a decorar la pantalla.</p>
          <div class="metric-row">
            ${metric("25", "Pomodoro base", "accent")}
            ${metric("3", "Meta inicial", "green")}
          </div>
        </div>

        <div class="button-row">
          <div class="btn primary">Continuar</div>
          <div class="btn secondary">Saltar</div>
        </div>
      </div>
    `,
  });
}

function renderAuth(theme) {
  return phoneFrame({
    theme,
    kicker: "Entrada",
    name: "Login y registro",
    status: "Cuenta",
    body: `
      <div class="stack">
        <div class="screen-block">
          <h4>TrueFocus</h4>
          <p>Correo, contraseña o Google. Todo en español y sin pasos confusos.</p>
        </div>
        ${field("Correo", "nombre@correo.com")}
        ${field("Contraseña", "••••••••••••")}
        <div class="button-row">
          <div class="btn primary">Entrar</div>
        </div>
        <div class="button-row">
          <div class="btn secondary">Continuar con Google</div>
        </div>
        <div class="screen-block">
          <h4>Recuperar contraseña</h4>
          <p>El flujo mantiene el lenguaje simple y evita pantallas de error recargadas.</p>
          <div class="badge-row">
            ${chip("Acceso rápido", "accent")}
            ${chip("Sin fricción", "ok")}
          </div>
        </div>
      </div>
    `,
  });
}

function renderPermissions(theme) {
  return phoneFrame({
    theme,
    kicker: "Permisos",
    name: "Configuración del sistema",
    status: "4 permisos",
    body: `
      <div class="stack">
        <div class="hero-card">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Permisos necesarios</p>
          <h3>El bloqueo necesita una base firme.</h3>
          <p>Esta pantalla explica cada acceso como parte del sistema de protección, no como jerga técnica suelta.</p>
        </div>

        <div class="list">
          ${listItem({
            icon: "♿",
            iconStyle: "background:rgba(var(--accent-rgb),0.14);color:var(--accent);",
            title: "Accesibilidad",
            subtitle: "Permite detectar y cerrar apps protegidas al instante.",
            tail: "Pendiente",
          })}
          ${listItem({
            icon: "⌚",
            iconStyle: "background:rgba(255,149,0,0.14);color:#ff9500;",
            title: "Uso de apps",
            subtitle: "Lee aperturas y tiempo para calcular score y distracciones.",
            tail: "Pendiente",
          })}
          ${listItem({
            icon: "▣",
            iconStyle: "background:rgba(255,45,85,0.14);color:#ff2d55;",
            title: "Superposición",
            subtitle: "Muestra el overlay cuando intentas abrir una app bloqueada.",
            tail: "Listo",
          })}
          ${listItem({
            icon: "⚡",
            iconStyle: "background:rgba(52,199,89,0.14);color:#34c759;",
            title: "Batería",
            subtitle: "Evita que Android congele la protección en segundo plano.",
            tail: "Pendiente",
          })}
        </div>

        <div class="button-row">
          <div class="btn primary">Continuar</div>
        </div>
      </div>
    `,
  });
}

function renderReady(theme) {
  return phoneFrame({
    theme,
    kicker: "Transición",
    name: "Protección activa",
    status: "Todo listo",
    body: `
      <div class="overlay-screen">
        <div class="overlay-card">
          <div class="lock-hero">🛡</div>
          <h3>Protección activa</h3>
          <p>Entrando a TrueFocus con la protección lista y tus permisos conectados.</p>
          <div class="button-row" style="margin-top:18px;">
            <div class="btn primary">Entrar</div>
          </div>
        </div>
      </div>
    `,
  });
}

function renderHome(theme) {
  return phoneFrame({
    theme,
    kicker: "Principal",
    name: "Inicio",
    status: "Panel de hoy",
    body: `
      <div class="stack">
        <div class="screen-block">
          <div class="profile-top">
            <div class="avatar">AF</div>
            <div class="profile-info" style="color:var(--screen-ink);">
              <h3 style="font-size:24px;">Andrea</h3>
              <p style="color:var(--screen-sub);">Protección completa y sesión activa.</p>
            </div>
          </div>
        </div>

        <div class="hero-card">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Enfoque de hoy</p>
          <h3>2 h 15 min</h3>
          <p>75% del objetivo diario de 3 horas.</p>
          <div class="progress"><span style="width:75%;"></span></div>
          <div class="badge-row">
            ${chip("Sesión protegida", "soft")}
            ${chip("Protección completa", "soft")}
            ${chip("Agenda conectada", "soft")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Tu racha comienza hoy</h4>
          <p>Aún no has protegido tu racha hoy. Mantén la constancia para alcanzar tu meta de 3 días.</p>
          <div class="metric-row">
            ${metric("3", "Meta inicial", "accent")}
            ${metric("0", "Días protegidos", "orange")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Acciones rápidas</h4>
          <div class="badge-row">
            ${chip("Ver agenda", "accent")}
            ${chip("Iniciar enfoque", "ok")}
            ${chip("Abrir bloqueos", "warn")}
          </div>
        </div>

        ${bottomNav("inicio")}
      </div>
    `,
  });
}

function renderFocus(theme) {
  return phoneFrame({
    theme,
    kicker: "Pomodoro",
    name: "Modo enfoque",
    status: "25 min",
    body: `
      <div class="stack">
        <div class="hero-card">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Modo enfoque</p>
          <h3>25:00</h3>
          <p>Aquí arrancas sesiones Pomodoro, ajustas minutos y mantienes el bloqueo activo mientras trabajas.</p>
          <div class="metric-row">
            ${metric("2", "Distracciones", "orange")}
            ${metric("78%", "Avance", "green")}
          </div>
        </div>

        <div class="badge-row">
          ${chip("25 min", "accent")}
          ${chip("Racha 4 días", "soft")}
          ${chip("Bloqueo activo", "warn")}
        </div>

        <div class="button-row">
          <div class="btn primary">Pausar sesión</div>
          <div class="btn danger">Detener</div>
        </div>

        <div class="screen-block">
          <h4>Duraciones rápidas</h4>
          <div class="badge-row">
            ${chip("1m", "soft")}
            ${chip("5m", "soft")}
            ${chip("25m", "accent")}
            ${chip("45m", "soft")}
          </div>
        </div>

        ${bottomNav("enfoque")}
      </div>
    `,
  });
}

function renderCalendar(theme) {
  return phoneFrame({
    theme,
    kicker: "Agenda",
    name: "Agenda y bloqueo inteligente",
    status: "8 eventos",
    body: `
      <div class="stack">
        <div class="hero-card">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Agenda</p>
          <h3>8 eventos</h3>
          <p>Guardado en la agenda local de TrueFocus para que siga funcionando aunque el calendario del teléfono no esté listo.</p>
          <div class="badge-row">
            ${chip("Agenda local activa", "soft")}
            ${chip("Próximo 08:00", "soft")}
            ${chip("Bloqueo exacto activo", "soft")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Agenda compartida</h4>
          <p>Desde aquí puedes ver la agenda guardada en TrueFocus. También puedes crear nuevos eventos aunque el calendario del teléfono todavía no esté conectado.</p>
          <div class="button-row">
            <div class="btn primary">Agregar a TrueFocus</div>
            <div class="btn secondary">Conectar agenda</div>
          </div>
        </div>

        <div class="screen-block">
          <h4>Lunes 15 de abril · 3 eventos</h4>
          <div class="list">
            ${listItem({
              icon: "📘",
              iconStyle: "background:rgba(0,122,255,0.14);color:#007aff;",
              title: "Matemáticas",
              subtitle: "08:00 - 09:30 · Clase",
              tail: "Auto",
            })}
            ${listItem({
              icon: "📌",
              iconStyle: "background:rgba(255,149,0,0.14);color:#ff9500;",
              title: "Reunión de equipo",
              subtitle: "12:00 - 13:00 · Evento",
              tail: "Local",
            })}
            ${listItem({
              icon: "⏱",
              iconStyle: "background:rgba(52,199,89,0.14);color:#34c759;",
              title: "Sesión Focus",
              subtitle: "14:00 - 16:00 · Focus",
              tail: "Auto",
            })}
          </div>
        </div>

        ${bottomNav("agenda")}
      </div>
    `,
  });
}

function renderBlocks(theme) {
  return phoneFrame({
    theme,
    kicker: "Bloqueos",
    name: "Apps bloqueadas",
    status: "4 activas",
    body: `
      <div class="stack">
        <div class="hero-card" style="background:linear-gradient(135deg,#ff3b30 0%, var(--accent) 100%);">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Permisos de funcionamiento</p>
          <h3>4 bloqueos activos</h3>
          <p>Aquí gestionas permisos, apps de riesgo y la salida validada para que el cierre sea más firme.</p>
          <div class="badge-row">
            ${chip("Protección completa", "soft")}
            ${chip("Modo estricto activo", "soft")}
            ${chip("3 apps distractoras", "soft")}
          </div>
        </div>

        <div class="search">
          <div>Buscar apps bloqueadas</div>
          <span class="tail">Filtrar</span>
        </div>

        <div class="categories">
          <span class="category active">Todas</span>
          <span class="category">Social</span>
          <span class="category">Entretenimiento</span>
          <span class="category">Comunicación</span>
        </div>

        <div class="list">
          ${listItem({
            icon: "📸",
            iconStyle: "background:rgba(255,45,85,0.14);color:#ff2d55;",
            title: "Instagram",
            subtitle: "Bloqueada por 54 min · Riesgo alto",
            tail: "Activa",
          })}
          ${listItem({
            icon: "🎵",
            iconStyle: "background:rgba(255,59,48,0.14);color:#ff3b30;",
            title: "TikTok",
            subtitle: "Bloqueada sin límite · Modo estricto",
            tail: "Activa",
          })}
          ${listItem({
            icon: "▶",
            iconStyle: "background:rgba(255,149,0,0.14);color:#ff9500;",
            title: "YouTube",
            subtitle: "38 min usados hoy · Lista para bloquear",
            tail: "Libre",
          })}
        </div>

        ${bottomNav("bloqueos")}
      </div>
    `,
  });
}

function renderStreak(theme) {
  return phoneFrame({
    theme,
    kicker: "Racha",
    name: "Racha y progreso",
    status: "7 días",
    body: `
      <div class="stack">
        <div class="hero-card" style="background:linear-gradient(135deg,#ff9500 0%, #ff3b30 46%, #141923 100%);">
          <p class="muted" style="color:rgba(255,255,255,0.72);margin:0;">Racha y progreso</p>
          <h3>7 días seguidos</h3>
          <p>La cadena está viva. Hoy vale más protegerla que motivarte.</p>
          <div class="badge-row">
            ${chip("Nivel 4", "soft")}
            ${chip("1260 XP", "soft")}
            ${chip("18 sesiones", "soft")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Camino al siguiente nivel</h4>
          <p>220 / 300 XP dentro del nivel actual.</p>
          <div class="xp-bar"><span style="width:73%;"></span></div>
        </div>

        <div class="screen-block">
          <h4>Consistencia semanal</h4>
          <p>Tu racha no depende de un gran día: depende de repetir días buenos.</p>
          <div class="bars">
            <span class="bar" style="height:42%;"></span>
            <span class="bar" style="height:56%;"></span>
            <span class="bar" style="height:64%;"></span>
            <span class="bar" style="height:76%;"></span>
            <span class="bar" style="height:84%;"></span>
            <span class="bar" style="height:68%;"></span>
            <span class="bar" style="height:92%;"></span>
          </div>
        </div>

        <div class="screen-block">
          <h4>Mapa visual de racha</h4>
          <div class="heatmap">
            ${new Array(28).fill(0).map((_, index) => {
              const level = index % 5;
              return `<span class="level-${level}"></span>`;
            }).join("")}
          </div>
        </div>

        ${bottomNav("racha")}
      </div>
    `,
  });
}

function renderSettings(theme) {
  return phoneFrame({
    theme,
    kicker: "Ajustes",
    name: "Perfil y sistema",
    status: "Personalización",
    body: `
      <div class="stack">
        <div class="profile-banner">
          <div class="profile-top">
            <div class="avatar">AF</div>
            <div class="profile-info">
              <h3>Andrea Focus</h3>
              <p>andrea@truefocus.app</p>
              <p>Ajusta apariencia, permisos clave y protección real desde un mismo panel.</p>
            </div>
          </div>
          <div class="badge-row" style="margin-top:16px;">
            ${chip("Protección completa", "soft")}
            ${chip("Modo estricto ON", "soft")}
            ${chip("Claro", "soft")}
          </div>
        </div>

        <div class="screen-block">
          <h4>Color y apariencia</h4>
          <p>El color activo influye en las pantallas principales, estados y acentos de protección.</p>
          <div class="palette-row">
            ${ACCENTS.map((accent) => `<span class="mini-swatch" style="background:${accent.hex};"></span>`).join("")}
          </div>
        </div>

        <div class="settings-list">
          ${settingItem({
            icon: "🌙",
            iconStyle: "background:rgba(var(--accent-rgb),0.14);color:var(--accent);",
            title: "Modo oscuro",
            subtitle: "Cambia toda la interfaz",
            tail: "Activo",
          })}
          ${settingItem({
            icon: "🔔",
            iconStyle: "background:rgba(255,149,0,0.14);color:#ff9500;",
            title: "Notificaciones",
            subtitle: "Alertas de enfoque y bloqueo",
            tail: "On",
          })}
          ${settingItem({
            icon: "🧷",
            iconStyle: "background:rgba(255,59,48,0.14);color:#ff3b30;",
            title: "Modo estricto",
            subtitle: "Protege salidas y desbloqueos",
            tail: "On",
          })}
        </div>

        ${bottomNav("ajustes")}
      </div>
    `,
  });
}

function renderEditProfile(theme) {
  return phoneFrame({
    theme,
    kicker: "Modal",
    name: "Editar perfil",
    status: "Perfil",
    body: `
      <div class="modal-wrap">
        <div class="screen-block">
          <h4>Perfil</h4>
          <p>La pantalla de ajustes sigue visible detrás del modal para conservar contexto visual.</p>
          <div class="settings-list">
            ${settingItem({
              icon: "🎨",
              iconStyle: "background:rgba(var(--accent-rgb),0.14);color:var(--accent);",
              title: "Tema",
              subtitle: "Claro, oscuro y colores",
              tail: "Listo",
            })}
            ${settingItem({
              icon: "🛡",
              iconStyle: "background:rgba(255,59,48,0.14);color:#ff3b30;",
              title: "Protección",
              subtitle: "Permisos y modo estricto",
              tail: "Firme",
            })}
          </div>
        </div>

        <div class="modal-backdrop"></div>
        <div class="modal">
          <h4>Editar perfil</h4>
          <p>Nombre visible, correo y avatar en un modal corto, limpio y fácil de presentar.</p>
          <div class="stack" style="margin-top:18px;">
            <div class="avatar large" style="margin:0 auto;">AF</div>
            ${field("Nombre visible", "Andrea Focus")}
            ${field("Correo", "andrea@truefocus.app")}
            <div class="button-row">
              <div class="btn secondary">Cancelar</div>
              <div class="btn primary">Guardar</div>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}

function renderOverlay(theme) {
  return phoneFrame({
    theme,
    kicker: "Protección",
    name: "Overlay de bloqueo",
    status: "Protección activa",
    body: `
      <div class="overlay-screen">
        <div class="overlay-card">
          <div class="lock-hero">🔒</div>
          <div class="chip soft" style="margin:0 auto 12px;width:max-content;">Protección activa</div>
          <h3>Instagram</h3>
          <p>TrueFocus desvió esta apertura para proteger tu atención antes de que se rompa el impulso.</p>
          <div class="button-row" style="margin-top:18px;">
            <div class="btn secondary">Volver</div>
            <div class="btn primary">Ir a enfoque</div>
          </div>
        </div>
      </div>
    `,
  });
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}
