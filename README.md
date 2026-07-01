# Refugio Mental 🫶

**Directorio comunitario gratuito de apoyo psicológico — Venezuela 24J**

Refugio Mental conecta psicólogos voluntarios con personas afectadas emocionalmente por el doble terremoto ocurrido en Venezuela el 24 de junio de 2026. El objetivo es reducir la brecha entre quienes necesitan apoyo emocional y los profesionales dispuestos a brindarlo, sin intermediarios, sin costos y sin burocracia.

> **Aviso importante:** Este proyecto NO reemplaza servicios de emergencia ni atención médica profesional. Es únicamente un directorio comunitario. Ante una emergencia médica, llama al **911**.

---

## ¿Cómo ejecutarlo localmente?

### Requisitos

- Node.js v20 o superior
- npm v9 o superior

### Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/refugio-mental.git
cd refugio-mental

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm run start
```

---

## Estructura del proyecto

```
refugio-mental/
├── app/                        # App Router de Next.js
│   ├── layout.tsx              # Layout raíz con Navbar, Footer y providers
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # ThemeProvider + Toaster
│   ├── directorio/
│   │   └── page.tsx            # Directorio de psicólogos
│   ├── psicologos/
│   │   ├── page.tsx            # Info para psicólogos voluntarios
│   │   ├── registrar/
│   │   │   └── page.tsx        # Formulario de registro
│   │   └── guia/
│   │       └── page.tsx        # Guía de Calendly
│   └── pacientes/
│       └── page.tsx            # Info y guía para pacientes
├── components/
│   ├── ui/                     # Componentes base (Button, Card, Input…)
│   └── shared/                 # Componentes compartidos (Navbar, Footer…)
├── features/
│   ├── directory/              # Lógica y UI del directorio
│   │   ├── DirectoryGrid.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   ├── home/
│   │   └── Hero.tsx
│   └── registration/
│       └── ProfileForm.tsx     # Formulario completo de registro
├── hooks/
│   ├── useLocalStorage.ts      # Hook genérico de LocalStorage
│   └── usePerfiles.ts          # Hook de perfiles (leer, filtrar, guardar)
├── lib/
│   ├── utils.ts                # cn(), generarId(), formatearFecha()
│   └── storage.ts              # Capa de datos (fácil de reemplazar por API)
├── types/
│   └── index.ts                # Tipos TypeScript del dominio
└── data/
    └── seed.ts                 # Perfiles ficticios de ejemplo
```

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16.2 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19 |
| Estilos | Tailwind CSS 4 |
| Animaciones | tailwindcss-animate |
| Componentes | Radix UI |
| Variantes | class-variance-authority + clsx + tailwind-merge |
| Iconos | Lucide React |
| Toasts | Sonner |
| Tema | next-themes (claro/oscuro) |
| Persistencia | LocalStorage (client-side) |

---

## Flujo de la aplicación

1. **Home** — Presentación del proyecto con llamadas a la acción.
2. **Directorio** — Tarjetas de psicólogos con búsqueda y filtros por especialidad, idioma, modalidad y país.
3. **Registro** — Formulario para que psicólogos publiquen su perfil (guardado en LocalStorage).
4. **Guía Calendly** — Tutorial paso a paso para configurar el enlace de agendamiento.
5. **Para pacientes** — Información sobre cómo elegir psicólogo, qué esperar y números de emergencia.

---

## Limitaciones del MVP

- **Sin backend**: Los datos se guardan exclusivamente en LocalStorage del navegador. Si el usuario borra datos del navegador, los perfiles registrados por usuarios desaparecen (los ficticios de seed permanecen).
- **Sin moderación**: Cualquier persona puede registrarse. No hay verificación de credenciales.
- **Sin autenticación**: No hay sistema de inicio de sesión.
- **Sin persistencia compartida**: Los perfiles registrados solo son visibles en el dispositivo y navegador donde se registraron.
- **Sin notificaciones**: No hay sistema de correos ni confirmaciones desde la plataforma.

---

## Arquitectura de datos

La capa de datos está intencionalmente desacoplada del resto de la aplicación. Todo el acceso a datos pasa por `lib/storage.ts`, que expone tres funciones:

```typescript
obtenerPerfiles(): Psicologo[]   // GET /api/psicologos (futuro)
guardarPerfil(p: Psicologo): void // POST /api/psicologos (futuro)
limpiarPerfilesUsuario(): void    // solo para desarrollo
```

Para migrar a un backend real, basta con reemplazar el cuerpo de estas funciones por llamadas `fetch()`.

---

## Posibles mejoras futuras

- [ ] **Backend + base de datos** (PostgreSQL + API REST o GraphQL)
- [ ] **Moderación de perfiles** antes de publicación
- [ ] **Verificación de credenciales** profesionales
- [ ] **Autenticación** para psicólogos con gestión de su propio perfil
- [ ] **Búsqueda geográfica** por proximidad
- [ ] **Videollamadas integradas** (sin necesidad de Calendly externo)
- [ ] **Sistema de reseñas** anónimas
- [ ] **Panel administrativo** para gestión de perfiles
- [ ] **Internacionalización** (i18n) para comunidades no hispanohablantes
- [ ] **Notificaciones push** o por correo
- [ ] **Accesibilidad mejorada** con revisión WCAG 2.1 AA completa
- [ ] **PWA** para uso offline

---

## Licencia

MIT — Libre para usar, modificar y distribuir con atribución.

---

*Desarrollado en un hackathon humanitario como respuesta inmediata al terremoto del 24 de junio de 2026 en Venezuela.*
