# Arquitectura — Refugio Mental
# Architecture — Refugio Mental

> Este documento describe la arquitectura técnica del proyecto y se mantiene actualizado con cada cambio significativo de infraestructura.
>
> This document describes the technical architecture of the project and is kept up to date with every significant infrastructure change.

---

## Tabla de contenidos / Table of Contents

- [Resumen / Overview](#resumen--overview)
- [Diagrama / Diagram](#diagrama--diagram)
- [Capa frontend / Frontend layer](#capa-frontend--frontend-layer)
- [Capa backend / Backend layer](#capa-backend--backend-layer)
- [Base de datos / Database](#base-de-datos--database)
- [API Reference](#api-reference)
- [Seguridad / Security](#seguridad--security)
- [Costos / Costs](#costos--costs)
- [Historial de cambios / Changelog](#historial-de-cambios--changelog)

---

## Resumen / Overview

---

### ES

Refugio Mental utiliza una arquitectura **serverless** completamente administrada. El frontend es una aplicación Next.js estática desplegada en Vercel. El backend es un conjunto de funciones Lambda expuestas a través de API Gateway HTTP API, con DynamoDB como base de datos. Toda la infraestructura AWS se define como código con CDK TypeScript.

El principio central de diseño es **bajo costo a escala pequeña**: en condiciones de uso típicas para un proyecto humanitario, el costo mensual esperado es $0 (cubierto por el Free Tier de AWS).

### EN

Refugio Mental uses a fully managed **serverless** architecture. The frontend is a static Next.js application deployed on Vercel. The backend consists of Lambda functions exposed through API Gateway HTTP API, with DynamoDB as the database. All AWS infrastructure is defined as code with CDK TypeScript.

The central design principle is **low cost at small scale**: under typical usage for a humanitarian project, the expected monthly cost is $0 (covered by the AWS Free Tier).

---

## Diagrama / Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO / USER                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL (Edge Network)                       │
│                                                                 │
│   Next.js — App Router                                          │
│   ┌──────────┐  ┌────────────┐  ┌──────────────┐  ┌────────┐   │
│   │  /        │  │ /directorio│  │ /psicologos  │  │ /admin │   │
│   └──────────┘  └────────────┘  └──────────────┘  └────────┘   │
│                                                                 │
│   lib/api.ts  →  fetch(NEXT_PUBLIC_API_URL)                     │
└────────────┬───────────────────────────────────────────────────┘
             │ HTTPS + CORS          │ Cognito SDK (auth admin)
             ▼                       ▼
┌─────────────────────────┐  ┌──────────────────────────────────┐
│  AWS — RefugioMentalStack│  │  Amazon Cognito User Pool        │
│                         │  │  NEXT_PUBLIC_COGNITO_USER_POOL_ID │
│  API Gateway HTTP API   │  │  NEXT_PUBLIC_COGNITO_CLIENT_ID    │
│                         │  └──────────────────────────────────┘
│  ── Rutas públicas ──   │
│  GET  /v1/psicologos  → list       │
│  POST /v1/psicologos  → create     │
│  GET  /v1/psicologos/{id} → get    │
│                         │
│  ── Rutas admin (JWT) ──│
│  GET    /v1/admin/psicologos → listAdmin  │
│  PATCH  /v1/psicologos/{id} → verify      │
│  PUT    /v1/psicologos/{id} → update      │
│  DELETE /v1/psicologos/{id} → delete      │
│             │ Lambda Proxy Integration    │
│             ▼                            │
│  AWS Lambda (Node.js 22, ARM64, 256 MB)  │
│                                          │
│  lambda/psicologos/                      │
│  ├── list.ts      (Scan APPROVED only)   │
│  ├── listAdmin.ts (Scan all — admin)     │
│  ├── get.ts       (GetCommand por id)    │
│  ├── create.ts    (validación + Put)     │
│  ├── update.ts    (Get → validación → Put│
│  ├── verify.ts    (UpdateCommand estado) │
│  └── delete.ts    (Get → DeleteCommand)  │
│             │ AWS SDK v3                 │
│             ▼                            │
│  Amazon DynamoDB  (PAY_PER_REQUEST)      │
│  Tabla: refugio-mental-psicologos        │
│  PK: id (String)                        │
│  GSI 1: pais-creadoEn-index             │
│  GSI 2: especialidad-creadoEn-index     │
│  GSI 3: modalidad-creadoEn-index        │
└──────────────────────────────────────────┘
```

---

## Capa frontend / Frontend layer

---

### ES

El frontend es una aplicación **Next.js 16 con App Router** desplegada en Vercel. Todas las páginas son Server Components por defecto; los componentes interactivos (directorio, formulario) son Client Components marcados con `"use client"`.

**Acceso a datos:**  
La capa de acceso a datos vive en `lib/api.ts`. Expone funciones asíncronas para el directorio público y para el panel admin.

```typescript
// Público
obtenerPerfiles(filtros?)           // GET /v1/psicologos
obtenerPerfil(id)                   // GET /v1/psicologos/{id}
guardarPerfil(datos)                // POST /v1/psicologos

// Admin (requieren token JWT de Cognito)
obtenerPerfilesAdmin(token)         // GET /v1/admin/psicologos
actualizarEstadoPerfil(id, estado, token)  // PATCH /v1/psicologos/{id}
eliminarPerfil(id, token)           // DELETE /v1/psicologos/{id}
```

**Hook de perfiles:**  
`hooks/usePerfiles.ts` encapsula el estado de carga (`cargando`), error (`error`) y la lista de perfiles para el directorio público. El panel admin (`app/admin/page.tsx`) gestiona su propio estado.

**Autenticación admin:**  
`lib/auth.ts` encapsula el flujo de autenticación con Amazon Cognito (sign-in, sign-out, obtener token). El panel en `/admin` requiere un JWT válido almacenado en `localStorage`; las rutas protegidas de API Gateway lo validan server-side.

**Variables de entorno:**

```
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<region>_<id>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<client-id>
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### EN

The frontend is a **Next.js App Router** application deployed on Vercel. All pages are Server Components by default; interactive components (directory, form, admin panel) are Client Components marked with `"use client"`.

**Data access:**  
The data access layer lives in `lib/api.ts`. It exposes async functions for both the public directory and the admin panel (token-protected).

**Admin authentication:**  
`lib/auth.ts` wraps the Cognito sign-in / sign-out / token retrieval flow. Protected API routes enforce JWT validation server-side via API Gateway JWT Authorizer.

**Profile hook:**  
`hooks/usePerfiles.ts` encapsulates loading state (`cargando`), error state (`error`), and the profile list for the public directory.

---

## Capa backend / Backend layer

---

### ES

El backend es una colección de funciones **AWS Lambda** escritas en TypeScript y compiladas con esbuild. Cada función tiene una responsabilidad única (CRUD). La infraestructura se define completamente con **AWS CDK** en el directorio `backend/`.

**Organización:**

```
backend/
├── bin/app.ts                          # CDK App entry point
├── lib/
│   ├── stacks/refugio-mental-stack.ts  # Stack principal
│   └── constructs/
│       ├── database-construct.ts       # DynamoDB + GSIs
│       ├── lambda-construct.ts         # Funciones + IAM
│       ├── cognito-construct.ts        # Cognito User Pool + cliente
│       └── api-construct.ts            # HTTP API + rutas + CORS + JWT Authorizer
├── lambda/
│   ├── psicologos/  (list, listAdmin, get, create, update, verify, delete)
│   └── shared/      (db, response, validate, types)
├── shared/types/psicologo.ts           # Tipos compartidos frontend/backend
└── scripts/seed.ts                     # Poblar DynamoDB inicial
```

**Permisos IAM mínimos:** Cada función tiene únicamente los permisos que necesita sobre la tabla DynamoDB:

| Función | Permisos DynamoDB |
|---------|------------------|
| list    | GetItem, Scan, Query |
| get     | GetItem |
| create  | PutItem |
| update  | GetItem, PutItem |
| delete  | GetItem, DeleteItem |

### EN

The backend is a collection of **AWS Lambda** functions written in TypeScript and compiled with esbuild. Each function has a single responsibility. Infrastructure is fully defined with **AWS CDK** in the `backend/` directory.

**IAM least privilege:** Each function has only the DynamoDB permissions it needs. Admin routes are protected by a Cognito JWT Authorizer at the API Gateway level.

---

## Base de datos / Database

---

### ES

Se usa **Amazon DynamoDB** en modo `PAY_PER_REQUEST` (on-demand). No hay capacidad provisionada que pagar cuando el tráfico es bajo o nulo.

**Tabla principal:** `refugio-mental-psicologos`

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `id` | String — PK | Generado por Lambda: `psi-{timestamp}-{random}` |
| `nombre` | String | Primer nombre |
| `apellido` | String | Apellido(s) |
| `fotografia` | String | URL de imagen pública |
| `especialidad` | String | Ej: "Trauma y Emergencias" |
| `ciudad` | String | Ciudad de atención |
| `pais` | String | País de residencia |
| `idiomas` | List\<String\> | Idiomas que domina |
| `modalidad` | String | `online`, `presencial` o `ambas` |
| `biografia` | String | Máx. 400 caracteres |
| `calendlyUrl` | String | Enlace público de Calendly |
| `email` | String? | Opcional, no se muestra públicamente |
| `redesSociales` | List? | `[{plataforma, url}]` |
| `aceptaDirectorio` | Boolean | Siempre `true` (validado en Lambda) |
| `creadoEn` | String | ISO 8601, generado en Lambda |
| `estadoVerificacion` | String | `PENDING`, `APPROVED` o `REJECTED` — gestionado por admin |
| `credencialUrl` | String | URL del certificado/credencial profesional |

**Índices Secundarios Globales (GSI):**

| Nombre | PK | SK | Uso |
|--------|----|----|-----|
| `pais-creadoEn-index` | `pais` | `creadoEn` | Filtrar por país ordenado por fecha |
| `especialidad-creadoEn-index` | `especialidad` | `creadoEn` | Filtrar por especialidad |
| `modalidad-creadoEn-index` | `modalidad` | `creadoEn` | Filtrar por modalidad |

**Estrategia actual:** Para el MVP (< 1000 registros) se usa `Scan` con `FilterExpression` en Lambda. Los GSIs están creados para migrar a `Query` sin cambiar el esquema cuando el volumen crezca.

### EN

**Amazon DynamoDB** is used in `PAY_PER_REQUEST` (on-demand) mode. No provisioned capacity to pay for when traffic is low or zero.

**Current strategy:** For the MVP (< 1,000 records), a `Scan` with `FilterExpression` is performed in Lambda. GSIs are created upfront to migrate to `Query` without schema changes when volume grows.

---

## API Reference

Todas las rutas tienen el prefijo `/v1`. La URL base es el valor de `NEXT_PUBLIC_API_URL`.

All routes are prefixed with `/v1`. The base URL is the value of `NEXT_PUBLIC_API_URL`.

---

### `GET /v1/psicologos`

Lista todos los perfiles con `aceptaDirectorio: true`. / Lists all profiles with `aceptaDirectorio: true`.

**Query params (todos opcionales / all optional):**

| Param | Descripción |
|-------|-------------|
| `q` | Búsqueda libre en nombre, bio, ciudad, país / Free-text search |
| `especialidad` | Filtrar por especialidad exacta |
| `modalidad` | `online`, `presencial` o `ambas` |
| `pais` | Filtrar por país exacto |
| `idioma` | Filtrar perfiles que incluyan este idioma |

**Response 200:**
```json
{ "items": [Psicologo], "count": 6 }
```

---

### `GET /v1/psicologos/{id}`

Obtiene un perfil por ID. / Gets a single profile by ID.

**Response 200:** `Psicologo`  
**Response 404:** `{ "error": "Perfil no encontrado" }`

---

### `POST /v1/psicologos`

Crea un nuevo perfil. / Creates a new profile.

**Body:** `Omit<Psicologo, "id" | "creadoEn">`

**Validaciones / Validations:**
- Campos requeridos: `nombre`, `apellido`, `especialidad`, `ciudad`, `pais`, `idiomas`, `modalidad`, `biografia`, `calendlyUrl`, `aceptaDirectorio`
- `calendlyUrl` debe comenzar con `https://`
- `biografia` máximo 400 caracteres
- `aceptaDirectorio` debe ser `true`

**Response 201:** `Psicologo` (con `id` y `creadoEn` generados)  
**Response 400:** `{ "error": "...", "fields": { campo: mensaje } }`

---

### `GET /v1/admin/psicologos` 🔒

Devuelve **todos** los perfiles sin filtrar por `estadoVerificacion` (incluye PENDING, APPROVED y REJECTED). Requiere JWT de Cognito. / Returns **all** profiles regardless of `estadoVerificacion`. Requires Cognito JWT.

**Response 200:**
```json
{ "items": [Psicologo], "count": 12 }
```

---

### `PATCH /v1/psicologos/{id}` 🔒

Actualiza el `estadoVerificacion` de un perfil. Usado por el panel admin para aprobar o rechazar. / Updates `estadoVerificacion`. Used by the admin panel to approve or reject.

**Body:** `{ "estadoVerificacion": "APPROVED" | "REJECTED" }`

**Response 200:** `{ "message": "Estado actualizado correctamente" }`  
**Response 400:** Estado inválido  
**Response 404:** Perfil no encontrado

---

### `PUT /v1/psicologos/{id}` 🔒

Actualiza un perfil existente (admin). / Updates an existing profile (admin).

**Response 200:** `Psicologo` actualizado  
**Response 404:** Perfil no encontrado

---

### `DELETE /v1/psicologos/{id}` 🔒

Elimina un perfil (admin). / Deletes a profile (admin).

**Response 204:** Sin cuerpo / No body

> 🔒 Requiere header `Authorization: Bearer <cognito-id-token>` / Requires `Authorization: Bearer <cognito-id-token>` header.

---

## Seguridad / Security

---

### ES

- **CORS:** API Gateway solo acepta requests de `https://refugio-mental.vercel.app` y `localhost`. No hay wildcards.
- **IAM least privilege:** Cada Lambda tiene exactamente los permisos que necesita sobre DynamoDB.
- **Sin credenciales en código:** La URL de la API es pública por diseño (es un directorio público). Las credenciales AWS nunca se incluyen en variables `NEXT_PUBLIC_`.
- **Validación en servidor:** Toda validación ocurre en Lambda antes de escribir en DynamoDB. Las validaciones del formulario React son solo UX, no la barrera de seguridad.
- **Autenticación admin:** Las rutas `/v1/admin/*`, PATCH, PUT y DELETE están protegidas por un JWT Authorizer de Cognito en API Gateway. Solo usuarios del User Pool pueden acceder.
- **Registro público sin auth:** Deliberado para facilitar la inscripción de psicólogos voluntarios. Los perfiles nuevos quedan en estado `PENDING` hasta que un admin los apruebe desde el panel. Roadmap: Rate limiting.

### EN

- **CORS:** API Gateway only accepts requests from `https://refugio-mental.vercel.app` and `localhost`. No wildcards.
- **IAM least privilege:** Each Lambda has exactly the DynamoDB permissions it needs.
- **No credentials in code:** The API URL is public by design (it's a public directory). AWS credentials are never included in `NEXT_PUBLIC_` variables.
- **Server-side validation:** All validation occurs in Lambda before writing to DynamoDB. React form validations are UX only, not the security barrier.
- **Admin authentication:** Admin routes are protected by a Cognito JWT Authorizer at API Gateway. Only User Pool members can access `/v1/admin/*`, PATCH, PUT, and DELETE.
- **No public authentication:** Deliberate to reduce friction for volunteer registration. New profiles start as `PENDING` until approved by an admin. Roadmap: Rate limiting.

---

## Costos / Costs

---

### ES

Estimación mensual en condiciones de uso típico para un proyecto humanitario pequeño (< 10,000 requests/mes):

| Servicio | Free Tier | Costo estimado |
|----------|-----------|---------------|
| AWS Lambda | 1M requests + 400,000 GB-s | **$0** |
| Amazon DynamoDB | 25 GB + 25 RCU + 25 WCU permanentes | **$0** |
| API Gateway HTTP API | 1M requests (12 meses) | **$0** |
| CloudWatch Logs | 5 GB ingestión | **$0** |
| **Total** | | **$0 / mes** |

Fuera del Free Tier: < $0.05/mes al volumen esperado.

### EN

Monthly estimate under typical usage for a small humanitarian project (< 10,000 requests/month):

All services stay within AWS Free Tier at expected volume. Outside Free Tier: < $0.05/month.

---

## Historial de cambios / Changelog

---

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-07-01 | v1.0 | MVP inicial con LocalStorage y seed data |
| 2026-07-01 | v2.0 | Migración a AWS serverless: DynamoDB + Lambda + API Gateway + CDK |
| 2026-07-03 | v2.1 | Panel admin con Cognito auth, `estadoVerificacion` (PENDING/APPROVED/REJECTED), `credencialUrl`, endpoint `GET /v1/admin/psicologos`, lambdas `listAdmin` y `verify` |

---

*Para proponer cambios de arquitectura, abre un issue con el label `architecture` describiendo el problema y la solución propuesta antes de implementar.*

*To propose architecture changes, open an issue with the `architecture` label describing the problem and proposed solution before implementing.*
