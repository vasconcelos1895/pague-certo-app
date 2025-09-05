'use client'
import React, { type JSX } from "react";
import { type Control} from "react-hook-form";
import { PatternFormat } from "react-number-format";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";

interface ITextInputPatternProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
    control: Control<T>
    label: string
    pattern: string
    placeholder?: string
}

//
export default function TextInputPattern({name, placeholder, control, pattern, label, ...rest}:ITextInputPatternProps):JSX.Element {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange, name, value } }) => (
                <FormItem className="space-y-1">
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <FormDescription className="text-xs font-normal text-dark">
                        {placeholder}
                    </FormDescription>                    
                    <FormControl>
                        <PatternFormat
                            className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              )}  
                            value={value}
                            onValueChange={(v) => onChange(v.value)}
                            format={pattern}
                            mask="_"
                        />                        
                    </FormControl>
                    <FormMessage className={cn("mt-1 text-xs font-light")}/>
                </FormItem>
            )}
        />              
    )
}