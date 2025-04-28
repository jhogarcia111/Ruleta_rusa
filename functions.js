// Lista de niños y sus videos
const niños = [
  { nombre: "Juan", video: "videos/video1.mp4" },
  { nombre: "Ana", video: "videos/video2.mp4" },
  { nombre: "Pedro", video: "videos/video3.mp4" },
  { nombre: "Maria", video: "videos/video4.mp4" },
  { nombre: "Pedrito", video: "videos/video4.mp4" },
  { nombre: "Carlos", video: "videos/video4.mp4" },
  { nombre: "Arnold", video: "videos/video4.mp4" },
  { nombre: "Pepito", video: "videos/video4.mp4" },
  { nombre: "Marcos", video: "videos/video4.mp4" },
  { nombre: "Julieta", video: "videos/video4.mp4" }
];

  
const canvas = document.getElementById("canvas");
canvas.style.transformOrigin = "50% 50%";
const ctx = canvas.getContext("2d");
const totalSegmentos = niños.length;
let rotacionActual = 0;

// Increase canvas size by 20%
canvas.width = 480;  // 400 * 1.2 = 480
canvas.height = 480; // 400 * 1.2 = 480
canvas.style.backgroundColor = "transparent"; // Remove white background, make transparent
canvas.style.width = "480px"; // Ensure style width matches canvas size
canvas.style.height = "480px"; // Ensure style height matches canvas size

// Función para dibujar la ruleta con un segmento resaltado
function dibujarRuleta(segmentoResaltado = -1) {
  const anguloPorSegmento = (2 * Math.PI) / totalSegmentos;
  const centerX = 240; // 200 * 1.2
  const centerY = 240; // 200 * 1.2
  const radius = 240;  // 200 * 1.2
  const textRadius = 168; // 140 * 1.2

  for (let i = 0; i < totalSegmentos; i++) {
    const inicioAngulo = i * anguloPorSegmento;
    const finAngulo = inicioAngulo + anguloPorSegmento;

    // Determine fill color
    let fillColor;
    if (i === segmentoResaltado) {
      fillColor = "orange";
    } else if (niñosSeleccionados.some(n => n.nombre === niños[i].nombre)) {
      fillColor = "#47af4b"; // Already selected kid
    } else {
      fillColor = (i % 2 === 0) ? "#FFDD57" : "#FFD700";
    }

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, inicioAngulo, finAngulo);
    ctx.closePath();
    ctx.fill();

    // Add names in segments
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(inicioAngulo + anguloPorSegmento / 2);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(niños[i].nombre, textRadius, 12);
    ctx.restore();
  }
}
  
function girarRuleta() {
    // Ocultar el video antes de iniciar el giro
    const contenedorVideo = document.getElementById("contenedor-video");
    if (contenedorVideo) {
      contenedorVideo.innerHTML = ""; // Limpiar contenido del video
      contenedorVideo.style.display = "none"; // Ocultar el contenedor del video
    }
    
    // Filtrar niños que no han sido seleccionados aún
    const niñosDisponibles = niños.filter(niño => !niñosSeleccionados.some(n => n.nombre === niño.nombre));
  
    if (niñosDisponibles.length === 0) {
      // alert("Todos los niños ya han sido seleccionados. Por favor utilizar el botòn de Reset en la ventana de Administración en la barra lateral");
      showAllSelectedInfoModal();
      return;
    }
  
    const girosTotales = Math.random() * 360 + 720; // Giro entre 2 y 3 vueltas completas
    const duracion = 3000; // Duración del giro en milisegundos
    const inicio = performance.now();
  
    function animarGiro(timestamp) {
      const progreso = timestamp - inicio;
      const angulo = easeOut(progreso, 0, girosTotales, duracion);
      rotacionActual = (rotacionActual + angulo) % 360;
      canvas.style.transform = `rotate(${rotacionActual}deg)`;
  
      if (progreso < duracion) {
        requestAnimationFrame(animarGiro);
      } else {
        // Determinar segmento seleccionado entre los niños disponibles
        const totalDisponibles = niñosDisponibles.length;
        const anguloPorSegmento = 360 / totalDisponibles;
        const indiceSeleccionado = Math.floor((360 - rotacionActual) / anguloPorSegmento) % totalDisponibles;
        const niñoSeleccionado = niñosDisponibles[indiceSeleccionado];
  
        // Redibujar la ruleta destacando el segmento seleccionado
        // Para esto, necesitamos saber el índice original del niño seleccionado en la lista completa
        const indiceOriginal = niños.findIndex(n => n.nombre === niñoSeleccionado.nombre);
        dibujarRuleta(indiceOriginal);
  
        // Mostrar el modal
        mostrarModal(niñoSeleccionado);

   
      }
    }
  
    requestAnimationFrame(animarGiro);
  }
// Función para mostrar el modal
function mostrarModal(niño) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modal.style.display = "flex"; // Show the modal
  modalMessage.textContent = `El niño seleccionado es: ${niño.nombre}`;

  // Add selected kid to niñosSeleccionados if not already present
  if (!niñosSeleccionados.some(n => n.nombre === niño.nombre)) {
    niñosSeleccionados.push(niño);
    localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
  }

  // Bind the "Ver video" button to close this modal and open the video modal
  const verVideoBtn = document.getElementById("ver-video");
  verVideoBtn.onclick = () => {
    modal.style.display = "none";
    openAdminVideoModal(niño);
  };

  // Bind the "Cancelar" button to close this modal
  const cerrarModalBtn = document.getElementById("cerrar-modal");
  cerrarModalBtn.onclick = () => {
    modal.style.display = "none";
  };
}


  
 

// Función para mostrar el video del niño seleccionado
function mostrarVideo(niño) {
  const modal = document.getElementById("modal");
  modal.style.display = "none"; // Close modal

  const contenedorVideo = document.getElementById("contenedor-video");
  contenedorVideo.style.display = "block";
  contenedorVideo.innerHTML = "";

  const video = document.createElement("video");
  video.src = niño.video;
  video.controls = true;
  video.autoplay = true;

  // Set size based on video orientation after metadata is loaded
  video.addEventListener('loadedmetadata', () => {
      if (video.videoWidth > video.videoHeight) {
          video.style.width = "400px"; // Horizontal video
      } else {
          video.style.width = "320px"; // Vertical video
      }
      video.style.height = "auto"; // Maintain aspect ratio
  });

  contenedorVideo.appendChild(video);
}
  // Función de desaceleración suave
  function easeOut(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }
  
// Almacenar los niños seleccionados en localStorage
let niñosSeleccionados = JSON.parse(localStorage.getItem("niñosSeleccionados")) || [];

// Admin module functionality
const adminButton = document.getElementById("admin-button");
const adminModal = document.getElementById("admin-modal");
const adminList = document.getElementById("admin-list");
const closeAdminModalButton = document.getElementById("close-admin-modal");

function openAdminModal() {
  adminList.innerHTML = "";
  niños.forEach((niño, index) => {
    const listItem = document.createElement("li");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = niño.nombre;
    nameInput.style.marginRight = "10px";
    nameInput.style.width = "100px";

    // Create editable textbox for video URL without hyperlink behavior
    const videoInput = document.createElement("input");
    videoInput.type = "text";
    videoInput.value = niño.video;
    videoInput.style.marginLeft = "10px";
    videoInput.style.width = "150px";

    // Create button to open video modal
    const videoButton = document.createElement("button");
    videoButton.innerHTML = "▶️"; // Play icon
    videoButton.title = "Ver Video";
    videoButton.style.marginLeft = "5px";
    videoButton.style.backgroundColor = "#4CAF50";
    videoButton.style.color = "white";
    videoButton.style.border = "none";
    videoButton.style.borderRadius = "5px";
    videoButton.style.padding = "2px 0px 5px 0px";
    videoButton.style.fontSize = "16px";
    videoButton.style.cursor = "pointer";
    videoButton.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
    videoButton.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    videoButton.style.animation = "vibrar 1s infinite";


    videoButton.addEventListener("click", () => {
      openAdminVideoModal(niño);
    
      // Add kid to selected list immediately if not already present
      if (!niñosSeleccionados.some(n => n.nombre === niño.nombre)) {
        niñosSeleccionados.push(niño);
        localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
        updateSelectedKidsList();
      }
    });
    videoButton.addEventListener("mouseover", () => {
      videoButton.style.transform = "translateY(-10px) scale(1.05)";
      videoButton.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.5)";
    });
    videoButton.addEventListener("mouseout", () => {
      videoButton.style.transform = "translateY(0) scale(1)";
      videoButton.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
    });

    // Update niños array on input change
    nameInput.addEventListener("input", (e) => {
      niños[index].nombre = e.target.value;
    });
    videoInput.addEventListener("input", (e) => {
      niños[index].video = e.target.value;
    });

    listItem.appendChild(nameInput);
    listItem.appendChild(videoInput);
    listItem.appendChild(videoButton);
    adminList.appendChild(listItem);
  });

  adminModal.style.display = "flex";
}

// Function to open admin video modal and play video
function openAdminVideoModal(niño) {
  const adminVideoModal = document.getElementById("admin-video-modal");
  const adminVideoContainer = document.getElementById("admin-video-container");
  adminVideoContainer.innerHTML = "";

  const video = document.createElement("video");
  video.src = niño.video;
  video.controls = true;
  video.autoplay = true;

  // Set size based on video orientation after metadata is loaded
  video.addEventListener('loadedmetadata', () => {
    const closeBtn = document.getElementById("top-right-close-admin-video-modal");
    if (video.videoWidth > video.videoHeight) {
      video.style.width = "500px"; // Horizontal video
      if (closeBtn) closeBtn.style.top = "110px";
    } else {
      video.style.width = "250px"; // Vertical video
      if (closeBtn) closeBtn.style.top = "60px";
    }
    video.style.height = "auto"; // Maintain aspect ratio
  });

  adminVideoContainer.appendChild(video);

  adminVideoModal.style.display = "flex";

  // When closing the video modal, add kid to selected list
  const closeAdminVideoModalBtn = document.getElementById("close-admin-video-modal");
  closeAdminVideoModalBtn.onclick = () => {
    video.pause();
    video.currentTime = 0;
    adminVideoModal.style.display = "none";
    if (!niñosSeleccionados.some(n => n.nombre === niño.nombre)) {
      niñosSeleccionados.push(niño);
      localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
      updateSelectedKidsList();
    }
    dibujarRuleta(); // Repaint the roulette
  };
}


const botonSuerte = document.getElementById("boton-suerte");

function updateSelectedKidsList() {
  const selectedKidsTableBody = document.querySelector("#selected-kids-table tbody");
  selectedKidsTableBody.innerHTML = "";
  niñosSeleccionados.forEach((niño) => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = niño.nombre;
    cell.style.border = "none"; // Transparent border
    row.appendChild(cell);
    selectedKidsTableBody.appendChild(row);
  });
}

function resetSelectedKids() {
  niñosSeleccionados = [];
  localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
  updateSelectedKidsList();
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

// Function to add a top-right close button to a modal
function addTopRightCloseButton(modalId, closeButtonId, closeFunction) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Create close button element
  const closeBtn = document.createElement("button");
  closeBtn.id = closeButtonId;
  closeBtn.textContent = "×"; // Multiplication sign as close icon
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "transparent";
  closeBtn.style.border = "none";
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";

  // Append close button to modal
  modal.appendChild(closeBtn);

  // Attach close function to button click
  closeBtn.addEventListener("click", closeFunction);
}

// Add top-right close button to main modal
addTopRightCloseButton("modal", "top-right-close-modal", () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
});

// Add top-right close button to admin list modal
function addTopRightCloseButtonToAdminModal() {
  const adminModal = document.getElementById("admin-modal");
  if (!adminModal) return;

  const closeBtn = document.createElement("button");
  closeBtn.id = "top-right-close-admin-modal";
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "60px";
  closeBtn.style.right = "20%";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "white";
  closeBtn.style.border = 1;
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";

  adminModal.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    adminModal.style.display = "none";
  });
}
function addTopRightCloseButtonToAdminVideoModal() {
  const adminVideoModal = document.getElementById("admin-video-modal");
  if (!adminVideoModal) return;

  const closeBtn = document.createElement("button");
  closeBtn.id = "top-right-close-admin-video-modal";
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "60px";    // Adjust as needed
  closeBtn.style.right = "20%";  // Adjust as needed
  closeBtn.style.fontSize = "24px";
  closeBtn.style.background = "white";
  closeBtn.style.border = 1;
  closeBtn.style.color = "#000";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "1001";

  adminVideoModal.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    const adminVideoContainer = document.getElementById("admin-video-container");
    const video = adminVideoContainer.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    adminVideoModal.style.display = "none";
  });
}
// Function to show info modal when all kids are selected
function showAllSelectedInfoModal() {
  // Create modal container
  let infoModal = document.getElementById("info-modal");
  if (!infoModal) {
    infoModal = document.createElement("div");
    infoModal.id = "info-modal";
    infoModal.style.position = "fixed";
    infoModal.style.top = "0";
    infoModal.style.left = "0";
    infoModal.style.width = "100%";
    infoModal.style.height = "100%";
    infoModal.style.backgroundColor = "rgba(0,0,0,0.5)";
    infoModal.style.display = "flex";
    infoModal.style.justifyContent = "center";
    infoModal.style.alignItems = "center";
    infoModal.style.zIndex = "2000";

    // Modal content
    const modalContent = document.createElement("div");
    modalContent.style.background = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.display = "flex";
    modalContent.style.alignItems = "center";
    modalContent.style.maxWidth = "400px";
    modalContent.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";

    // Info icon (using Unicode info symbol)
    const infoIcon = document.createElement("span");
    infoIcon.textContent = "ℹ️";
    infoIcon.style.fontSize = "32px";
    infoIcon.style.marginRight = "15px";

    // Message text
    const message = document.createElement("div");
    message.textContent = "Todos los niños ya han sido seleccionados. Por favor utilizar el botón de Reset en la ventana de Administración en la barra lateral";
    message.style.flex = "1";

    // Button to open admin modal
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

// Call the function to add the button
addTopRightCloseButtonToAdminModal();


// Initial draw of the roulette on page load
dibujarRuleta();
