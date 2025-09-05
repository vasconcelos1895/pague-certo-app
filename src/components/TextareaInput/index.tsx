import { type Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface TextAreaInputProps {
  name: string
  control: Control<T>
  summary: string
  label: string
}

export default function TextAreaInput({ name, control, summary, label}:TextAreaInputProps) {
    return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{label}</FormLabel>
              <FormDescription className="text-xs font-normal text-dark">
                {summary}
              </FormDescription>
              <FormControl>
                <Textarea
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className={cn("mt-1 text-xs font-light")}/>
            </FormItem>
          )}
        />        
    )
}