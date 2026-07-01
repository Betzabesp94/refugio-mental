import Link from "next/link";
import { Heart, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-20 sm:py-28 sm:px-6 text-center">
        {/* Badge urgencia */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 px-4 py-1.5 text-sm text-amber-700 dark:text-amber-300 font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          Respuesta al terremoto del 24 de junio de 2026
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-3xl mx-auto">
          Un refugio de{" "}
          <span className="text-primary">apoyo emocional</span>{" "}
          gratuito para Venezuela
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Conectamos psicólogos voluntarios con personas afectadas
          emocionalmente por el doble terremoto del 24J.
          Sin costo. Sin barreras. Con mucha humanidad.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="xl">
            <Link href="/pacientes" className="gap-2">
              <Heart className="h-5 w-5" />
              Necesito apoyo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/psicologos" className="gap-2">
              <Users className="h-5 w-5" />
              Soy psicólogo voluntario
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { valor: "100%", etiqueta: "Gratuito" },
            { valor: "Online", etiqueta: "Disponible" },
            { valor: "24/7", etiqueta: "Directorio activo" },
          ].map((stat) => (
            <div
              key={stat.etiqueta}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-2xl font-bold text-primary">{stat.valor}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.etiqueta}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 inline-flex items-start gap-2 text-sm text-muted-foreground max-w-lg mx-auto">
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <span>
            Este directorio no reemplaza servicios de emergencia ni atención
            médica. Si estás en peligro inmediato, llama al <strong>911</strong>.
          </span>
        </div>
      </div>
    </section>
  );
}
