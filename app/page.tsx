import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/features/home/Hero";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  CalendarCheck,
  VideoIcon,
  HeartHandshake,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refugio Mental — Apoyo psicológico gratuito · 24J Venezuela",
};

const pasos = [
  {
    icono: Search,
    titulo: "Explora el directorio",
    descripcion:
      "Navega entre los perfiles de psicólogos voluntarios. Filtra por especialidad, idioma, modalidad o país.",
  },
  {
    icono: UserCheck,
    titulo: "Elige tu psicólogo",
    descripcion:
      "Revisa las biografías y especialidades para encontrar al profesional que mejor se adapte a lo que necesitas.",
  },
  {
    icono: CalendarCheck,
    titulo: "Agenda tu sesión",
    descripcion:
      "Con un clic accedes al Calendly del profesional y reservas una sesión en el horario que más te convenga.",
  },
  {
    icono: VideoIcon,
    titulo: "Recibe apoyo",
    descripcion:
      "Conéctate en la sesión acordada. Todo es gratuito, voluntario y confidencial.",
  },
];

const paraQuien = [
  {
    icono: HeartHandshake,
    titulo: "Personas afectadas",
    descripcion:
      "Si viviste el terremoto, perdiste a alguien, quedaste sin hogar o simplemente sientes angustia, hay alguien dispuesto a escucharte.",
  },
  {
    icono: UserCheck,
    titulo: "Psicólogos voluntarios",
    descripcion:
      "Si eres profesional de la salud mental y quieres contribuir, regístrate en el directorio y comparte tu enlace de Calendly.",
  },
  {
    icono: Sparkles,
    titulo: "Familias y comunidades",
    descripcion:
      "También atendemos a familiares de personas afectadas y a quienes quieren acompañar a alguien en su proceso.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Cómo funciona */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionTitle
            title="¿Cómo funciona?"
            description="Un proceso simple en cuatro pasos para conectarte con el apoyo que necesitas."
            centered
            className="mx-auto max-w-xl mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((paso, i) => (
              <Card
                key={paso.titulo}
                className="group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
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
        </div>
      </section>

      {/* Para quién es */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionTitle
            title="¿Para quién es Refugio Mental?"
            description="Una plataforma diseñada para la comunidad venezolana en este momento de dolor colectivo."
            centered
            className="mx-auto max-w-xl mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {paraQuien.map((item) => (
              <Card
                key={item.titulo}
                className="group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <item.icono className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.descripcion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            El primer paso es pedir ayuda
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            No estás solo. Hay profesionales venezolanos y de todo el mundo
            listos para acompañarte en este momento difícil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/directorio" className="gap-2">
                Ver directorio de psicólogos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/psicologos/registrar">Registrarme como psicólogo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
