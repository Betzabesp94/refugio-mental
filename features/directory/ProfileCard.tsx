import { ExternalLink, MapPin, Globe, Monitor, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Psicologo } from "@/types";

const modalidadLabel: Record<string, { label: string; icon: typeof Globe }> = {
  online: { label: "Online", icon: Globe },
  presencial: { label: "Presencial", icon: Users },
  ambas: { label: "Online y presencial", icon: Monitor },
};

interface ProfileCardProps {
  psicologo: Psicologo;
}

export function ProfileCard({ psicologo }: ProfileCardProps) {
  const iniciales =
    `${psicologo.nombre[0]}${psicologo.apellido[0]}`.toUpperCase();

  const { label: modalLabel, icon: ModalIcon } =
    modalidadLabel[psicologo.modalidad] ?? modalidadLabel.online;

  return (
    <Card className="group flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardContent className="pt-6 flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-14 w-14 shrink-0 ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
            {psicologo.fotografia && (
              <AvatarImage
                src={psicologo.fotografia}
                alt={`Foto de ${psicologo.nombre} ${psicologo.apellido}`}
              />
            )}
            <AvatarFallback className="text-base font-semibold bg-primary/10 text-primary">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate text-lg leading-tight">
              {psicologo.nombre} {psicologo.apellido}
            </h3>
            <p className="text-sm text-primary font-medium mt-0.5">
              {psicologo.especialidad}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>
                {psicologo.ciudad}, {psicologo.pais}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary" className="gap-1 text-xs">
            <ModalIcon className="h-3 w-3" />
            {modalLabel}
          </Badge>
          {psicologo.idiomas.map((idioma) => (
            <Badge key={idioma} variant="outline" className="text-xs">
              {idioma}
            </Badge>
          ))}
        </div>

        {/* Biografía */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {psicologo.biografia}
        </p>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border mt-2">
        <Button
          asChild
          className="w-full gap-2"
          aria-label={`Agendar sesión con ${psicologo.nombre} ${psicologo.apellido}`}
        >
          <a
            href={psicologo.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar sesión gratuita
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
