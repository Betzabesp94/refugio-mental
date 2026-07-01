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
│   Next.js 16 — App Router                                       │
│   ┌──────────┐  ┌────────────┐  ┌──────────────┐               │
│   │  /        │  │ /directorio│  │ /psicologos  │  ...          │
│   └──────────┘  └────────────┘  └──────────────┘               │
│                                                                 │
│   lib/api.ts  →  fetch(NEXT_PUBLIC_API_URL)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + CORS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AWS — us-east-1 (RefugioMentalStack)               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │         API Gateway HTTP API                            │   │
│   │                                                         │   │
│   │  GET  /v1/psicologos          →  Lambda: list           │   │
│   │  POST /v1/psicologos          →  Lambda: create         │   │
│   │  GET  /v1/psicologos/{id}     →  Lambda: get            │   │
│   │  PUT  /v1/psicologos/{id}     →  Lambda: update         │   │
│   │  DEL  /v1/psicologos/{id}     →  Lambda: delete         │   │
│   └──────────────────────────┬──────────────────────────────┘   │
│                              │ Lambda Proxy Integration         │
│                              ▼                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │    AWS Lambda (Node.js 22, ARM64, 256 MB)                │  │
│   │                                                          │  │
│   │   lambda/psicologos/                                     │  │
│   │   ├── list.ts    (ScanCommand + filtros en memoria)      │  │
│   │   ├── get.ts     (GetCommand por id)                     │  │
│   │   ├── create.ts  (validación + PutCommand)               │  │
│   │   ├── update.ts  (Get → validación → Put)                │  │
│   │   └── delete.ts  (Get → DeleteCommand)                   │  │
│   │                                                          │  │
│   │   lambda/shared/                                         │  │
│   │   ├── db.ts       (DynamoDB Document Client singleton)   │  │
│   │   ├── response.ts (ok, created, badRequest, notFound…)   │  │
│   │   └── validate.ts (validación de campos del formulario)  │  │
│   └──────────────────────────┬───────────────────────────────┘  │
│                              │ AWS SDK v3                       │
│                              ▼                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │    Amazon DynamoDB  (PAY_PER_REQUEST)                    │  │
│   │    Tabla: refugio-mental-psicologos                      │  │
│   │                                                          │  │
│   │    PK: id (String)                                       │  │
│   │                                                          │  │
│   │    GSI 1: pais-creadoEn-index                            │  │
│   │    GSI 2: especialidad-creadoEn-index                    │  │
│   │    GSI 3: modalidad-creadoEn-index                       │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Capa frontend / Frontend layer

---

### ES

El frontend es una aplicación **Next.js 16 con App Router** desplegada en Vercel. Todas las páginas son Server Components por defecto; los componentes interactivos (directorio, formulario) son Client Components marcados con `"use client"`.

**Acceso a datos:**  
La capa de acceso a datos vive en `lib/api.ts`. Expone tres funciones asíncronas con las mismas firmas que tenía el anterior `lib/storage.ts` (basado en localStorage), lo que garantiza que el resto de la aplicación no necesitó cambios para adoptar el backend real.

```typescript
obtenerPerfiles(filtros?)  // GET /v1/psicologos
obtenerPerfil(id)          // GET /v1/psicologos/{id}
guardarPerfil(datos)       // POST /v1/psicologos
```

**Hook de perfiles:**  
`hooks/usePerfiles.ts` encapsula el estado de carga (`cargando`), error (`error`) y la lista de perfiles. Es el único punto de acoplamiento entre la UI y la capa de datos.

**Variables de entorno:**  
Solo se necesita una variable en el cliente:

```
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
```

### EN

The frontend is a **Next.js 16 App Router** application deployed on Vercel. All pages are Server Components by default; interactive components (directory, form) are Client Components marked with `"use client"`.

**Data access:**  
The data access layer lives in `lib/api.ts`. It exposes three async functions with the same signatures as the previous `lib/storage.ts` (localStorage-based), ensuring the rest of the application required no changes to adopt the real backend.

**Profile hook:**  
`hooks/usePerfiles.ts` encapsulates loading state (`cargando`), error state (`error`), and the profile list. It is the single coupling point between the UI and the data layer.

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
│       └── api-construct.ts            # HTTP API + rutas + CORS
├── lambda/
│   ├── psicologos/  (list, get, create, update, delete)
│   └── shared/      (db, response, validate, types)
├── shared/types/psicologo.ts           # Tipos compartidos
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

The backend is a collection of **AWS Lambda** functions written in TypeScript and compiled with esbuild. Each function has a single responsibility (CRUD). Infrastructure is fully defined with **AWS CDK** in the `backend/` directory.

**IAM least privilege:** Each function has only the DynamoDB permissions it needs — no shared overly-permissive roles.

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

### `PUT /v1/psicologos/{id}`

Actualiza un perfil existente. Reservado para panel administrativo futuro. / Updates an existing profile. Reserved for the future admin panel.

**Response 200:** `Psicologo` actualizado  
**Response 404:** Perfil no encontrado

---

### `DELETE /v1/psicologos/{id}`

Elimina un perfil. Reservado para panel administrativo futuro. / Deletes a profile. Reserved for the future admin panel.

**Response 204:** Sin cuerpo / No body

---

## Seguridad / Security

---

### ES

- **CORS:** API Gateway solo acepta requests de `https://refugio-mental.vercel.app` y `localhost`. No hay wildcards.
- **IAM least privilege:** Cada Lambda tiene exactamente los permisos que necesita sobre DynamoDB.
- **Sin credenciales en código:** La URL de la API es pública por diseño (es un directorio público). Las credenciales AWS nunca se incluyen en variables `NEXT_PUBLIC_`.
- **Validación en servidor:** Toda validación ocurre en Lambda antes de escribir en DynamoDB. Las validaciones del formulario React son solo UX, no la barrera de seguridad.
- **Sin autenticación:** Deliberado para el MVP. Mitigación: validar `aceptaDirectorio: true` en Lambda. Roadmap: Rate limiting + Cognito.

### EN

- **CORS:** API Gateway only accepts requests from `https://refugio-mental.vercel.app` and `localhost`. No wildcards.
- **IAM least privilege:** Each Lambda has exactly the DynamoDB permissions it needs.
- **No credentials in code:** The API URL is public by design (it's a public directory). AWS credentials are never included in `NEXT_PUBLIC_` variables.
- **Server-side validation:** All validation occurs in Lambda before writing to DynamoDB. React form validations are UX only, not the security barrier.
- **No authentication:** Deliberate for the MVP. Mitigation: validate `aceptaDirectorio: true` in Lambda. Roadmap: Rate limiting + Cognito.

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

---

*Para proponer cambios de arquitectura, abre un issue con el label `architecture` describiendo el problema y la solución propuesta antes de implementar.*

*To propose architecture changes, open an issue with the `architecture` label describing the problem and proposed solution before implementing.*
