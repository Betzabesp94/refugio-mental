import Link from "next/link";
import { Heart, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6">
        {/* Aviso de emergencia */}
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Esto no reemplaza los servicios de emergencia
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              Si estás en peligro inmediato, llama al{" "}
              <strong>911</strong> o acude al centro de salud más cercano.
              Refugio Mental es un directorio comunitario, no un servicio de emergencias.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span className="font-semibold text-sm">Refugio Mental</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Directorio comunitario gratuito que conecta psicólogos
              voluntarios con personas afectadas por la emergencia del
              24J en Venezuela.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Navegación</h3>
            <ul className="space-y-2">
              {[
                { href: "/directorio", label: "Directorio de psicólogos" },
                { href: "/psicologos", label: "Soy psicólogo voluntario" },
                { href: "/psicologos/registrar", label: "Registrar perfil" },
                { href: "/psicologos/guia", label: "Guía de Calendly" },
                { href: "/pacientes", label: "Necesito apoyo" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Acerca del proyecto</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Desarrollado en un hackathon humanitario como respuesta
              al terremoto del 24 de junio de 2026 en Venezuela. Código
              abierto bajo licencia MIT.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2026 Refugio Mental. Proyecto de código abierto — Licencia MIT.</p>
          <p>Hecho con cuidado para Venezuela 🇻🇪</p>
        </div>
      </div>
    </footer>
  );
}
