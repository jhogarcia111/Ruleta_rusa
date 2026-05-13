# Changelog

Todas las versiones notables del proyecto se documentan acá.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] – 2026-05-13

Rediseño completo y división del proyecto en dos cursos.

### Añadido
- **Dos versiones independientes** del proyecto: `Preescolar/` (videos) y
  `quinto/` (audios), cada una con su propia lista de niños, configuración y
  carpeta de medios.
- **Mascota búho animada** (`Media/Mascota.mp4`, `Mascota viendo videos
  1-5.mp4`, `Mascota escuchando 1-5.mp4`):
  - En el dashboard se reproduce en loop el video de reposo.
  - Al abrir el modal de reproducción, la mascota cambia a uno de los videos
    activos elegido al azar.
  - En Preescolar la mascota aparece también dentro del modal de selección.
- **Panel "Por salir"** en el dashboard con la lista de niños que aún no han
  sido elegidos en la sesión.
- **Reproducción secuencial** de partes: si un niño tiene varios archivos
  (Parte 1, Parte 2…) se reproducen automáticamente, uno tras otro, sin
  cerrar el modal.
- **Botón "Reproducir todo"** en el panel de administración para los niños con
  múltiples partes.
- **Versión visible en el footer**: `Ruleta de Videos · Preescolar · V2.0.0`
  / `Ruleta de Audios · Quinto · V2.0.0`.
- `CHANGELOG.md` con historial de versiones.
- `kids.sample.js` en ambos cursos como plantilla para que cualquiera pueda
  clonar el repo y configurar su propia lista.

### Cambiado
- **Rediseño completo de UI** inspirado en dashboards modernos tipo PBS Kids:
  fondo oscuro con detalles neón, tarjetas redondeadas, ruleta con paleta de
  colores vivos y resplandor durante el giro.
- **Layout en grilla de 3 columnas**: mascota / ruleta / "Por salir".
- **Botón de admin** movido a la esquina superior derecha (antes estaba en
  el centro inferior y tapaba la ruleta).
- **Footer en 3 columnas**: nombre del proyecto + versión al centro,
  "Desarrollado por Jhogarcia" a la derecha.
- **Lista de niños separada** en `kids.js` (no se versiona); `functions.js`
  ahora solo contiene la lógica.
- Carpetas de media renombradas y movidas dentro de cada curso
  (`Preescolar/Videos Preescolar/`, `quinto/Audios Quinto/`).

### Corregido
- **Flickeo del scrollbar** al girar la ruleta: ahora la barra vertical es
  permanente (`html { overflow-y: scroll }`) y se previene el scroll
  horizontal por la rotación del canvas.
- **Botones del panel de admin** que crecían demasiado y se desordenaban: se
  ajustó la especificidad de CSS y se reorganizó el render para mostrar
  primero todos los inputs y después todos los botones.
- Mascota en modales no aparecía en Preescolar: agregada en los modales de
  selección y reproducción.

### Seguridad / Privacidad
- `.gitignore` reforzado para no exponer en GitHub:
  - Nombres reales de niños (`**/kids.js`).
  - Videos y audios reales del alumnado (`Videos Preescolar/`,
    `Audios Quinto/`, `videos/`).
  - Archivos sensibles (`*.xlsx`, `*.xls`, `*.csv`, `data.txt`).
  - Carpeta `Versión 1.0/` archivada con datos antiguos.
- Las plantillas (`kids.sample.js`) sí se versionan.

---

## [1.7.0] – 2026-04

Última versión "monolítica" antes del split por cursos.

### Añadido
- Reproducción de videos por niño desde una sola ruleta.
- Lista de niños embebida en `kids.js`.
- Panel de administración para reproducir manualmente cualquier video.
- Modal de selección con animaciones (vibración del nombre, efecto
  "billete de lotería").

### Cambiado
- Múltiples iteraciones de UI (V1.5 → V1.6 → V1.7) ajustando colores,
  tipografía, tamaños y posiciones de la ruleta.

> Esta versión queda archivada en la carpeta `Versión 1.0/` (no versionada
> por contener datos personales reales).

---

## Versiones anteriores

- **V1.6** – Iteración previa de UI.
- **V1.5** – Iteración previa de UI.
- **V1.0** – Versión inicial: ruleta básica de videos, sin panel de admin
  ni mascota.
