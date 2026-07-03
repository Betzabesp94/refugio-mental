/**
 * Shared types between frontend (Next.js) and backend (Lambda/CDK).
 * Keep in sync with the frontend's types/index.ts.
 */

export type Modalidad = 'online' | 'presencial' | 'ambas';

export interface RedSocial {
  plataforma: string;
  url: string;
}

export interface Psicologo {
  id: string;
  nombre: string;
  apellido: string;
  fotografia: string;
  especialidad: string;
  ciudad: string;
  pais: string;
  idiomas: string[];
  modalidad: Modalidad;
  biografia: string;
  calendlyUrl: string;
  email?: string;
  redesSociales?: RedSocial[];
  aceptaDirectorio: boolean;
  creadoEn: string;
  /** true = dato ficticio de ejemplo incluido en seed */
  esSeed?: boolean;
  estadoVerificacion?: 'PENDING' | 'APPROVED' | 'REJECTED';
  credencialUrl: string;
}

export interface FiltrosDirectorio {
  busqueda?: string;
  especialidad?: string;
  idioma?: string;
  modalidad?: string;
  pais?: string;
}

export interface ListPsicologosResponse {
  items: Psicologo[];
  count: number;
}
