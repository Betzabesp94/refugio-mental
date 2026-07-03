"use client";

import { useState, useEffect, useCallback } from "react";
import { Psicologo, FiltrosDirectorio, PsicologoPublico } from "@/types";
import { obtenerPerfiles, guardarPerfil } from "@/lib/api";

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<PsicologoPublico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPerfiles();
      setPerfiles(data);
    } catch (err) {
      console.error("Error al cargar perfiles:", err);
      setError(
        "No se pudieron cargar los perfiles. Verifica tu conexión e intenta nuevamente.",
      );
      setPerfiles([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const agregar = useCallback(
    async (datos: Omit<Psicologo, "id" | "creadoEn">): Promise<Psicologo> => {
      const nuevo = await guardarPerfil(datos);
      await cargar();
      return nuevo;
    },
    [cargar],
  );

  return { perfiles, cargando, error, agregar, recargar: cargar };
}

export function useFiltrarPerfiles(
  perfiles: PsicologoPublico[],
  filtros: FiltrosDirectorio,
) {
  return perfiles.filter((p) => {
    const termino = filtros.busqueda.toLowerCase();
    const coincideBusqueda =
      !termino ||
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(termino) ||
      p.especialidad.toLowerCase().includes(termino) ||
      p.ciudad.toLowerCase().includes(termino) ||
      p.pais.toLowerCase().includes(termino) ||
      p.biografia.toLowerCase().includes(termino);

    const coincideEspecialidad =
      !filtros.especialidad || p.especialidad === filtros.especialidad;

    const coincideIdioma =
      !filtros.idioma || p.idiomas.includes(filtros.idioma);

    const coincideModalidad =
      !filtros.modalidad || p.modalidad === filtros.modalidad;

    const coincidePais = !filtros.pais || p.pais === filtros.pais;

    return (
      coincideBusqueda &&
      coincideEspecialidad &&
      coincideIdioma &&
      coincideModalidad &&
      coincidePais
    );
  });
}
