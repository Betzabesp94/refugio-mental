import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  CalendarCheck,
  Settings,
  Link2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Guía de Calendly para psicólogos",
  description:
    "Aprende paso a paso cómo configurar tu Calendly para recibir sesiones de pacientes de forma gratuita y profesional.",
};

const pasosCalendly = [
  {
    num: "01",
    titulo: "Crea tu cuenta gratuita",
    descripcion: "Ve a calendly.com y regístrate con tu correo electrónico. El plan gratuito es más que suficiente para esta iniciativa.",
    link: { label: "Ir a Calendly.com", href: "https://calendly.com/signup" },
  },
  {
    num: "02",
    titulo: "Configura tu disponibilidad",
    descripcion:
      "En 'Availability', define los días y horas en que puedes atender. Sé realista con tu tiempo: es mejor poner menos horas con calidad que muchas y no poder cumplir.",
  },
  {
    num: "03",
    titulo: "Crea un tipo de evento",
    descripcion:
      "Crea un evento llamado 'Sesión de apoyo' o 'Primera sesión gratuita'. Define la duración (recomendamos 45-60 minutos), el tipo (videollamada) y agrega una descripción breve.",
  },
  {
    num: "04",
    titulo: "Configura la videollamada",
    descripcion:
      "En la sección de ubicación del evento, selecciona 'Google Meet', 'Zoom' o 'Enlace personalizado'. Calendly genera automáticamente el enlace para cada sesión.",
  },
  {
    num: "05",
    titulo: "Obtén tu enlace público",
    descripcion:
      "En tu perfil de Calendly encontrarás tu enlace único, algo como: calendly.com/tu-nombre. Ese es el enlace que debes pegar en tu perfil de Refugio Mental.",
  },
];

const siCompartir = [
  "Tu nombre profesional",
  "Tu especialidad y enfoque terapéutico",
  "Tu ciudad y país de residencia",
  "Los idiomas en que atiendes",
  "Tu enlace de Calendly",
  "Redes sociales profesionales (LinkedIn, por ejemplo)",
];

const noCompartir = [
  "Tu dirección particular",
  "Tu número de teléfono personal",
  "Datos de pacientes anteriores",
  "Información bancaria o de pagos",
  "Datos de menores de edad a tu cargo",
];

const buenasPracticas = [
  "Configura recordatorios automáticos de Calendly para reducir cancelaciones.",
  "Agrega una descripción clara en tu evento para que la persona sepa qué esperar.",
  "Establece un buffer entre sesiones para prepararte emocionalmente.",
  "Considera limitar el número de sesiones diarias para evitar el burnout.",
  "Si detectas una crisis severa, deriva a líneas de emergencia locales.",
  "Mantén un registro propio de las sesiones para dar seguimiento si decides hacerlo.",
];

export default function GuiaCalendlyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <Link
          href="/psicologos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a información para psicólogos
        </Link>

        <div className="mb-10">
          <Badge variant="default" className="mb-4">
            <CalendarCheck className="h-3.5 w-3.5 mr-1" />
            Guía paso a paso
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Cómo configurar tu Calendly
          </h1>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Calendly es una herramienta gratuita que permite a otras personas
            reservar tiempo contigo sin necesidad de intercambiar mensajes.
            En minutos puedes tener tu perfil listo.
          </p>
        </div>

        <Separator className="mb-10" />

        {/* Qué es Calendly */}
        <section className="mb-12">
          <SectionTitle
            title="¿Qué es Calendly?"
            className="mb-6"
          />
          <Card>
            <CardContent className="pt-6 space-y-3 text-muted-foreground leading-relaxed text-sm">
              <p>
                Calendly es una plataforma de agendamiento en línea que
                sincroniza con tu calendario (Google Calendar, Outlook, etc.)
                y muestra automáticamente tus horarios disponibles.
              </p>
              <p>
                La persona que quiere reservar contigo simplemente elige un
                horario disponible, llena sus datos básicos, y ambos reciben
                una confirmación por correo con el enlace de la videollamada.
              </p>
              <p>
                <strong className="text-foreground">El plan gratuito</strong> permite
                crear un tipo de evento con disponibilidad ilimitada. Es más
                que suficiente para esta iniciativa.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Pasos */}
        <section className="mb-12">
          <SectionTitle
            title="Configuración paso a paso"
            className="mb-6"
          />
          <div className="space-y-4">
            {pasosCalendly.map((paso) => (
              <div key={paso.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {paso.num}
                  </div>
                  <div className="flex-1 w-px bg-border mt-2" />
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {paso.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {paso.descripcion}
                  </p>
                  {paso.link && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <a
                        href={paso.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {paso.link.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Qué compartir / no compartir */}
        <section className="mb-12">
          <SectionTitle
            title="Qué información compartir"
            className="mb-6"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="font-semibold text-foreground text-sm">Sí compartir</h3>
              </div>
              <ul className="space-y-2">
                {siCompartir.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-foreground text-sm">No compartir</h3>
              </div>
              <ul className="space-y-2">
                {noCompartir.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Buenas prácticas */}
        <section className="mb-12">
          <SectionTitle
            title="Buenas prácticas"
            className="mb-6"
          />
          <ul className="space-y-3">
            {buenasPracticas.map((practica) => (
              <li key={practica} className="flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {practica}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Alternativas */}
        <section className="mb-12">
          <SectionTitle
            title="¿Alternativas a Calendly?"
            className="mb-4"
          />
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {[
                  {
                    nombre: "Cal.com",
                    descripcion: "Open source, muy completo. Plan gratuito generoso.",
                    href: "https://cal.com",
                  },
                  {
                    nombre: "Doodle",
                    descripcion: "Simple para proponer horarios y que el paciente elija.",
                    href: "https://doodle.com",
                  },
                  {
                    nombre: "Simply Book",
                    descripcion: "Interfaz sencilla. Plan básico gratuito.",
                    href: "https://simplybook.me",
                  },
                ].map((alt) => (
                  <a
                    key={alt.nombre}
                    href={alt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center gap-2 font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {alt.nombre}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {alt.descripcion}
                    </p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-primary/5 border border-border p-6 text-center">
          <Settings className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">
            ¿Ya tienes tu enlace?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ahora puedes registrar tu perfil en el directorio de Refugio Mental.
          </p>
          <Button asChild>
            <Link href="/psicologos/registrar">Registrar mi perfil →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
