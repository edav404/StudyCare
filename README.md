# 🎓 StudyCare

**StudyCare** es una aplicación web construida con **Angular (v20)**, diseñada para ayudar a los estudiantes a equilibrar su productividad y bienestar.  
Incluye módulos de **Pomodoro**, **hábitos saludables**, **recursos de relajación**, **estados de ánimo** y un sistema de usuario básico (persistente en *localStorage*).

---

## 🚀 Tecnologías principales

- **Framework:** Angular 20 (standalone components)  
- **Lenguaje:** TypeScript  
- **Estilos:** TailwindCSS (PostCSS)  
- **Datos locales:** LocalStorage  
- **Testing:** Karma + Jasmine  

---

## 🧩 Estructura general del proyecto

```
src/
├── app/
│ ├── app.ts # Componente raíz (standalone)
│ ├── app.routes.ts # Definición de rutas
│ ├── app.config.ts # Providers globales
│ └── pages/
│ ├── pg-login/ # Login y registro de usuario
│ ├── pg-inicio/ # Dashboard principal
│ ├── pg-bienestar/ # Hábitos saludables (CRUD local)
│ ├── pg-estados-animo/ # Registro de estados emocionales
│ ├── pg-recursos/ # Recursos curados (filtros y favoritos)
│ ├── pg-pomodoro/ # Reloj Pomodoro
│ ├── navbar/ # Header principal
│ └── navbar-bottom/ # Barra de navegación inferior
├── assets/data/recursos.json # Datos locales de recursos
├── styles.css # Estilos globales y Tailwind
```

---

## 🗺️ Rutas principales

| Ruta | Componente | Descripción |
|------|-------------|-------------|
| `/login` | `PgLogin` | Inicio de sesión |
| `/registrar` | `PgRegistrar` | Registro de usuario |
| `/inicio` | `PgInicio` | Panel principal con acceso al Pomodoro |
| `/bienestar` | `PgBienestarComponent` | Gestión de hábitos saludables |
| `/recursos` | `PgRecursosComponent` | Recursos filtrables y favoritos |
| `/estados-animo` | `PgEstadosAnimo` | Registro emocional |
| `/pomodoro` | `PgPomodoroComponent` | Temporizador de estudio Pomodoro |

---

## 💾 Persistencia local

Los datos se almacenan en **LocalStorage** bajo claves predefinidas:

| Clave | Propósito |
|--------|------------|
| `currentUser` | Usuario actualmente autenticado |
| `users` | Lista de usuarios registrados |
| `studycare_favorites` | Recursos marcados como favoritos |
| `studycare_pomodoro_v1` | Estado del temporizador Pomodoro |
| `studycare_tasks` | Tareas personales del usuario |

---

## 🧠 Módulos destacados

### 🕒 Pomodoro
- Ciclo de **25 minutos de estudio / 5 de descanso**  
- Persistencia entre rutas  
- Contador de ciclos completados  
- Alerta sonora o visual al finalizar el ciclo  

### 🌿 Bienestar / Hábitos
- CRUD local para añadir, editar o eliminar hábitos  
- Marcar hábitos diarios como completados  
- Diseño minimalista y amigable  

### 🎧 Recursos
- Filtros por categoría y tipo (video, guía, artículo)  
- Marcado de favoritos persistente  
- Carga desde `assets/data/recursos.json`

---

## 🧰 Instalación y ejecución

### 1️⃣ Requisitos
- Node.js ≥ 18  
- npm ≥ 9  
- (Opcional) Angular CLI (`npm install -g @angular/cli`)

### 2️⃣ Instalación
```bash
npm install
```

### 3️⃣ Modo desarrollo
```bash
npm run build
```

## 🪲 Problemas frecuentes

Los datos se almacenan en **LocalStorage** bajo claves predefinidas:

| Error | Solución |
|--------|------------|
| `Página en blanco o redirección` | Verifica rutas en `app.routes.ts` |
| `Recursos no cargan` | Confirma que `recursos.json` está en `/assets/data` |
| `Favoritos no se guardan` | Revisa la clave `studycare_favorites` en LocalStorage |

## 🪲 Licencia

Este proyecto se distribuye bajo la licencia MIT.
Desarrollado por el equipo StudyCare.
