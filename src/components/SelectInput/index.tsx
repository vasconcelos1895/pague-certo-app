'use client'
import React, { type SelectHTMLAttributes } from "react";
import { type Control } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    control: Control<any>
    options: Array<{ value: number | string, label: string }>
    name: string
    label: string
    description?: string
}

export default function SelectInput({ label, name, control, options, description }: SelectInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                return (
                    <FormItem className="space-y-1">
                        <FormLabel>{label}</FormLabel>
                        <FormDescription className="text-xs font-normal text-dark">
                            {description}
                        </FormDescription>
                        <Select
                            onValueChange={(value) => {
                                field.onChange(value)
                            }}
                            value={field.value}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={'Selecione uma opção'} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options?.filter(option => option.value !== '').map((option) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value?.toString() ?? 'default'}
                                    >
                                        {option.label ?? 'Selecione uma opção'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage className="mt-1 text-xs font-light" />
                    </FormItem>
                )
            }}
        />
    )
}