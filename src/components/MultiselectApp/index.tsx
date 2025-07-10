"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelectApp({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
}: MultiSelectProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded="false"
            className="w-full justify-between"
          >
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder || "Selecione..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="max-h-60 overflow-auto">
            {options.map((opt) => {
              const checked = selectedValues.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                    checked ? "font-semibold" : "font-normal"
                  )}
                  onClick={() => toggleValue(opt.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      checked ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}