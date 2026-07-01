import { Psicologo } from "@/types";
import { psicologosSeed } from "@/data/seed";

const STORAGE_KEY = "refugio_mental_psicologos";

/**
 * Devuelve todos los perfiles: seed + los registrados por usuarios.
 * En una futura versión, esta función llamaría a una API REST.
 */
export function obtenerPerfiles(): Psicologo[] {
  if (typeof window === "undefined") return psicologosSeed;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const perfilesUsuario: Psicologo[] = raw ? JSON.parse(raw) : [];
    return [...psicologosSeed, ...perfilesUsuario];
  } catch {
    return psicologosSeed;
  }
}

/**
 * Guarda un nuevo perfil en LocalStorage.
 * En una futura versión, esta función haría POST a una API REST.
 */
export function guardarPerfil(psicologo: Psicologo): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const perfiles: Psicologo[] = raw ? JSON.parse(raw) : [];
    perfiles.push(psicologo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    throw new Error("No se pudo guardar el perfil. Intenta nuevamente.");
  }
}

/**
 * Elimina únicamente los perfiles de usuario (no los seed).
 */
export function limpiarPerfilesUsuario(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
