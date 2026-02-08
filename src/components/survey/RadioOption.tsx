import { cn } from "@/lib/utils";

interface RadioOptionProps {
  value: string;
  label: string;
  selected: boolean;
  onChange: (value: string) => void;
  name: string;
}

export function RadioOption({ value, label, selected, onChange, name }: RadioOptionProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        selected
          ? "border-primary bg-primary/10 shadow-survey"
          : "border-border bg-card"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        )}
      >
        {selected && (
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-scale-in" />
        )}
      </div>
      <span className={cn(
        "font-medium transition-colors duration-200",
        selected ? "text-primary" : "text-foreground"
      )}>
        {label}
      </span>
    </label>
  );
}
