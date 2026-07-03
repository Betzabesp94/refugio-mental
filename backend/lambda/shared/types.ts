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
  esSeed?: boolean;
  estadoVerificacion?: "PENDING" | "APPROVED" | "REJECTED";
  credencialUrl: string;
}

export type PsicologoPublico = Omit<Psicologo, "credencialUrl" | "email">;

export interface FiltrosDirectorio {
  busqueda: string;
  especialidad: string;
  idioma: string;
  modalidad: string;
  pais: string;
  estadoVerificacion?: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ListPsicologosResponse {
  items: PsicologoPublico[];
  count: number;
}
