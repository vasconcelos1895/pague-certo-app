"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  description?: string;
}
export function CheckboxGroup({
  label,
  options,
  selectedValues,
  onChange,
  description,
}: CheckboxGroupProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  console.log('selectedValues',selectedValues)

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormDescription>{description}</FormDescription>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto border rounded-md p-2">
        {options.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                id={`checkbox-${value}`}
                checked={selectedValues.includes(label)}
                onCheckedChange={() => toggleValue(label)}
              />
            </FormControl>
            <label htmlFor={`checkbox-${value}`} className="cursor-pointer">
              {label}
            </label>
          </div>
        ))}
      </div>
    </FormItem>
  );
}