# Guía de despliegue — Refugio Mental
# Deployment Guide — Refugio Mental

> Esta guía cubre el despliegue completo del proyecto desde cero: backend en AWS y frontend en Vercel.
>
> This guide covers the full project deployment from scratch: backend on AWS and frontend on Vercel.

---

## Tabla de contenidos / Table of Contents

- [Requisitos previos / Prerequisites](#requisitos-previos--prerequisites)
- [1. Clonar el repositorio / Clone the repository](#1-clonar-el-repositorio--clone-the-repository)
- [2. Desplegar el backend en AWS / Deploy backend to AWS](#2-desplegar-el-backend-en-aws--deploy-backend-to-aws)
- [3. Poblar la base de datos / Seed the database](#3-poblar-la-base-de-datos--seed-the-database)
- [4. Ejecutar el frontend localmente / Run frontend locally](#4-ejecutar-el-frontend-localmente--run-frontend-locally)
- [5. Desplegar el frontend en Vercel / Deploy frontend to Vercel](#5-desplegar-el-frontend-en-vercel--deploy-frontend-to-vercel)
- [6. Verificar el funcionamiento / Verify everything works](#6-verificar-el-funcionamiento--verify-everything-works)
- [Actualizaciones posteriores / Subsequent updates](#actualizaciones-posteriores--subsequent-updates)
- [Destruir la infraestructura / Destroy infrastructure](#destruir-la-infraestructura--destroy-infrastructure)
- [Solución de problemas / Troubleshooting](#solución-de-problemas--troubleshooting)

---

## Requisitos previos / Prerequisites

---

### ES

Antes de comenzar, asegúrate de tener instalado y configurado lo siguiente:

| Herramienta | Versión mínima | Verificar |
|-------------|----------------|-----------|
| Node.js | 20 | `node --version` |
| npm | 9 | `npm --version` |
| AWS CLI | 2 | `aws --version` |
| AWS CDK CLI | 2 | `cdk --version` |
| Git | cualquiera | `git --version` |

**Cuenta AWS:**
- Una cuenta AWS activa.
- Un usuario IAM (o rol) con permisos para crear recursos de CloudFormation, DynamoDB, Lambda, API Gateway e IAM roles.
- Las credenciales configuradas localmente con `aws configure` o mediante variables de entorno `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.

**Verificar credenciales:**
```bash
aws sts get-caller-identity
```
Deberías ver tu `Account`, `UserId` y `Arn`.

**Cuenta Vercel:** (solo para el deploy de producción)
- Una cuenta gratuita en [vercel.com](https://vercel.com).
- CLI de Vercel (opcional): `npm i -g vercel`

### EN

Before you begin, make sure you have the following installed and configured:

**AWS Account:**
- An active AWS account.
- An IAM user (or role) with permissions to create CloudFormation, DynamoDB, Lambda, API Gateway, and IAM role resources.
- Credentials configured locally via `aws configure` or through `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` environment variables.

**Verify credentials:**
```bash
aws sts get-caller-identity
```
You should see your `Account`, `UserId`, and `Arn`.

---

## 1. Clonar el repositorio / Clone the repository

```bash
git clone https://github.com/tu-usuario/refugio-mental.git
cd refugio-mental
```

---

## 2. Desplegar el backend en AWS / Deploy backend to AWS

---

### ES

El backend se define completamente con AWS CDK. Sigue estos pasos en orden.

#### Paso 2.1 — Instalar dependencias del backend

```bash
cd backend
npm install
```

#### Paso 2.2 — Bootstrap de CDK (solo la primera vez por cuenta y región)

CDK necesita crear recursos internos en tu cuenta para poder desplegar stacks. Este paso solo se ejecuta **una vez por cuenta AWS y región**. Si ya hiciste bootstrap anteriormente, puedes saltarlo.

```bash
cdk bootstrap
```

Si quieres usar una región distinta de `us-east-1`:

```bash
cdk bootstrap aws://<ACCOUNT_ID>/<REGION>
```

**¿Qué crea el bootstrap?**  
Un bucket S3 y roles IAM internos de CDK. No generan costo significativo.

#### Paso 2.3 — Revisar qué se va a crear (opcional pero recomendado)

```bash
cdk diff
```

Verás un resumen de todos los recursos que CDK va a crear: la tabla DynamoDB, las 5 funciones Lambda, el HTTP API de API Gateway y sus rutas.

#### Paso 2.4 — Desplegar el stack

```bash
cdk deploy
```

CDK te pedirá confirmación para crear los roles IAM. Escribe `y` y presiona Enter.

Si no quieres confirmación manual:

```bash
cdk deploy --require-approval never
```

El proceso tarda aproximadamente **2-3 minutos**. Al finalizar verás:

```
✅  RefugioMentalStack

Outputs:
RefugioMentalStack.ApiUrl   = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
RefugioMentalStack.TableName = refugio-mental-psicologos
```

**Guarda el valor de `ApiUrl`** — lo necesitarás para configurar el frontend.

### EN

The backend is fully defined with AWS CDK. Follow these steps in order.

#### Step 2.1 — Install backend dependencies

```bash
cd backend
npm install
```

#### Step 2.2 — CDK Bootstrap (first time only, per account and region)

CDK needs to create internal resources in your account to deploy stacks. This step runs **once per AWS account and region**. Skip it if you have already bootstrapped.

```bash
cdk bootstrap
```

**What does bootstrap create?**  
An S3 bucket and CDK internal IAM roles. No significant cost.

#### Step 2.3 — Preview what will be created (optional but recommended)

```bash
cdk diff
```

You'll see a summary of all resources CDK will create: the DynamoDB table, 5 Lambda functions, the HTTP API Gateway, and its routes.

#### Step 2.4 — Deploy the stack

```bash
cdk deploy --require-approval never
```

The process takes approximately **2-3 minutes**. At the end you'll see:

```
✅  RefugioMentalStack

Outputs:
RefugioMentalStack.ApiUrl   = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
RefugioMentalStack.TableName = refugio-mental-psicologos
```

**Save the `ApiUrl` value** — you'll need it to configure the frontend.

---

## 3. Poblar la base de datos / Seed the database

---

### ES

El script de seed inserta los 6 perfiles ficticios de ejemplo en DynamoDB. Es **idempotente**: si lo ejecutas varias veces, solo inserta los perfiles que no existan todavía.

```bash
# Desde el directorio backend/
TABLE_NAME=refugio-mental-psicologos AWS_REGION=us-east-1 npm run seed
```

Deberías ver:

```
Seeding 6 profiles into: refugio-mental-psicologos (us-east-1)

  added seed-001 — Valentina Rojas Mendoza
  added seed-002 — Andrés Castillo Ferreira
  ...

Done. Inserted: 6, Skipped: 0
```

Si usas una región distinta, reemplaza `us-east-1` con tu región.

### EN

The seed script inserts the 6 fictional example profiles into DynamoDB. It is **idempotent**: running it multiple times only inserts profiles that don't already exist.

```bash
# From the backend/ directory
TABLE_NAME=refugio-mental-psicologos AWS_REGION=us-east-1 npm run seed
```

If you use a different region, replace `us-east-1` with your region.

---

## 4. Ejecutar el frontend localmente / Run frontend locally

---

### ES

#### Paso 4.1 — Instalar dependencias del frontend

Desde la raíz del proyecto (no desde `backend/`):

```bash
cd ..         # volver a la raíz si estás en backend/
npm install
```

#### Paso 4.2 — Crear el archivo de variables de entorno

```bash
cp .example.env .env.local
```

Abre `.env.local` y reemplaza el valor con la `ApiUrl` que obtuviste en el paso 2.4:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

> ⚠️ **No commits:** `.env.local` está en `.gitignore`. Nunca lo incluyas en un commit.

#### Paso 4.3 — Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El directorio debería cargar los perfiles desde DynamoDB.

### EN

#### Step 4.1 — Install frontend dependencies

From the project root (not from `backend/`):

```bash
cd ..         # go back to root if you're in backend/
npm install
```

#### Step 4.2 — Create the environment variables file

```bash
cp .example.env .env.local
```

Open `.env.local` and replace the placeholder with the `ApiUrl` from step 2.4:

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

> ⚠️ **No commits:** `.env.local` is in `.gitignore`. Never include it in a commit.

#### Step 4.3 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The directory should load profiles from DynamoDB.

---

## 5. Desplegar el frontend en Vercel / Deploy frontend to Vercel

---

### ES

#### Opción A — Desde la CLI de Vercel

```bash
# Desde la raíz del proyecto
npx vercel
```

Sigue el wizard interactivo. Cuando pregunte por variables de entorno, agrega:

```
NEXT_PUBLIC_API_URL = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

#### Opción B — Desde el dashboard de Vercel (recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new).
2. Importa tu repositorio de GitHub.
3. Antes de hacer clic en **Deploy**, ve a **Environment Variables** y agrega:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com`
   - **Environment:** Production, Preview, Development
4. Haz clic en **Deploy**.

#### Agregar tu dominio de producción a CORS

Una vez que Vercel te asigne el dominio de producción (ejemplo: `refugio-mental.vercel.app`), verifica que esté en la lista de `allowOrigins` del `api-construct.ts`:

```typescript
allowOrigins: [
  'https://refugio-mental.vercel.app',  // ← debe coincidir exactamente
  'http://localhost:3000',
],
```

Si el dominio es diferente, actualiza ese archivo y vuelve a ejecutar `cdk deploy` desde `backend/`.

### EN

#### Option A — From the Vercel CLI

```bash
# From the project root
npx vercel
```

Follow the interactive wizard. When asked about environment variables, add:

```
NEXT_PUBLIC_API_URL = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

#### Option B — From the Vercel dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Before clicking **Deploy**, go to **Environment Variables** and add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com`
   - **Environment:** Production, Preview, Development
4. Click **Deploy**.

#### Add your production domain to CORS

Once Vercel assigns your production domain, make sure it's listed in `allowOrigins` in `backend/lib/constructs/api-construct.ts`. If different, update the file and run `cdk deploy` again.

---

## 6. Verificar el funcionamiento / Verify everything works

---

### ES

#### Verificar la API directamente

```bash
# Listar perfiles (reemplaza con tu ApiUrl)
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/v1/psicologos

# Crear un perfil de prueba
curl -X POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/v1/psicologos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "Usuario",
    "fotografia": "",
    "especialidad": "Trauma y Emergencias",
    "ciudad": "Caracas",
    "pais": "Venezuela",
    "idiomas": ["Español"],
    "modalidad": "online",
    "biografia": "Perfil de prueba para verificar el funcionamiento de la API.",
    "calendlyUrl": "https://calendly.com/test",
    "aceptaDirectorio": true
  }'
```

Una respuesta `200` con `{"items": [...]}` confirma que el stack funciona correctamente.

#### Verificar desde el navegador

1. Abre `http://localhost:3000/directorio`.
2. Deberías ver los 6 perfiles de ejemplo cargados desde DynamoDB.
3. Usa el formulario en `/psicologos/registrar` para crear un perfil real.
4. El nuevo perfil debería aparecer inmediatamente en el directorio.

### EN

#### Verify the API directly

```bash
# List profiles (replace with your ApiUrl)
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/v1/psicologos
```

A `200` response with `{"items": [...]}` confirms the stack works correctly.

#### Verify from the browser

1. Open `http://localhost:3000/directorio`.
2. You should see the 6 example profiles loaded from DynamoDB.
3. Use the form at `/psicologos/registrar` to create a real profile.
4. The new profile should appear immediately in the directory.

---

## Actualizaciones posteriores / Subsequent updates

---

### ES

**Cambios de infraestructura (CDK):**

```bash
cd backend
cdk diff    # revisar qué cambia
cdk deploy  # aplicar cambios
```

**Cambios de código Lambda:**

Los handlers Lambda se recompilan automáticamente con esbuild en cada `cdk deploy`. No hay un paso adicional.

**Cambios en el frontend:**

Vercel redeploya automáticamente en cada push a la rama principal del repositorio.

**Agregar nuevo psicólogo al seed:**

Edita `backend/scripts/seed.ts`, agrega el perfil al array `psicologosSeed` y vuelve a ejecutar:

```bash
TABLE_NAME=refugio-mental-psicologos AWS_REGION=us-east-1 npm run seed
```

### EN

**Infrastructure changes (CDK):**

```bash
cd backend
cdk diff    # preview what changes
cdk deploy  # apply changes
```

**Lambda code changes:**

Lambda handlers are automatically recompiled with esbuild on every `cdk deploy`. No additional step needed.

**Frontend changes:**

Vercel automatically redeploys on every push to the main branch.

---

## Destruir la infraestructura / Destroy infrastructure

---

### ES

> ⚠️ **Precaución:** La tabla DynamoDB tiene `removalPolicy: RETAIN`, lo que significa que **no se eliminará** aunque destruyas el stack. Esto protege los datos de psicólogos reales en producción. Para eliminarla manualmente, ve a la consola de AWS → DynamoDB → Tablas.

```bash
cd backend
cdk destroy
```

Esto elimina el stack de CloudFormation (Lambdas, API Gateway, roles IAM) pero conserva la tabla DynamoDB y su contenido.

### EN

> ⚠️ **Caution:** The DynamoDB table has `removalPolicy: RETAIN`, meaning it **will NOT be deleted** when you destroy the stack. This protects real psychologist data in production. To delete it manually, go to AWS Console → DynamoDB → Tables.

```bash
cd backend
cdk destroy
```

This removes the CloudFormation stack (Lambdas, API Gateway, IAM roles) but preserves the DynamoDB table and its data.

---

## Solución de problemas / Troubleshooting

---

### `cdk bootstrap` falla con error de permisos

**ES:** Asegúrate de que tu usuario IAM tenga permisos para crear roles IAM y buckets S3. Contacta al administrador de tu cuenta AWS si es necesario.

**EN:** Make sure your IAM user has permissions to create IAM roles and S3 buckets. Contact your AWS account administrator if needed.

---

### El directorio aparece vacío

**ES:** Verifica que:
1. `.env.local` existe y tiene el valor correcto de `NEXT_PUBLIC_API_URL`.
2. El seed fue ejecutado: `npm run seed` desde `backend/`.
3. La API responde: `curl $NEXT_PUBLIC_API_URL/v1/psicologos`.

**EN:** Make sure:
1. `.env.local` exists and has the correct `NEXT_PUBLIC_API_URL` value.
2. The seed was run: `npm run seed` from `backend/`.
3. The API responds: `curl $NEXT_PUBLIC_API_URL/v1/psicologos`.

---

### Error CORS en el navegador

**ES:** El dominio desde el que accedes no está en la lista `allowOrigins` del `api-construct.ts`. Agrégalo y ejecuta `cdk deploy`.

**EN:** The domain you're accessing from is not in the `allowOrigins` list in `api-construct.ts`. Add it and run `cdk deploy`.

---

### El stack quedó en `ROLLBACK_COMPLETE`

**ES:** CloudFormation no puede actualizar un stack en este estado. Debes eliminarlo y volver a desplegar:

```bash
aws cloudformation delete-stack --stack-name RefugioMentalStack
aws cloudformation wait stack-delete-complete --stack-name RefugioMentalStack
cdk deploy
```

**EN:** CloudFormation cannot update a stack in this state. You must delete it and redeploy:

```bash
aws cloudformation delete-stack --stack-name RefugioMentalStack
aws cloudformation wait stack-delete-complete --stack-name RefugioMentalStack
cdk deploy
```

---

### `Other CLIs are currently reading from cdk.out`

**ES:** Otro proceso de CDK está corriendo. Espera a que termine o mátalo:

```bash
pkill -f "cdk"
cdk deploy
```

**EN:** Another CDK process is running. Wait for it to finish or kill it:

```bash
pkill -f "cdk"
cdk deploy
```

---

*¿Encontraste un problema no listado aquí? Abre un issue en el repositorio con el label `deployment`.*

*Found a problem not listed here? Open an issue in the repository with the `deployment` label.*
