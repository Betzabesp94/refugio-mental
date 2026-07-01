"use client";

import { useState, useEffect, useCallback } from "react";
import { Psicologo, FiltrosDirectorio } from "@/types";
import { obtenerPerfiles, guardarPerfil } from "@/lib/storage";

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<Psicologo[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    // Simular latencia mínima para mostrar skeleton
    setTimeout(() => {
      setPerfiles(obtenerPerfiles());
      setCargando(false);
    }, 600);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const agregar = useCallback(
    (psicologo: Psicologo) => {
      guardarPerfil(psicologo);
      cargar();
    },
    [cargar]
  );

  return { perfiles, cargando, agregar, recargar: cargar };
}

export function useFiltrarPerfiles(
  perfiles: Psicologo[],
  filtros: FiltrosDirectorio
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
