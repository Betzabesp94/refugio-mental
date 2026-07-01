import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionTitle({
  title,
  description,
  className,
  centered = false,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
