# Refugio Mental

**Directorio comunitario gratuito de apoyo psicológico — Venezuela 24J**

Refugio Mental conecta psicólogos voluntarios con personas afectadas emocionalmente por el doble terremoto ocurrido en Venezuela el 24 de junio de 2026. El objetivo es reducir la brecha entre quienes necesitan apoyo emocional y los profesionales dispuestos a brindarlo, sin intermediarios, sin costos y sin burocracia.

> **Aviso importante:** Este proyecto NO reemplaza servicios de emergencia ni atención médica profesional. Es únicamente un directorio comunitario. Ante una emergencia médica, llama al **911**.

---

## Inicio rápido

```bash
git clone https://github.com/tu-usuario/refugio-mental.git
cd refugio-mental
npm install
cp .example.env .env.local   # agrega NEXT_PUBLIC_API_URL y las vars de Cognito
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Necesitas desplegar primero el backend en AWS para que el directorio funcione. Ver → [docs/deployment.md](docs/deployment.md)

---

## Arquitectura

El frontend corre en **Vercel** (Next.js) y consume una API serverless en **AWS**. Los perfiles de psicólogos se persisten en **DynamoDB** a través de **Lambda + API Gateway**.

```
Usuario → Next.js (Vercel) → API Gateway → Lambda → DynamoDB
```

Ver documentación completa → [docs/architecture.md](docs/architecture.md)

---

## Deploy en AWS

El backend se despliega con un solo comando usando **AWS CDK**:

```bash
cd backend
npm install
cdk bootstrap   # solo la primera vez
cdk deploy
```

El output incluye la `ApiUrl` que debes configurar como `NEXT_PUBLIC_API_URL` en Vercel.

Ver guía detallada → [docs/deployment.md](docs/deployment.md)

---

## Estructura del proyecto

```
refugio-mental/
├── app/                    # Next.js App Router (rutas y layouts)
├── components/             # Componentes UI reutilizables
├── features/               # Lógica y UI por feature (directory, registration)
├── hooks/                  # usePerfiles, useFiltrarPerfiles
├── lib/
│   ├── api.ts              # Capa de datos → API Gateway
│   └── utils.ts            # Utilidades generales
├── types/                  # Tipos TypeScript del dominio
├── backend/                # CDK + Lambda + scripts de AWS
│   ├── bin/                # Entry point CDK
│   ├── lib/                # Stacks y Constructs
│   ├── lambda/             # Handlers Lambda (CRUD psicólogos)
│   ├── shared/             # Tipos compartidos frontend/backend
│   └── scripts/            # seed.ts para poblar DynamoDB
└── docs/                   # Documentación técnica detallada
    ├── architecture.md
    └── deployment.md
```

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16.2 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19 + Radix UI |
| Estilos | Tailwind CSS 4 + tailwindcss-animate |
| Iconos | Lucide React |
| Toasts | Sonner |
| Tema | next-themes (claro/oscuro) |
| Hosting frontend | Vercel |
| API | AWS API Gateway HTTP API |
| Compute | AWS Lambda (Node.js 22, ARM64) |
| Base de datos | Amazon DynamoDB (PAY_PER_REQUEST) |
| Infraestructura | AWS CDK (TypeScript) |

---

## Mejoras futuras

- [x] Moderación de perfiles antes de publicación (`estadoVerificacion`: PENDING → APPROVED / REJECTED)
- [x] Verificación de credenciales profesionales (`credencialUrl`)
- [x] Autenticación con Cognito para panel administrativo
- [x] Panel administrativo (`/admin`) con aprobación/rechazo de perfiles
- [ ] Subida de fotografías a S3
- [ ] Búsqueda geográfica
- [ ] Rate limiting en API Gateway
- [ ] Internacionalización (i18n)

---

## Licencia

MIT — Libre para usar, modificar y distribuir con atribución.

---

*Desarrollado en un hackathon humanitario como respuesta inmediata al terremoto del 24 de junio de 2026 en Venezuela.*
