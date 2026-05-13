// ============================================================
//  Lista de niños - Quinto (PLANTILLA)
//
//  Para usar el proyecto:
//    1. Copia este archivo a `kids.js` en esta misma carpeta:
//         cp kids.sample.js kids.js   (Linux/Mac)
//         copy kids.sample.js kids.js (Windows)
//    2. Reemplaza los datos de ejemplo por tu lista real.
//    3. Pon los archivos de audio correspondientes en la carpeta
//       `Audios Quinto/` con los nombres que apuntes en `file`.
//       Formatos soportados: .ogg .mp3 .aac .mpeg .mp4 (la pista
//       de audio se reproduce; el video no se ve).
//
//  IMPORTANTE: `kids.js` está en .gitignore para no exponer datos
//  personales. Este `kids.sample.js` sí se versiona como plantilla.
// ============================================================

const ninos = [
  { nombre: "Juan Perez",
    partes: [
      { label: "Audio", file: "JUAN PEREZ.ogg" }
    ]
  },

  // Niño con varias partes (se reproducen una tras otra)
  { nombre: "Maria Lopez",
    partes: [
      { label: "Parte 1", file: "MARIA LOPEZ 1.ogg" },
      { label: "Parte 2", file: "MARIA LOPEZ 2.ogg" }
    ]
  },

  { nombre: "Pedro Gomez",
    partes: [
      { label: "Audio", file: "PEDRO GOMEZ.ogg" }
    ]
  },

  { nombre: "Ana Rodriguez",
    partes: [
      { label: "Audio", file: "ANA RODRIGUEZ.aac" }
    ]
  },

  { nombre: "Carlos Martinez",
    partes: [
      { label: "Audio", file: "CARLOS MARTINEZ.mpeg" }
    ]
  }
];
