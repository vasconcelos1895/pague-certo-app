'use client'
import React, { type JSX } from "react";
import type { Control } from "react-hook-form";
import './textInput.css'
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    control: Control<T>
    label: string
}

//
export default function TextInput({ name, label, placeholder, control, ...rest }: ITextInputProps): JSX.Element {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1">
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <FormDescription className="text-xs font-normal text-dark">
                        {placeholder}
                    </FormDescription>                    
                    <FormControl>
                        <Input  {...field} />
                    </FormControl>
                    <FormMessage className={cn("mt-1 text-xs font-light")}/>
                </FormItem>
            )}
        />
    )
}