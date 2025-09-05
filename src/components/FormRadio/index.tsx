"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {type Control } from "react-hook-form";

interface FormRadioProps {
  name: string;
  label: string;
  control: Control<any>;
  options: { value: string; label: string }[];
}

export function FormRadio({ name, label, control, options }: FormRadioProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="flex flex-row gap-4"
          >
            {options.map((opt) => (
              <FormItem key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <label htmlFor={opt.value}>{opt.label}</label>
              </FormItem>
            ))}
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
