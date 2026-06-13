import { cn } from "@/lib/utils";
import type { LikertValue } from "@/lib/types";

const scaleItems: Array<{ value: LikertValue; label: string }> = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

type LikertScaleProps = {
  value?: LikertValue;
  onChange: (value: LikertValue) => void;
  name: string;
};

export const LikertScale = ({ value, onChange, name }: LikertScaleProps) => (
  <fieldset className="space-y-3" role="radiogroup" aria-label="Likert scale response">
    <legend className="sr-only">Select your response</legend>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
      {scaleItems.map((item) => {
        const selected = value === item.value;

        return (
          <label
            key={item.value}
            className={cn(
              "relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background sm:flex-col sm:items-start",
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={selected}
              onChange={() => onChange(item.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="relative z-10 text-lg font-semibold">{item.value}</span>
            <span className="relative z-10 text-sm opacity-90">{item.label}</span>
          </label>
        );
      })}
    </div>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Left: disagreement</span>
      <span>Right: agreement</span>
    </div>
  </fieldset>
);
