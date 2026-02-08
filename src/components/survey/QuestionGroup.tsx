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
  siteName?: string;
}

export function QuestionGroup({ 
  question, 
  name, 
  options, 
  value, 
  onChange,
  siteName = "kami"
}: QuestionGroupProps) {
  const formattedQuestion = question.replace(/\(nama web\)/g, siteName);

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground">
        {formattedQuestion}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
    </div>
  );
}
