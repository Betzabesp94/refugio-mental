import type { Metadata } from "next";
import { DirectoryGrid } from "@/features/directory/DirectoryGrid";
import { SectionTitle } from "@/components/shared/SectionTitle";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Directorio de psicólogos voluntarios",
  description:
    "Encuentra psicólogos voluntarios listos para acompañarte emocionalmente tras el terremoto del 24J en Venezuela.",
};

export default function DirectorioPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <SectionTitle
            title="Directorio de psicólogos"
            description="Profesionales voluntarios listos para acompañarte. Toda sesión es gratuita."
          />
          <Button asChild variant="outline" size="sm" className="shrink-0 gap-2">
            <Link href="/psicologos/registrar">
              <UserPlus className="h-4 w-4" />
              Registrar mi perfil
            </Link>
          </Button>
        </div>

        <DirectoryGrid />
      </div>
    </div>
  );
}
