import type { Psicologo, FiltrosDirectorio, ListPsicologosResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildQueryString(filtros: Partial<FiltrosDirectorio>): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set('q', filtros.busqueda);
  if (filtros.especialidad) params.set('especialidad', filtros.especialidad);
  if (filtros.idioma) params.set('idioma', filtros.idioma);
  if (filtros.modalidad) params.set('modalidad', filtros.modalidad);
  if (filtros.pais) params.set('pais', filtros.pais);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function getBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL no está configurada. ' +
        'Crea un archivo .env.local con NEXT_PUBLIC_API_URL=<tu-api-gateway-url>'
    );
  }
  return API_BASE_URL.replace(/\/$/, '');
}

/**
 * Fetches all psychologist profiles, optionally filtered server-side.
 * Mirrors the signature of the previous lib/storage.ts obtenerPerfiles().
 */
export async function obtenerPerfiles(
  filtros?: Partial<FiltrosDirectorio>
): Promise<Psicologo[]> {
  const base = getBaseUrl();
  const qs = filtros ? buildQueryString(filtros) : '';
  const res = await fetch(`${base}/v1/psicologos${qs}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Error al obtener perfiles: ${res.status}`);
  const data: ListPsicologosResponse = await res.json();
  return data.items;
}

/**
 * Fetches a single psychologist profile by id.
 * Returns null if the profile does not exist (404).
 */
export async function obtenerPerfil(id: string): Promise<Psicologo | null> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/psicologos/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener perfil: ${res.status}`);
  return res.json() as Promise<Psicologo>;
}

/**
 * Creates a new psychologist profile via POST.
 * Mirrors the signature of the previous lib/storage.ts guardarPerfil().
 * Returns the created profile with its server-generated id and creadoEn.
 */
export async function guardarPerfil(
  datos: Omit<Psicologo, 'id' | 'creadoEn'>
): Promise<Psicologo> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/psicologos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    let message = `Error al guardar perfil: ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      // ignore JSON parse error — use status message
    }
    throw new Error(message);
  }
  return res.json() as Promise<Psicologo>;
}

/**
 * Admin-only: fetches ALL profiles regardless of estadoVerificacion.
 * Requires a valid Cognito id_token — enforced by JWT Authorizer on API Gateway.
 */
export async function obtenerPerfilesAdmin(token: string): Promise<Psicologo[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/admin/psicologos`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error al obtener perfiles (admin): ${res.status}`);
  const data: ListPsicologosResponse = await res.json();
  return data.items;
}

/**
 * Deletes a psychologist profile by id. Requires a valid Cognito id_token.
 * The JWT Authorizer on API Gateway enforces authentication server-side.
 */
export async function eliminarPerfil(id: string, token: string): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/psicologos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = `Error al eliminar perfil: ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

/**
 * Actualiza el estado de verificación de un perfil de psicólogo.
 * Requiere un token de administrador para la autorización en API Gateway.
 */
export async function actualizarEstadoPerfil(
  id: string,
  estado: 'APPROVED' | 'REJECTED',
  token: string
): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/psicologos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estadoVerificacion: estado }),
  });

  if (!res.ok) {
    let message = `Error al actualizar estado del perfil: ${res.status}`;
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}