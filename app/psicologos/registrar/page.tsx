import type { Metadata } from "next";
import { ProfileForm } from "@/features/registration/ProfileForm";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Registrar perfil",
  description:
    "Registra tu perfil como psicólogo voluntario en Refugio Mental y comienza a acompañar a personas afectadas por el 24J.",
};

export default function RegistrarPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/psicologos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a información para psicólogos
          </Link>

          <SectionTitle
            title="Registra tu perfil"
            description="Completa el formulario con tu información profesional. Tu perfil aparecerá de inmediato en el directorio."
            className="mb-8"
          />

          {/* Aviso importante */}
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-1">
                Antes de continuar
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Necesitas un enlace público de Calendly (o herramienta similar)
                para que los pacientes puedan reservar sesiones contigo.{" "}
                <Link
                  href="/psicologos/guia"
                  className="text-primary hover:underline font-medium"
                >
                  Ver guía de configuración →
                </Link>
              </p>
            </div>
          </div>

          <Separator className="mb-10" />

          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
