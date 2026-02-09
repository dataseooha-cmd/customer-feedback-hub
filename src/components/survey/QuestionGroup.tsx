import { RadioOption } from "./RadioOption";

interface Option {
  value: string;
  label: string;
}

interface QuestionGroupProps {
  question: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuestionGroup({ question, name, options, value, onChange, error }: QuestionGroupProps) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-sm text-foreground">
        {question} <span className="text-destructive">*</span>
      </p>
      <div className="space-y-1">
        {options.map((option) => (
          <RadioOption
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            selected={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
