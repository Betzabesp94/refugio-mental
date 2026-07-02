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

export interface ListResponse {
  items: Psicologo[];
  count: number;
}

export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}
