import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Link2,
  Clock,
  Shield,
  Heart,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Soy psicólogo voluntario",
  description:
    "Únete como psicólogo voluntario en Refugio Mental y acompaña a venezolanos afectados emocionalmente por el terremoto del 24J.",
};

const requisitos = [
  "Ser profesional de la psicología (licenciado/a o equivalente).",
  "Contar con un enlace público de Calendly o similar para agendar sesiones.",
  "Ofrecer al menos una sesión gratuita a personas afectadas por el 24J.",
  "Aceptar aparecer públicamente en el directorio con tus datos.",
];

const valores = [
  {
    icono: Heart,
    titulo: "Voluntario y gratuito",
    descripcion:
      "Tu tiempo y conocimiento son un regalo. La plataforma no cobra nada, ni a pacientes ni a psicólogos.",
  },
  {
    icono: Shield,
    titulo: "Sin intermediarios",
    descripcion:
      "El contacto es directo entre tú y la persona. Nosotros solo facilitamos el encuentro.",
  },
  {
    icono: Clock,
    titulo: "Tú controlas tu agenda",
    descripcion:
      "Calendly te permite establecer tu disponibilidad, duración y cantidad de sesiones. Tú decides.",
  },
  {
    icono: Link2,
    titulo: "Enlace directo",
    descripcion:
      "Los pacientes acceden a tu Calendly con un clic desde tu perfil. Simple y sin fricciones.",
  },
];

export default function PsicologosPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-6">
            <Heart className="h-3.5 w-3.5" />
            Para psicólogos voluntarios
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Tu experiencia puede ser el ancla que alguien necesita
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El terremoto del 24J dejó a miles de venezolanos en shock emocional.
            Como profesional de la salud mental, puedes ofrecer lo más valioso:
            presencia, escucha y acompañamiento experto.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/psicologos/registrar" className="gap-2">
                <UserPlus className="h-5 w-5" />
                Registrar mi perfil
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/psicologos/guia">Ver guía de Calendly</Link>
            </Button>
          </div>
        </div>

        <Separator className="mb-16" />

        {/* Cómo funciona */}
        <section className="mb-16">
          <SectionTitle
            title="¿Cómo funciona la plataforma?"
            description="Un proceso sencillo para que puedas empezar a ayudar en minutos."
            className="mb-10"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                titulo: "Crea tu enlace de Calendly",
                desc: "Si no tienes uno, te explicamos paso a paso cómo configurarlo en nuestra guía.",
              },
              {
                num: "02",
                titulo: "Completa tu perfil",
                desc: "Rellena el formulario con tu información profesional, especialidad y enlace de Calendly.",
              },
              {
                num: "03",
                titulo: "Aparece en el directorio",
                desc: "Tu perfil se publica de inmediato. Las personas pueden encontrarte y reservar contigo.",
              },
              {
                num: "04",
                titulo: "Acompaña a quien lo necesita",
                desc: "Recibe la reserva, confírmala si aplica, y ofrece tu sesión según acordado.",
              },
            ].map((paso) => (
              <Card
                key={paso.num}
                className="hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <span className="text-3xl font-bold text-primary/20">
                    {paso.num}
                  </span>
                  <h3 className="mt-2 font-semibold text-foreground">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {paso.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className="mb-16 bg-muted/30 rounded-2xl p-8">
          <SectionTitle
            title="¿Por qué Refugio Mental?"
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valores.map((v) => (
              <div key={v.titulo} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <v.icono className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{v.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {v.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requisitos */}
        <section className="mb-16">
          <SectionTitle
            title="¿Quién puede registrarse?"
            description="Los requisitos son mínimos para maximizar la participación de profesionales."
            className="mb-8"
          />
          <ul className="space-y-3">
            {requisitos.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-primary/5 border border-border p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            ¿Listo para unirte?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            El registro tarda menos de 5 minutos. Solo necesitas tu información
            básica y tu enlace de Calendly.
          </p>
          <Button asChild size="lg">
            <Link href="/psicologos/registrar" className="gap-2">
              <UserPlus className="h-5 w-5" />
              Registrar mi perfil ahora
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
