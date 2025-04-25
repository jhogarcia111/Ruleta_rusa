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
        // Determinar segmento seleccionado
        const indiceSeleccionado = Math.floor((360 - rotacionActual) / (360 / totalSegmentos)) % totalSegmentos;
        const niñoSeleccionado = niños[indiceSeleccionado];
  
        // Redibujar la ruleta destacando el segmento seleccionado
        dibujarRuleta(indiceSeleccionado);
  
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

// Validar y excluir niños seleccionados
function seleccionarNiño() {
  const niñosElegibles = niños.filter(niño => !niñosSeleccionados.includes(niño.nombre));

  if (niñosElegibles.length === 0) {
    alert("Todos los videos ya han sido vistos. ¡Resetea la lista para empezar de nuevo!");
    return;
  }

  const indexAleatorio = Math.floor(Math.random() * niñosElegibles.length);
  const niñoSeleccionado = niñosElegibles[indexAleatorio];

  // Agregar el niño seleccionado a la lista y actualizar en localStorage
  niñosSeleccionados.push(niñoSeleccionado.nombre);
  localStorage.setItem("niñosSeleccionados", JSON.stringify(niñosSeleccionados));

  // Mostrar el modal
  mostrarModal(niñoSeleccionado);
}

// Función para resetear la lista de seleccionados
function resetearLista() {
  niñosSeleccionados = [];
  localStorage.removeItem("niñosSeleccionados");
  alert("La lista de seleccionados ha sido reseteada.");
}

// Abrir o cerrar el sidebar al hacer clic en el ícono de configuración
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebar-toggle");

toggle.addEventListener("click", () => {
  if (sidebar.style.width === "200px") {
    sidebar.style.width = "50px";
  } else {
    sidebar.style.width = "200px";
  }
});
  // Inicializar y vincular eventos
  dibujarRuleta();
  document.getElementById("boton-suerte").addEventListener("click", girarRuleta);
  document.getElementById("resetear-lista").addEventListener("click", resetearLista);

  