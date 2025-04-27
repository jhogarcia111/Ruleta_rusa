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
  const ctx = canvas.getContext("2d");
  const totalSegmentos = niños.length;
  let rotacionActual = 0;
  
  // Función para dibujar la ruleta con un segmento resaltado
  function dibujarRuleta(segmentoResaltado = -1) {
    const anguloPorSegmento = (2 * Math.PI) / totalSegmentos;
  
    for (let i = 0; i < totalSegmentos; i++) {
      const inicioAngulo = i * anguloPorSegmento;
      const finAngulo = inicioAngulo + anguloPorSegmento;
  
      // Resaltar el segmento seleccionado
      ctx.fillStyle = i === segmentoResaltado ? "orange" : (i % 2 === 0 ? "#FFDD57" : "#FFD700");
      ctx.beginPath();
      ctx.moveTo(200, 200); // Centro del canvas
      ctx.arc(200, 200, 200, inicioAngulo, finAngulo);
      ctx.closePath();
      ctx.fill();
  
      // Agregar nombres en los segmentos
      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate(inicioAngulo + anguloPorSegmento / 2);
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(niños[i].nombre, 140, 10);
      ctx.restore();
    }
  }
  
  function girarRuleta() {
    // Ocultar el video antes de iniciar el giro
    const contenedorVideo = document.getElementById("contenedor-video");
    contenedorVideo.innerHTML = ""; // Limpiar contenido del video
    contenedorVideo.style.display = "none"; // Ocultar el contenedor del video
    
    // Filtrar niños que no han sido seleccionados aún
    const niñosDisponibles = niños.filter(niño => !niñosSeleccionados.some(n => n.nombre === niño.nombre));
  
    if (niñosDisponibles.length === 0) {
      alert("Todos los niños ya han sido seleccionados.");
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

  modal.style.display = "flex"; // Mostrar el modal
  modalMessage.textContent = `El niño seleccionado es: ${niño.nombre}`;

  // Add selected kid to niñosSeleccionados if not already present
  if (!niñosSeleccionados.some(n => n.nombre === niño.nombre)) {
    niñosSeleccionados.push(niño);
    localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
  }

  // Vincular el botón Ver Video
  const verVideoBtn = document.getElementById("ver-video");
  verVideoBtn.onclick = () => mostrarVideo(niño);

  // Vincular el botón Cancelar
  const cerrarModalBtn = document.getElementById("cerrar-modal");
  cerrarModalBtn.onclick = () => (modal.style.display = "none");
}
  
 

// Función para mostrar el video del niño seleccionado
function mostrarVideo(niño) {
    const modal = document.getElementById("modal");
    modal.style.display = "none"; // Cerrar el modal
  
    // Mostrar y reproducir el video
    const contenedorVideo = document.getElementById("contenedor-video");
    contenedorVideo.style.display = "block"; // Mostrar el contenedor del video
    contenedorVideo.innerHTML = ""; // Limpiar contenido previo
    const video = document.createElement("video");
    video.src = niño.video;
    video.controls = true;
    video.autoplay = true;
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
  video.style.width = "100%";
  adminVideoContainer.appendChild(video);

  adminVideoModal.style.display = "flex";

  // When closing the video modal, add kid to selected list
  const closeAdminVideoModalBtn = document.getElementById("close-admin-video-modal");
  closeAdminVideoModalBtn.onclick = () => {
    adminVideoModal.style.display = "none";
    if (!niñosSeleccionados.some(n => n.nombre === niño.nombre)) {
      niñosSeleccionados.push(niño);
      localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));
      updateSelectedKidsList();
    }
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

// Initial draw of the roulette on page load
dibujarRuleta();
