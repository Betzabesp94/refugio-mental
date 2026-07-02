"use client";

import { useState } from "react";
import { UserSearch, UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ProfileCard } from "./ProfileCard";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { usePerfiles, useFiltrarPerfiles } from "@/hooks/usePerfiles";
import type { FiltrosDirectorio } from "@/types";

const filtrosIniciales: FiltrosDirectorio = {
  busqueda: "",
  especialidad: "",
  idioma: "",
  modalidad: "",
  pais: "",
};

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4 animate-pulse">
      <div className="flex gap-4">
        <div className="h-14 w-14 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-muted rounded-full w-16" />
        <div className="h-6 bg-muted rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="h-9 bg-muted rounded-lg" />
    </div>
  );
}

export function DirectoryGrid() {
  const { perfiles, cargando, error, recargar } = usePerfiles();
  const [filtros, setFiltros] = useState<FiltrosDirectorio>(filtrosIniciales);

  const actualizarFiltros = (parcial: Partial<FiltrosDirectorio>) => {
    setFiltros((prev) => ({ ...prev, ...parcial }));
  };

  const perfilesAprobados = perfiles.filter(
    (p) => p.estadoVerificacion === 'APPROVED'
  );

  // Usamos el hook con la lista ya purgada de no aprobados
  const perfilesFiltrados = useFiltrarPerfiles(perfilesAprobados, filtros);

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No se pudo cargar el directorio"
        description={error}
        action={
          <Button variant="outline" onClick={recargar} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Intentar nuevamente
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
        <SearchBar
          value={filtros.busqueda}
          onChange={(v) => actualizarFiltros({ busqueda: v })}
        />
        <FilterPanel
          filtros={filtros}
          onChange={actualizarFiltros}
          perfiles={perfilesAprobados} 
        />
      </div>

      {/* Contador */}
      {!cargando && (
        <p className="text-sm text-muted-foreground">
          {perfilesFiltrados.length === 0
            ? "Sin resultados"
            : perfilesFiltrados.length === 1
            ? "1 psicólogo disponible"
            : `${perfilesFiltrados.length} psicólogos disponibles`}
        </p>
      )}

      {/* Grid de perfiles */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : perfilesFiltrados.length === 0 ? (
        <EmptyState
          icon={UserSearch}
          title="No encontramos psicólogos con esos criterios"
          description="Intenta ajustar los filtros o borrar la búsqueda. También puedes invitar a más profesionales a registrarse."
          action={
            <Button asChild variant="outline">
              <Link href="/psicologos/registrar" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Registrarme como psicólogo
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfilesFiltrados.map((p) => (
            <ProfileCard key={p.id} psicologo={p} />
          ))}
        </div>
      )}
    </div>
  );
}
