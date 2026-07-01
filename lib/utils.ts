import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generarId(): string {
  return `psi-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatearFecha(isoString: string): string {
  return new Intl.DateTimeFormat("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}
