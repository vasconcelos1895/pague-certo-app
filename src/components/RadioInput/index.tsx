'use client'
import { type Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface RadioInputProps extends React.InputHTMLAttributes<HTMLElement> {
    control: Control<T>
    options: Array<string>
    label: string
    summary?: string
    defaultValue?: string | number | readonly string[] | undefined
}

export default function RadioInput({ name, control, options, label, summary, defaultValue, ...rest }:RadioInputProps) {
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
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                    {options.map((option) => (
                        <FormItem className="flex items-center space-x-3 space-y-0" key={option}>
                            <FormControl>
                            <RadioGroupItem value={option === 'Sim' ? true : false} />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {option}
                            </FormLabel>
                        </FormItem>

                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className={cn("mt-1 text-xs font-light")}/>
            </FormItem>
          )}
        />          
    )
}
