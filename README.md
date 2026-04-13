# Ruleta Rusa

## 📋 Descripción
Aplicación de entretenimiento que simula el juego de ruleta rusa con elementos visuales y sonoros. Incluye diferentes variantes del juego, sistema de puntuación, efectos de sonido realistas, y opciones de personalización. Diseñado para proporcionar entretenimiento controlado con elementos de suspense y adrenalina. Dirigido a adultos que buscan entretenimiento digital y juegos de azar controlados. 

## 🎯 Información del Proyecto
- **ID en Project Tracker**: 31
- **Tipo**: web
- **Estado**: Activo

## 🌐 Puertos Asignados
- **Backend**: http://localhost:3031
- **Frontend**: http://localhost:4031

## 🗄️ Base de Datos
- **Nombre**: `project_31`
- **Tipo**: MySQL
- **Puerto**: 3306
- **Host**: localhost
- **Cadena de Conexión**: `mysql://root@localhost:3306/project_31`


## 🚀 Inicio Rápido

### 1. Verificar Conexión al Project Tracker
```bash
curl http://localhost:3000/api/project-tracker/projects/31
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar Desarrollo
```bash
# Backend
npm run dev

# Frontend (en otra terminal)
cd frontend && npm run dev
```

## 📚 Documentación
- [Guía de Integración con Cursor](./docs/GUIA_CURSOR_RULETA_RUSA.md)
- [Guía de Debug Móvil](./docs/GUIA_DEBUG_MOVIL.md)
- [Project Tracker](http://localhost:3000)

## 🔧 Comandos Útiles

### Crear Feature
```bash
curl -X POST http://localhost:3000/api/project-tracker/features \
  -H "Content-Type: application/json" \
  -d '{"projectId": 31, "featureName": "Nueva Feature", "description": "Descripción", "status": "pendiente"}'
```

### Ver Features del Proyecto
```bash
curl http://localhost:3000/api/project-tracker/features?projectId=31
```

---
*Generado automáticamente por Project Tracker*

