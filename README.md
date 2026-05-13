# Ruleta de Videos / Audios

![Versión](https://img.shields.io/badge/versión-2.0.0-22d3ee)
![Estado](https://img.shields.io/badge/estado-activo-22c55e)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-f59e0b)

Mini aplicación de aula que muestra una **ruleta animada** con la lista de
estudiantes y, al elegir uno al azar, reproduce su **video** o **audio**
correspondiente. Pensada para dinámicas en clase: presentaciones, lecturas,
canciones, despedidas de fin de año, etc.

> **V2.0.0** – La aplicación ahora se divide en dos cursos independientes:
> **Preescolar** (reproduce videos) y **Quinto** (reproduce audios), con un
> rediseño visual estilo dashboard, una mascota animada (búho) y panel de
> "Por salir" para no repetir niños.

---

## 📁 Estructura

```
Ruleta Rusa/
├── Preescolar/             # App para preescolar (videos)
│   ├── index.html
│   ├── functions.js        # Lógica de la app (sin datos personales)
│   ├── kids.sample.js      # PLANTILLA de la lista de niños
│   ├── kids.js             # Lista REAL (gitignored)
│   ├── style.css
│   └── Videos Preescolar/  # Videos por niño (gitignored)
│
├── quinto/                 # App para quinto (audios)
│   ├── index.html
│   ├── functions.js
│   ├── kids.sample.js
│   ├── kids.js             # (gitignored)
│   ├── style.css
│   └── Audios Quinto/      # Audios por niño (gitignored)
│
├── Media/                  # Mascota (videos del búho) – público
├── images/                 # Mockups y assets de UI – público
├── docs/                   # Guías y documentación
├── Versión 1.0/            # Versión anterior archivada (gitignored)
├── CHANGELOG.md
└── README.md
```

---

## 🚀 Cómo usar (instalación rápida)

> El proyecto es **HTML/CSS/JS puro**, no necesita servidor ni `npm install`.
> Basta con abrir el `index.html` del curso que quieras usar.

### 1. Clonar el repo

```bash
git clone https://github.com/jhogarcia111/Ruleta-Rusa.git
cd "Ruleta Rusa"
```

### 2. Crear tu lista de niños (datos LOCALES)

Para cada curso que quieras usar:

```bash
# Preescolar
copy Preescolar\kids.sample.js Preescolar\kids.js

# Quinto
copy quinto\kids.sample.js quinto\kids.js
```

Edita el `kids.js` correspondiente y reemplaza los datos de ejemplo por la
lista real. Cada niño puede tener una o varias partes:

```js
const ninos = [
  { nombre: "Juan Perez",  partes: [
    { label: "Video", file: "JUAN PEREZ.mp4" }
  ]},
  { nombre: "Maria Lopez", partes: [
    { label: "Parte 1", file: "MARIA LOPEZ 1.mp4" },
    { label: "Parte 2", file: "MARIA LOPEZ 2.mp4" }
  ]},
];
```

### 3. Poner los archivos multimedia

- **Preescolar** → coloca los videos `.mp4` en `Preescolar/Videos Preescolar/`
- **Quinto** → coloca los audios (`.ogg`, `.mp3`, `.aac`, `.mpeg`, `.mp4`) en
  `quinto/Audios Quinto/`

Los nombres de archivo deben coincidir **exactamente** con los que escribiste
en `file:` dentro de `kids.js` (incluyendo espacios y mayúsculas).

### 4. Abrir la app

Doble click en `Preescolar/index.html` o `quinto/index.html`.

> 💡 Algunos navegadores bloquean autoplay/media local con `file://`.
> Si te pasa, sirve la carpeta con cualquier server estático, por ejemplo:
>
> ```bash
> npx serve .
> ```

---

## ✨ Características V2.0

- **Dos cursos independientes** (Preescolar = video, Quinto = audio).
- **Ruleta animada** con segmentos de colores neon y giro suave.
- **Mascota búho** con video en loop:
  - En reposo: `Mascota.mp4`.
  - En reproducción: video aleatorio de "Mascota viendo videos N.mp4" /
    "Mascota escuchando N.mp4".
- **Panel "Por salir"**: muestra los niños que aún no han sido elegidos en la
  sesión.
- **Persistencia local** (`localStorage`): los seleccionados quedan marcados
  hasta que limpies la sesión.
- **Reproducción secuencial**: si un niño tiene 2+ partes, se reproducen
  automáticamente una tras otra dentro del mismo modal.
- **Panel de admin** para reproducir manualmente cualquier niño o parte sin
  girar la ruleta.
- **Layout fijo sin "flickeo"** del scrollbar al girar la ruleta.

---

## 🔒 Privacidad / Datos sensibles

Este proyecto se usa en aulas reales, así que **NO se versionan**:

- Nombres reales de los niños (`Preescolar/kids.js`, `quinto/kids.js`)
- Videos / audios de los niños (`Videos Preescolar/`, `Audios Quinto/`)
- Archivos `.xlsx`, `.xls`, `.csv` con listas o datos
- La carpeta `Versión 1.0/` (archivo histórico con datos antiguos)

Ver `.gitignore` para la lista completa. Lo que **sí** se versiona:

- Toda la lógica (`functions.js`, `style.css`, `index.html`)
- Las plantillas (`kids.sample.js`)
- La carpeta `Media/` con los videos de la mascota

---

## 🎨 Mascota

La mascota búho usa varios videos en `Media/`:

| Archivo                          | Cuándo se usa                                |
|----------------------------------|----------------------------------------------|
| `Mascota.mp4`                    | Estado de reposo (dashboard, en loop)        |
| `Mascota viendo videos 1-5.mp4`  | Mientras se reproduce un video (Preescolar)  |
| `Mascota escuchando 1-5.mp4`     | Mientras se reproduce un audio (Quinto)      |

Cada vez que se abre el modal de reproducción se elige uno al azar.

---

## 📚 Documentación adicional

- [Guía de uso del proyecto en Cursor](./docs/GUIA_CURSOR_RULETA_RUSA.md)
- [Guía de Debug Móvil](./docs/GUIA_DEBUG_MOVIL.md)
- [CHANGELOG](./CHANGELOG.md)

---

## 🧑‍💻 Desarrollado por

[Jhogarcia](https://github.com/jhogarcia111/) – 2025–2026
