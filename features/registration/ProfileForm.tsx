"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { guardarPerfil } from "@/lib/storage";
import { generarId } from "@/lib/utils";
import type { Modalidad, Psicologo } from "@/types";

const ESPECIALIDADES = [
  "Trauma y Emergencias",
  "Duelo y Pérdida",
  "Ansiedad y Estrés Postraumático",
  "Psicología Infantil y Familiar",
  "Primeros Auxilios Psicológicos",
  "Depresión y Crisis Emocional",
  "Violencia y Desastres",
  "Resiliencia y Adaptación",
  "Psicología Comunitaria",
  "Otra",
];

const IDIOMAS_DISPONIBLES = [
  "Español",
  "Inglés",
  "Francés",
  "Portugués",
  "Italiano",
  "Alemán",
  "Catalán",
];

const PAISES = [
  "Venezuela",
  "Colombia",
  "Perú",
  "Ecuador",
  "Chile",
  "Argentina",
  "Estados Unidos",
  "España",
  "México",
  "Brasil",
  "Otro",
];

interface FormState {
  nombre: string;
  apellido: string;
  fotografia: string;
  especialidad: string;
  ciudad: string;
  pais: string;
  idiomas: string[];
  modalidad: Modalidad | "";
  biografia: string;
  calendlyUrl: string;
  email: string;
  redesSociales: { plataforma: string; url: string }[];
  aceptaDirectorio: boolean;
}

const estadoInicial: FormState = {
  nombre: "",
  apellido: "",
  fotografia: "",
  especialidad: "",
  ciudad: "",
  pais: "",
  idiomas: [],
  modalidad: "",
  biografia: "",
  calendlyUrl: "",
  email: "",
  redesSociales: [],
  aceptaDirectorio: false,
};

function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ProfileForm() {
  const router = useRouter();
  const uid = useId();
  const [form, setForm] = useState<FormState>(estadoInicial);
  const [errores, setErrores] = useState<Partial<Record<keyof FormState, string>>>({});
  const [enviando, setEnviando] = useState(false);

  const set = (key: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errores[key]) {
      setErrores((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleIdioma = (idioma: string) => {
    set(
      "idiomas",
      form.idiomas.includes(idioma)
        ? form.idiomas.filter((i) => i !== idioma)
        : [...form.idiomas, idioma]
    );
  };

  const agregarRedSocial = () => {
    set("redesSociales", [...form.redesSociales, { plataforma: "", url: "" }]);
  };

  const actualizarRedSocial = (
    index: number,
    campo: "plataforma" | "url",
    valor: string
  ) => {
    const nuevas = [...form.redesSociales];
    nuevas[index] = { ...nuevas[index], [campo]: valor };
    set("redesSociales", nuevas);
  };

  const eliminarRedSocial = (index: number) => {
    set(
      "redesSociales",
      form.redesSociales.filter((_, i) => i !== index)
    );
  };

  const validar = (): boolean => {
    const nuevosErrores: Partial<Record<keyof FormState, string>> = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim())
      nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!form.especialidad)
      nuevosErrores.especialidad = "Selecciona una especialidad.";
    if (!form.ciudad.trim())
      nuevosErrores.ciudad = "La ciudad es obligatoria.";
    if (!form.pais) nuevosErrores.pais = "El país es obligatorio.";
    if (form.idiomas.length === 0)
      nuevosErrores.idiomas = "Selecciona al menos un idioma.";
    if (!form.modalidad)
      nuevosErrores.modalidad = "Selecciona una modalidad.";
    if (!form.biografia.trim())
      nuevosErrores.biografia = "La biografía es obligatoria.";
    if (form.biografia.length > 400)
      nuevosErrores.biografia = "Máximo 400 caracteres.";
    if (!form.calendlyUrl.trim())
      nuevosErrores.calendlyUrl = "El enlace de Calendly es obligatorio.";
    else if (
      !form.calendlyUrl.startsWith("https://calendly.com/") &&
      !form.calendlyUrl.startsWith("https://cal.com/") &&
      !form.calendlyUrl.startsWith("https://")
    )
      nuevosErrores.calendlyUrl = "Introduce una URL válida (https://).";
    if (!form.aceptaDirectorio)
      nuevosErrores.aceptaDirectorio =
        "Debes aceptar aparecer en el directorio.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) {
      toast.error("Revisa los campos requeridos.");
      return;
    }

    setEnviando(true);

    // Simular pequeña latencia
    await new Promise((r) => setTimeout(r, 800));

    const psicologo: Psicologo = {
      id: generarId(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fotografia: form.fotografia.trim() || "",
      especialidad: form.especialidad,
      ciudad: form.ciudad.trim(),
      pais: form.pais,
      idiomas: form.idiomas,
      modalidad: form.modalidad as Modalidad,
      biografia: form.biografia.trim(),
      calendlyUrl: form.calendlyUrl.trim(),
      email: form.email.trim() || undefined,
      redesSociales: form.redesSociales.filter(
        (r) => r.plataforma && r.url
      ),
      aceptaDirectorio: true,
      creadoEn: new Date().toISOString(),
    };

    try {
      guardarPerfil(psicologo);
      toast.success("¡Perfil registrado con éxito! Ya apareces en el directorio.");
      router.push("/directorio");
    } catch {
      toast.error("Hubo un error al guardar tu perfil. Inténtalo de nuevo.");
      setEnviando(false);
    }
  };

  const iniciales =
    form.nombre && form.apellido
      ? `${form.nombre[0]}${form.apellido[0]}`.toUpperCase()
      : "";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Preview del avatar */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
        <Avatar className="h-16 w-16">
          {form.fotografia ? (
            <AvatarImage src={form.fotografia} alt="Vista previa" />
          ) : null}
          <AvatarFallback className="text-lg">
            {iniciales || <UserCircle2 className="h-8 w-8 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">
            {form.nombre || form.apellido
              ? `${form.nombre} ${form.apellido}`.trim()
              : "Tu nombre aparecerá aquí"}
          </p>
          <p className="text-sm text-muted-foreground">
            {form.especialidad || "Especialidad"}
          </p>
          <p className="text-xs text-muted-foreground">
            {form.ciudad && form.pais
              ? `${form.ciudad}, ${form.pais}`
              : "Ciudad, País"}
          </p>
        </div>
      </div>

      {/* Datos personales */}
      <fieldset className="space-y-6">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Información personal
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            label="Nombre"
            htmlFor={`${uid}-nombre`}
            required
            error={errores.nombre}
          >
            <Input
              id={`${uid}-nombre`}
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ana"
              aria-required="true"
              aria-invalid={!!errores.nombre}
            />
          </FormField>

          <FormField
            label="Apellido"
            htmlFor={`${uid}-apellido`}
            required
            error={errores.apellido}
          >
            <Input
              id={`${uid}-apellido`}
              value={form.apellido}
              onChange={(e) => set("apellido", e.target.value)}
              placeholder="González"
              aria-required="true"
              aria-invalid={!!errores.apellido}
            />
          </FormField>
        </div>

        <FormField
          label="Fotografía (URL)"
          htmlFor={`${uid}-foto`}
          hint="Enlace a una imagen tuya. Puedes usar tu foto de LinkedIn o de redes sociales."
          error={errores.fotografia}
        >
          <Input
            id={`${uid}-foto`}
            type="url"
            value={form.fotografia}
            onChange={(e) => set("fotografia", e.target.value)}
            placeholder="https://ejemplo.com/mi-foto.jpg"
          />
        </FormField>

        <FormField
          label="Correo electrónico"
          htmlFor={`${uid}-email`}
          hint="Opcional. No se muestra públicamente."
        >
          <Input
            id={`${uid}-email`}
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="tu@email.com"
          />
        </FormField>
      </fieldset>

      {/* Información profesional */}
      <fieldset className="space-y-6">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Información profesional
        </legend>

        <FormField
          label="Especialidad"
          htmlFor={`${uid}-especialidad`}
          required
          error={errores.especialidad}
        >
          <Select
            value={form.especialidad}
            onValueChange={(v) => set("especialidad", v)}
          >
            <SelectTrigger
              id={`${uid}-especialidad`}
              aria-required="true"
              aria-invalid={!!errores.especialidad}
            >
              <SelectValue placeholder="Selecciona tu especialidad" />
            </SelectTrigger>
            <SelectContent>
              {ESPECIALIDADES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            label="Ciudad"
            htmlFor={`${uid}-ciudad`}
            required
            error={errores.ciudad}
          >
            <Input
              id={`${uid}-ciudad`}
              value={form.ciudad}
              onChange={(e) => set("ciudad", e.target.value)}
              placeholder="Caracas"
              aria-required="true"
              aria-invalid={!!errores.ciudad}
            />
          </FormField>

          <FormField
            label="País"
            htmlFor={`${uid}-pais`}
            required
            error={errores.pais}
          >
            <Select value={form.pais} onValueChange={(v) => set("pais", v)}>
              <SelectTrigger
                id={`${uid}-pais`}
                aria-required="true"
                aria-invalid={!!errores.pais}
              >
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                {PAISES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Idiomas */}
        <div className="space-y-2">
          <Label>
            Idiomas <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Idiomas disponibles">
            {IDIOMAS_DISPONIBLES.map((idioma) => {
              const seleccionado = form.idiomas.includes(idioma);
              return (
                <button
                  key={idioma}
                  type="button"
                  onClick={() => toggleIdioma(idioma)}
                  aria-pressed={seleccionado}
                  className="transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                >
                  <Badge
                    variant={seleccionado ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm"
                  >
                    {idioma}
                  </Badge>
                </button>
              );
            })}
          </div>
          {errores.idiomas && (
            <p className="text-xs text-destructive">{errores.idiomas}</p>
          )}
        </div>

        {/* Modalidad */}
        <FormField
          label="Modalidad de atención"
          htmlFor={`${uid}-modalidad`}
          required
          error={errores.modalidad}
        >
          <Select
            value={form.modalidad}
            onValueChange={(v) => set("modalidad", v as Modalidad)}
          >
            <SelectTrigger
              id={`${uid}-modalidad`}
              aria-required="true"
              aria-invalid={!!errores.modalidad}
            >
              <SelectValue placeholder="Selecciona la modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online (videollamada)</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="ambas">Ambas modalidades</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Biografía */}
        <FormField
          label="Biografía breve"
          htmlFor={`${uid}-bio`}
          required
          hint={`${form.biografia.length}/400 caracteres`}
          error={errores.biografia}
        >
          <Textarea
            id={`${uid}-bio`}
            value={form.biografia}
            onChange={(e) => set("biografia", e.target.value)}
            placeholder="Comparte tu experiencia, enfoque terapéutico y por qué deseas colaborar en esta iniciativa..."
            maxLength={400}
            rows={5}
            aria-required="true"
            aria-invalid={!!errores.biografia}
          />
        </FormField>
      </fieldset>

      {/* Calendly */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
          Agendamiento
        </legend>

        <FormField
          label="Enlace de Calendly"
          htmlFor={`${uid}-calendly`}
          required
          hint="Debe ser un enlace público para que los pacientes puedan agendar contigo directamente."
          error={errores.calendlyUrl}
        >
          <Input
            id={`${uid}-calendly`}
            type="url"
            value={form.calendlyUrl}
            onChange={(e) => set("calendlyUrl", e.target.value)}
            placeholder="https://calendly.com/tu-nombre/sesion"
            aria-required="true"
            aria-invalid={!!errores.calendlyUrl}
          />
        </FormField>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          ¿No tienes Calendly aún?{" "}
          <a
            href="/psicologos/guia"
            className="text-primary hover:underline font-medium"
          >
            Lee nuestra guía paso a paso →
          </a>
        </div>
      </fieldset>

      {/* Redes sociales */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
          Redes sociales <span className="text-muted-foreground font-normal normal-case text-xs">(opcional)</span>
        </legend>

        {form.redesSociales.map((red, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Input
              value={red.plataforma}
              onChange={(e) => actualizarRedSocial(i, "plataforma", e.target.value)}
              placeholder="LinkedIn, Instagram…"
              className="w-32 shrink-0"
              aria-label={`Plataforma red social ${i + 1}`}
            />
            <Input
              value={red.url}
              onChange={(e) => actualizarRedSocial(i, "url", e.target.value)}
              placeholder="https://..."
              type="url"
              aria-label={`URL red social ${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => eliminarRedSocial(i)}
              aria-label="Eliminar red social"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}

        {form.redesSociales.length < 4 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarRedSocial}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar red social
          </Button>
        )}
      </fieldset>

      {/* Consentimiento */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`${uid}-acepta`}
            checked={form.aceptaDirectorio}
            onCheckedChange={(c) => set("aceptaDirectorio", !!c)}
            aria-required="true"
            aria-invalid={!!errores.aceptaDirectorio}
          />
          <Label
            htmlFor={`${uid}-acepta`}
            className="text-sm leading-relaxed cursor-pointer"
          >
            Acepto aparecer públicamente en el directorio de Refugio Mental
            con la información proporcionada en este formulario. Entiendo que
            se trata de una iniciativa voluntaria y no recibo compensación
            económica.
          </Label>
        </div>
        {errores.aceptaDirectorio && (
          <p className="text-xs text-destructive pl-7">{errores.aceptaDirectorio}</p>
        )}
      </div>

      {/* Botón enviar */}
      <Button
        type="submit"
        size="lg"
        disabled={enviando}
        className="w-full gap-2"
      >
        {enviando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando perfil…
          </>
        ) : (
          "Publicar mi perfil en el directorio"
        )}
      </Button>
    </form>
  );
}
