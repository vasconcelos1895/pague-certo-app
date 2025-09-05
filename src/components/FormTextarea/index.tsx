"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {type Control } from "react-hook-form";

interface FormTextareaProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
}

export function FormTextarea({
  name,
  label,
  control,
  placeholder,
}: FormTextareaProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
