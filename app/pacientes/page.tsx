import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Search,
  CalendarCheck,
  MessageCircle,
  Phone,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Necesito apoyo emocional",
  description:
    "Información para pacientes que buscan apoyo psicológico gratuito tras el terremoto del 24J en Venezuela.",
};

const pasos = [
  {
    icono: Search,
    titulo: "Explora los perfiles",
    descripcion:
      "Ve al directorio y usa los filtros para encontrar psicólogos por especialidad, idioma, modalidad (online o presencial) o país.",
  },
  {
    icono: HelpCircle,
    titulo: "Lee la biografía",
    descripcion:
      "Cada psicólogo incluye una descripción de su experiencia y enfoque. Elige a alguien cuya descripción resuene contigo.",
  },
  {
    icono: CalendarCheck,
    titulo: "Reserva una sesión",
    descripcion:
      "Haz clic en 'Agendar sesión'. Serás redirigido al Calendly del psicólogo para elegir el horario que más te convenga.",
  },
  {
    icono: MessageCircle,
    titulo: "Asiste a tu sesión",
    descripcion:
      "Recibirás una confirmación por correo con el enlace de la videollamada (o los detalles si es presencial). Solo necesitas conectarte a la hora acordada.",
  },
];

const quienesAtender = [
  "Personas que experimentaron el terremoto directamente.",
  "Familiares de personas afectadas o desaparecidas.",
  "Personas que perdieron su hogar o bienes materiales.",
  "Quienes sienten angustia, insomnio o estrés postraumático.",
  "Comunidades que buscan procesar el impacto colectivo.",
  "Personas que simplemente necesitan ser escuchadas.",
];

const emergencias = [
  {
    nombre: "Emergencias generales",
    numero: "911",
    descripcion: "Venezuela — Emergencias médicas y rescate",
  },
  {
    nombre: "Línea de crisis emocional",
    numero: "Consultar MSDS Venezuela",
    descripcion: "Ministerio de Salud — Atención en crisis",
  },
];

export default function PacientesPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-6">
            <Heart className="h-3.5 w-3.5" />
            Para personas que necesitan apoyo
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            No tienes que enfrentarlo solo
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lo que viviste fue real y tiene un impacto emocional real.
            Aquí encontrarás psicólogos voluntarios listos para escucharte,
            sin costos y sin burocracia.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/directorio" className="gap-2">
                Ver psicólogos disponibles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="mb-16" />

        {/* Cómo reservar */}
        <section className="mb-16">
          <SectionTitle
            title="¿Cómo reservar una sesión?"
            description="El proceso es simple y completamente gratuito."
            className="mb-10"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((paso, i) => (
              <Card
                key={paso.titulo}
                className="hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <paso.icono className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">
                    Paso {i + 1}
                  </span>
                  <h3 className="mt-1 font-semibold text-foreground">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {paso.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Qué esperar */}
        <section className="mb-16 bg-muted/30 rounded-2xl p-8">
          <SectionTitle
            title="¿Qué esperar de la primera sesión?"
            className="mb-6"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {[
              "El psicólogo te escuchará sin juzgarte.",
              "Podrás hablar de lo que sientes, a tu ritmo.",
              "No estás obligado a compartir más de lo que quieras.",
              "Recibirás orientación y herramientas para manejar el momento.",
              "No es una consulta médica ni reemplaza atención clínica.",
              "Es normal sentirse vulnerable. Eso es parte del proceso.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Para quiénes */}
        <section className="mb-16">
          <SectionTitle
            title="¿Para quiénes es este servicio?"
            description="Si alguna de estas situaciones te describe, este directorio es para ti."
            className="mb-8"
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quienesAtender.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergencias */}
        <section className="mb-16">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-amber-800 dark:text-amber-300 text-lg">
                  ¿Estás en una emergencia?
                </h2>
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                  Si tú o alguien que conoces está en peligro inmediato —
                  incluyendo pensamientos de hacerse daño — por favor contacta
                  de inmediato a los servicios de emergencia. Refugio Mental no
                  es un servicio de crisis en tiempo real.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {emergencias.map((e) => (
                <div
                  key={e.nombre}
                  className="rounded-lg bg-white dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-amber-800 dark:text-amber-300 text-lg">
                      {e.numero}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {e.nombre}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                    {e.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Hay alguien listo para escucharte
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Accede al directorio y encuentra al profesional que mejor
            se adapte a lo que necesitas.
          </p>
          <Button asChild size="lg">
            <Link href="/directorio" className="gap-2">
              Explorar directorio de psicólogos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
