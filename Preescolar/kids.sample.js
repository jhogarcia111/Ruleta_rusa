// ============================================================
//  Lista de niños - Preescolar (PLANTILLA)
//
//  Para usar el proyecto:
//    1. Copia este archivo a `kids.js` en esta misma carpeta:
//         cp kids.sample.js kids.js   (Linux/Mac)
//         copy kids.sample.js kids.js (Windows)
//    2. Reemplaza los datos de ejemplo por tu lista real.
//    3. Pon los archivos de video correspondientes en la carpeta
//       `Videos Preescolar/` con los nombres que apuntes en `file`.
//
//  IMPORTANTE: `kids.js` está en .gitignore para no exponer datos
//  personales. Este `kids.sample.js` sí se versiona como plantilla.
// ============================================================

const ninos = [
  // Niño con un solo video
  { nombre: "Juan Perez",
    partes: [
      { label: "Video", file: "JUAN PEREZ.mp4" }
    ]
  },

  // Niño con varias partes (se reproducen una tras otra)
  { nombre: "Maria Lopez",
    partes: [
      { label: "Parte 1", file: "MARIA LOPEZ PARTE 1.mp4" },
      { label: "Parte 2", file: "MARIA LOPEZ PARTE 2.mp4" }
    ]
  },

  { nombre: "Pedro Gomez",
    partes: [
      { label: "Video", file: "PEDRO GOMEZ.mp4" }
    ]
  },

  { nombre: "Ana Rodriguez",
    partes: [
      { label: "Video", file: "ANA RODRIGUEZ.mp4" }
    ]
  },

  { nombre: "Carlos Martinez",
    partes: [
      { label: "Video", file: "CARLOS MARTINEZ.mp4" }
    ]
  }
];
