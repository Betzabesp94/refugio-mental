import type { Psicologo, Modalidad } from './types';

const MODALIDADES_VALIDAS: Modalidad[] = ['online', 'presencial', 'ambas'];

export interface ValidationResult {
  valid: boolean;
  fields: Record<string, string>;
}

type PsicologoInput = Omit<Psicologo, 'id' | 'creadoEn'>;

export function validatePsicologo(data: Partial<PsicologoInput>): ValidationResult {
  const fields: Record<string, string> = {};

  if (!data.nombre?.trim()) fields.nombre = 'El nombre es obligatorio.';
  if (!data.apellido?.trim()) fields.apellido = 'El apellido es obligatorio.';
  if (!data.especialidad?.trim()) fields.especialidad = 'La especialidad es obligatoria.';

  if (!data.credencialUrl?.trim()) {
    fields.credencialUrl = 'El enlace a tu credencial es obligatorio.';
  } else if (!data.credencialUrl.startsWith('http')) {
    fields.credencialUrl = 'El enlace de la credencial debe ser una URL válida.';
  }

  if (!data.ciudad?.trim()) fields.ciudad = 'La ciudad es obligatoria.';
  if (!data.pais?.trim()) fields.pais = 'El país es obligatorio.';

  if (!data.idiomas || data.idiomas.length === 0) {
    fields.idiomas = 'Selecciona al menos un idioma.';
  }

  if (!data.modalidad) {
    fields.modalidad = 'La modalidad es obligatoria.';
  } else if (!MODALIDADES_VALIDAS.includes(data.modalidad)) {
    fields.modalidad = `Modalidad inválida. Valores permitidos: ${MODALIDADES_VALIDAS.join(', ')}.`;
  }

  if (!data.biografia?.trim()) {
    fields.biografia = 'La biografía es obligatoria.';
  } else if (data.biografia.length > 400) {
    fields.biografia = 'La biografía no puede superar los 400 caracteres.';
  }

  if (!data.calendlyUrl?.trim()) {
    fields.calendlyUrl = 'El enlace de Calendly es obligatorio.';
  } else if (!data.calendlyUrl.startsWith('https://')) {
    fields.calendlyUrl = 'El enlace debe comenzar con https://.';
  }

  if (!data.aceptaDirectorio) {
    fields.aceptaDirectorio = 'Debes aceptar aparecer en el directorio.';
  }

  return { valid: Object.keys(fields).length === 0, fields };
}