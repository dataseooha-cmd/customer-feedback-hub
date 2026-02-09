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
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
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
          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0",
          selected ? "border-foreground" : "border-muted-foreground group-hover:border-foreground/60"
        )}
      >
        {selected && (
          <div className="w-2 h-2 rounded-full bg-foreground" />
        )}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
