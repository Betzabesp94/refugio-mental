"use client";

import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FiltrosDirectorio, Psicologo } from "@/types";

interface FilterPanelProps {
  filtros: FiltrosDirectorio;
  onChange: (filtros: Partial<FiltrosDirectorio>) => void;
  perfiles: Psicologo[];
}

const VALOR_TODOS = "__todos__";

export function FilterPanel({ filtros, onChange, perfiles }: FilterPanelProps) {
  const especialidades = [...new Set(perfiles.map((p) => p.especialidad))].sort();
  const idiomas = [
    ...new Set(perfiles.flatMap((p) => p.idiomas)),
  ].sort();
  const paises = [...new Set(perfiles.map((p) => p.pais))].sort();

  const tieneFiltrosActivos =
    filtros.especialidad || filtros.idioma || filtros.modalidad || filtros.pais;

  const limpiar = () =>
    onChange({ especialidad: "", idioma: "", modalidad: "", pais: "" });

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={filtros.especialidad || VALOR_TODOS}
        onValueChange={(v) =>
          onChange({ especialidad: v === VALOR_TODOS ? "" : v })
        }
      >
        <SelectTrigger className="w-auto min-w-[160px] h-9 text-sm" aria-label="Filtrar por especialidad">
          <SelectValue placeholder="Especialidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VALOR_TODOS}>Todas las especialidades</SelectItem>
          {especialidades.map((e) => (
            <SelectItem key={e} value={e}>
              {e}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.idioma || VALOR_TODOS}
        onValueChange={(v) =>
          onChange({ idioma: v === VALOR_TODOS ? "" : v })
        }
      >
        <SelectTrigger className="w-auto min-w-[130px] h-9 text-sm" aria-label="Filtrar por idioma">
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VALOR_TODOS}>Todos los idiomas</SelectItem>
          {idiomas.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.modalidad || VALOR_TODOS}
        onValueChange={(v) =>
          onChange({ modalidad: v === VALOR_TODOS ? "" : v })
        }
      >
        <SelectTrigger className="w-auto min-w-[140px] h-9 text-sm" aria-label="Filtrar por modalidad">
          <SelectValue placeholder="Modalidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VALOR_TODOS}>Todas las modalidades</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="presencial">Presencial</SelectItem>
          <SelectItem value="ambas">Ambas</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filtros.pais || VALOR_TODOS}
        onValueChange={(v) =>
          onChange({ pais: v === VALOR_TODOS ? "" : v })
        }
      >
        <SelectTrigger className="w-auto min-w-[130px] h-9 text-sm" aria-label="Filtrar por país">
          <SelectValue placeholder="País" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VALOR_TODOS}>Todos los países</SelectItem>
          {paises.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {tieneFiltrosActivos && (
        <Button
          variant="ghost"
          size="sm"
          onClick={limpiar}
          className="gap-1.5 text-muted-foreground hover:text-foreground h-9"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
