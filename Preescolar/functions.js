// ============================================================
//  Ruleta de Videos - Preescolar
//  Cada niño puede tener una o varias "partes" (archivos).
//
//  La lista `ninos` se carga desde `kids.js` (NO está en git por
//  contener datos personales). Si no existe, usa `kids.sample.js`
//  como plantilla.
// ============================================================

const MEDIA_BASE = "Videos Preescolar/";
const STORAGE_KEY = "ninosSeleccionados_preescolar";
const MEDIA_TYPE = "video"; // "video" o "audio"

// `ninos` viene declarada como `const` global en `kids.js`.
if (typeof ninos === "undefined") {
  console.error(
    "❌ No se encontró la variable `ninos`. Copia `kids.sample.js` a `kids.js` y personaliza la lista."
  );
}

// Devuelve la URL del archivo, codificando cada segmento por separado
// (preserva espacios y caracteres especiales como ñ)
function buildMediaUrl(file) {
  return MEDIA_BASE.split("/").map(encodeURIComponent).join("/") + encodeURIComponent(file);
}

// ---------- Mascota: videos aleatorios al ver un video ----------
const MASCOTA_PLAYBACK_VIDEOS = [
  "Mascota viendo videos 1.mp4",
  "Mascota viendo videos 2.mp4",
  "Mascota viendo videos 3.mp4",
  "Mascota viendo videos 4.mp4",
  "Mascota viendo videos 5.mp4"
];

// Elige un video aleatorio y lo asigna como src de TODAS las mascotas:
//  - Video activo del dashboard
//  - Mascota dentro del modal de selección
//  - Mascota dentro del modal del reproductor
function refreshMascotaPlaybackVideo() {
  const idx = Math.floor(Math.random() * MASCOTA_PLAYBACK_VIDEOS.length);
  const newSrc = "../Media/" + encodeURIComponent(MASCOTA_PLAYBACK_VIDEOS[idx]);

  const targets = [
    document.querySelector("#mascota-buho .mascota-video-active"),
    document.getElementById("mascota-buho-selection"),
    document.getElementById("mascota-buho-modal")
  ];
  targets.forEach(el => {
    if (el && el.tagName === "VIDEO") {
      el.src = newSrc;
      el.load();
    }
  });
}

// Alterna la mascota del dashboard y la del modal-reproductor entre
// idle/activo según se esté reproduciendo o no contenido del niño.
function setMascotaCantando(on) {
  const wrapper = document.getElementById("mascota-buho");
  if (wrapper) {
    wrapper.classList.toggle("mascota-cantando", on);
    const active = wrapper.querySelector(".mascota-video-active");
    if (active) {
      if (on) active.play().catch(() => {});
      else active.pause();
    }
  }

  // La mascota del modal del reproductor se reproduce mientras
  // está sonando el video del niño y se pausa cuando él pausa.
  const modalMascota = document.getElementById("mascota-buho-modal");
  if (modalMascota) {
    if (on) modalMascota.play().catch(() => {});
    else modalMascota.pause();
  }
}

// Estado persistente
let ninosSeleccionados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ---------- Canvas / Ruleta ----------
const canvas = document.getElementById("canvas");
canvas.style.transformOrigin = "50% 50%";
const ctx = canvas.getContext("2d");
const totalSegmentos = ninos.length;
let rotacionActual = 0;

canvas.width = 480;
canvas.height = 480;
canvas.style.backgroundColor = "transparent";
canvas.style.width = "480px";
canvas.style.height = "480px";

// Paleta neon para los segmentos
const SEGMENT_COLORS = [
  "#f472b6", // rosa
  "#a78bfa", // violeta
  "#22d3ee", // cyan
  "#34d399", // mint
  "#fbbf24", // amarillo
  "#fb923c"  // naranja
];
const COLOR_SELECCIONADO = "#fbbf24";   // amarillo neon (resaltado)
const COLOR_YA_SALIO    = "#cbd5e1";    // gris suave para quien ya salió

function dibujarRuleta(segmentoResaltado = -1) {
  const anguloPorSegmento = (2 * Math.PI) / totalSegmentos;
  const centerX = 240;
  const centerY = 240;
  const radius = 240;
  const textRadius = 168;

  // Limpiar antes para evitar bordes acumulados
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < totalSegmentos; i++) {
    const inicioAngulo = i * anguloPorSegmento;
    const finAngulo = inicioAngulo + anguloPorSegmento;

    let fillColor;
    if (i === segmentoResaltado) {
      fillColor = COLOR_SELECCIONADO;
    } else if (ninosSeleccionados.some(n => n.nombre === ninos[i].nombre)) {
      fillColor = COLOR_YA_SALIO;
    } else {
      fillColor = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    }

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, inicioAngulo, finAngulo);
    ctx.closePath();
    ctx.fill();

    // Borde sutil entre segmentos
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Texto del nombre
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(inicioAngulo + anguloPorSegmento / 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "600 13px 'Quicksand', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ninos[i].nombre, textRadius, 12);
    ctx.restore();
  }

  // Anillo exterior decorativo
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.stroke();
}

// ---------- Lógica de giro ----------
function girarRuleta() {
  const contenedorVideo = document.getElementById("contenedor-video");
  if (contenedorVideo) {
    contenedorVideo.innerHTML = "";
    contenedorVideo.style.display = "none";
  }

  const ninosDisponibles = ninos.filter(n => !ninosSeleccionados.some(s => s.nombre === n.nombre));

  if (ninosDisponibles.length === 0) {
    showAllSelectedInfoModal();
    return;
  }

  // Activar el glow neon durante el giro
  const ruletaWrapper = document.getElementById("ruleta");
  if (ruletaWrapper) ruletaWrapper.classList.add("spinning");

  const girosTotales = Math.random() * 360 + 720;
  const duracion = 3000;
  const inicio = performance.now();

  function animarGiro(timestamp) {
    const progreso = timestamp - inicio;
    const angulo = easeOut(progreso, 0, girosTotales, duracion);
    rotacionActual = (rotacionActual + angulo) % 360;
    canvas.style.transform = `rotate(${rotacionActual}deg)`;

    if (progreso < duracion) {
      requestAnimationFrame(animarGiro);
    } else {
      if (ruletaWrapper) ruletaWrapper.classList.remove("spinning");

      const totalDisponibles = ninosDisponibles.length;
      const anguloPorSegmento = 360 / totalDisponibles;
      const indiceSeleccionado = Math.floor((360 - rotacionActual) / anguloPorSegmento) % totalDisponibles;
      const ninoSeleccionado = ninosDisponibles[indiceSeleccionado];

      const indiceOriginal = ninos.findIndex(n => n.nombre === ninoSeleccionado.nombre);
      dibujarRuleta(indiceOriginal);

      mostrarModal(ninoSeleccionado);
    }
  }

  requestAnimationFrame(animarGiro);
}

// ---------- Lista "Por Salir" (panel derecho del dashboard) ----------
function updatePorSalirList() {
  const listEl = document.getElementById("por-salir-list");
  const emptyEl = document.getElementById("por-salir-empty");
  const countEl = document.getElementById("por-salir-count");
  if (!listEl) return;

  const pendientes = ninos.filter(n => !ninosSeleccionados.some(s => s.nombre === n.nombre));

  listEl.innerHTML = "";
  pendientes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.nombre;
    listEl.appendChild(li);
  });

  if (countEl) countEl.textContent = pendientes.length;
  if (emptyEl) emptyEl.style.display = pendientes.length === 0 ? "block" : "none";
}

function easeOut(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}

// ---------- Modal de selección ----------
function mostrarModal(nino) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const partesContainer = document.getElementById("modal-partes-container");

  // Elegir un video aleatorio para la mascota: aparece junto al nombre
  // y al botón "Ver Video", y se mantiene el mismo en el reproductor.
  refreshMascotaPlaybackVideo();

  modal.style.display = "flex";
  modalMessage.textContent = nino.nombre;

  if (!ninosSeleccionados.some(n => n.nombre === nino.nombre)) {
    ninosSeleccionados.push({ nombre: nino.nombre });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ninosSeleccionados));
    updatePorSalirList();
  }

  partesContainer.innerHTML = "";
  const btn = document.createElement("button");
  btn.className = "parte-button";
  btn.textContent = nino.partes.length === 1 ? "Ver Video" : "Ver Videos";
  btn.onclick = () => {
    modal.style.display = "none";
    openMediaModal(nino);
  };
  partesContainer.appendChild(btn);

  const cerrarModalBtn = document.getElementById("cerrar-modal");
  cerrarModalBtn.onclick = () => {
    modal.style.display = "none";
  };
}

// ---------- Reproductor de video (modal) ----------
// partesAReproducir: por defecto, todas las partes del niño.
// El admin lo invoca con una sola parte específica para reproducir solo esa.
function openMediaModal(nino, partesAReproducir = null) {
  const adminVideoModal = document.getElementById("admin-video-modal");
  const adminVideoContainer = document.getElementById("admin-video-container");
  const adminVideoTitle = document.getElementById("admin-video-title");

  // Cada vez que se abre el modal, elegir un video aleatorio para la
  // mascota del dashboard (para que no siempre sea el mismo).
  refreshMascotaPlaybackVideo();

  const partes = partesAReproducir || nino.partes;
  adminVideoContainer.innerHTML = "";

  if (partes.length === 1 && nino.partes.length > 1) {
    adminVideoTitle.textContent = `${nino.nombre} — ${partes[0].label}`;
  } else {
    adminVideoTitle.textContent = nino.nombre;
  }

  const items = partes.map(parte => {
    const wrapper = document.createElement("div");
    wrapper.className = "parte-wrapper";

    if (partes.length > 1) {
      const label = document.createElement("div");
      label.className = "parte-label";
      label.textContent = parte.label;
      wrapper.appendChild(label);
    }

    const media = document.createElement("video");
    media.src = buildMediaUrl(parte.file);
    media.controls = true;
    media.preload = "auto";

    media.addEventListener('loadedmetadata', () => {
      if (media.videoWidth > media.videoHeight) {
        media.style.width = "500px";
      } else {
        media.style.width = "250px";
      }
      media.style.height = "auto";
    });

    // Mientras suena, alternar la mascota del dashboard a imagen + baile
    media.addEventListener("play",  () => setMascotaCantando(true));
    media.addEventListener("pause", () => setMascotaCantando(false));

    wrapper.appendChild(media);
    return { wrapper, media };
  });

  // Encadenar reproducción: al terminar uno, suena el siguiente
  items.forEach((it, i) => {
    adminVideoContainer.appendChild(it.wrapper);
    it.media.addEventListener("ended", () => {
      const next = items[i + 1];
      if (next) {
        next.media.play().catch(() => {});
        // Hacer scroll al siguiente video para que sea visible
        next.wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // Era el último: vuelve la mascota a su estado de video en loop
        setMascotaCantando(false);
      }
    });
  });

  // Autoplay del primero
  if (items.length > 0) {
    items[0].media.autoplay = true;
  }

  adminVideoModal.style.display = "flex";

  if (!ninosSeleccionados.some(n => n.nombre === nino.nombre)) {
    ninosSeleccionados.push({ nombre: nino.nombre });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ninosSeleccionados));
    updateSelectedKidsList();
    updatePorSalirList();
  }

  const closeAdminVideoModalBtn = document.getElementById("close-admin-video-modal");
  closeAdminVideoModalBtn.onclick = () => {
    items.forEach(it => {
      it.media.pause();
      it.media.currentTime = 0;
    });
    setMascotaCantando(false);
    adminVideoModal.style.display = "none";
    dibujarRuleta();
  };
}

// ---------- Admin module ----------
const adminButton = document.getElementById("admin-button");
const adminModal = document.getElementById("admin-modal");
const adminList = document.getElementById("admin-list");
const closeAdminModalButton = document.getElementById("close-admin-modal");

function openAdminModal() {
  adminList.innerHTML = "";
  ninos.forEach((nino, index) => {
    const listItem = document.createElement("li");

    // 1) Nombre del niño
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = nino.nombre;
    nameInput.style.marginRight = "10px";
    nameInput.style.width = "180px";
    nameInput.addEventListener("input", (e) => {
      ninos[index].nombre = e.target.value;
    });
    listItem.appendChild(nameInput);

    // 2) Todos los textboxes de archivos primero
    nino.partes.forEach((parte, pIdx) => {
      const fileInput = document.createElement("input");
      fileInput.type = "text";
      fileInput.value = parte.file;
      fileInput.style.width = "170px";
      fileInput.style.marginLeft = "4px";
      fileInput.title = parte.label;
      fileInput.addEventListener("input", (e) => {
        ninos[index].partes[pIdx].file = e.target.value;
      });
      listItem.appendChild(fileInput);
    });

    // 3) Después los botones de play (uno por parte)
    nino.partes.forEach((parte) => {
      const playBtn = document.createElement("button");
      playBtn.className = "admin-part-button";
      playBtn.innerHTML = nino.partes.length === 1 ? "▶️" : `▶️ ${parte.label}`;
      playBtn.title = `Reproducir ${parte.label}`;
      playBtn.addEventListener("click", () => {
        openMediaModal(nino, [parte]);
      });
      listItem.appendChild(playBtn);
    });

    // 4) Si tiene varias partes, botón para reproducirlas todas en secuencia
    if (nino.partes.length > 1) {
      const playAllBtn = document.createElement("button");
      playAllBtn.className = "admin-part-button";
      playAllBtn.innerHTML = "▶️ Todas";
      playAllBtn.title = "Reproducir todas en secuencia";
      playAllBtn.addEventListener("click", () => {
        openMediaModal(nino);
      });
      listItem.appendChild(playAllBtn);
    }

    adminList.appendChild(listItem);
  });

  adminModal.style.display = "flex";
}

const botonSuerte = document.getElementById("boton-suerte");

function updateSelectedKidsList() {
  const selectedKidsTableBody = document.querySelector("#selected-kids-table tbody");
  selectedKidsTableBody.innerHTML = "";
  ninosSeleccionados.forEach((nino) => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = nino.nombre;
    cell.style.border = "none";
    row.appendChild(cell);
    selectedKidsTableBody.appendChild(row);
  });
}

function resetSelectedKids() {
  ninosSeleccionados = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ninosSeleccionados));
  updateSelectedKidsList();
  updatePorSalirList();
  dibujarRuleta();
}

const resetButton = document.getElementById("resetear-lista");
resetButton.addEventListener("click", resetSelectedKids);

adminButton.addEventListener("click", () => {
  openAdminModal();
  updateSelectedKidsList();
});
closeAdminModalButton.addEventListener("click", () => {
  adminModal.style.display = "none";
});

botonSuerte.addEventListener("click", girarRuleta);

// ---------- Botones × en esquina superior derecha de modales ----------
function addTopRightCloseButton(modalId, closeButtonId, closeFunction) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const closeBtn = document.createElement("button");
  closeBtn.id = closeButtonId;
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "transparent";
  closeBtn.style.border = "none";
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";
  modal.appendChild(closeBtn);
  closeBtn.addEventListener("click", closeFunction);
}

addTopRightCloseButton("modal", "top-right-close-modal", () => {
  document.getElementById("modal").style.display = "none";
});

function addTopRightCloseButtonToAdminModal() {
  const m = document.getElementById("admin-modal");
  if (!m) return;
  const closeBtn = document.createElement("button");
  closeBtn.id = "top-right-close-admin-modal";
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "60px";
  closeBtn.style.right = "20%";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "white";
  closeBtn.style.border = "1px solid #ccc";
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";
  m.appendChild(closeBtn);
  closeBtn.addEventListener("click", () => { m.style.display = "none"; });
}

function addTopRightCloseButtonToAdminVideoModal() {
  const m = document.getElementById("admin-video-modal");
  if (!m) return;
  const closeBtn = document.createElement("button");
  closeBtn.id = "top-right-close-admin-video-modal";
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "60px";
  closeBtn.style.right = "20%";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "white";
  closeBtn.style.border = "1px solid #ccc";
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";
  m.appendChild(closeBtn);
  closeBtn.addEventListener("click", () => {
    const medias = m.querySelectorAll("video, audio");
    medias.forEach(v => { v.pause(); v.currentTime = 0; });
    setMascotaCantando(false);
    m.style.display = "none";
  });
}

function showAllSelectedInfoModal() {
  let infoModal = document.getElementById("info-modal");
  if (!infoModal) {
    infoModal = document.createElement("div");
    infoModal.id = "info-modal";
    Object.assign(infoModal.style, {
      position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: "2000"
    });

    const modalContent = document.createElement("div");
    Object.assign(modalContent.style, {
      background: "white", padding: "20px", borderRadius: "8px",
      display: "flex", alignItems: "center", maxWidth: "400px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
    });

    const infoIcon = document.createElement("span");
    infoIcon.textContent = "ℹ️";
    infoIcon.style.fontSize = "32px";
    infoIcon.style.marginRight = "15px";

    const message = document.createElement("div");
    message.textContent = "Todos los niños ya han sido seleccionados. Por favor utilizar el botón de Reset en la ventana de Administración en la barra lateral";
    message.style.flex = "1";

    const openAdminBtn = document.createElement("button");
    openAdminBtn.textContent = "Abrir Admin";
    openAdminBtn.style.marginLeft = "15px";
    openAdminBtn.style.padding = "8px 12px";
    openAdminBtn.style.cursor = "pointer";
    openAdminBtn.onclick = () => {
      infoModal.style.display = "none";
      openAdminModal();
    };

    modalContent.appendChild(infoIcon);
    modalContent.appendChild(message);
    modalContent.appendChild(openAdminBtn);
    infoModal.appendChild(modalContent);
    document.body.appendChild(infoModal);
  } else {
    infoModal.style.display = "flex";
  }
}

addTopRightCloseButtonToAdminVideoModal();
addTopRightCloseButtonToAdminModal();

dibujarRuleta();
updatePorSalirList();
