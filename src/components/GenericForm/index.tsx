"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

type Option = { label: string; value: string | number };

type FieldConfig = {
  label?: string;
  type?: "hidden" | "text" | "number" | "checkbox" | "select" | "multiselect" | "numericformat";
  options?: Option[]; // para select e multiselect
  placeholder?: string;
  isDisabled: boolean;
};

type GenericFormProps<T extends ZodTypeAny> = {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  submitLabel?: string;
  fields?: Partial<Record<keyof z.infer<T>, FieldConfig>>;
};

const fieldAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function GenericForm<T extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Salvar",
  fields = {},
}: GenericFormProps<T>) {
  type FormData = z.infer<T>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });


  // Atualiza os valores do form quando defaultValues mudar
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);  

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    await onSubmit(data);
  };

  const keys = Object.keys(schema.shape) as (keyof FormData)[];

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 max-w-md max-h-[500px] overflow-y-auto pr-2" // Adicione estas classes
      aria-label="generic-form"
    >
      {keys.map((key, idx) => {
        const fieldConfig = fields[key] || {};
        const label = fieldConfig.label || String(key);
        const type = fieldConfig.type || "text";

        return (
          <motion.div
            key={String(key)}
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            variants={fieldAnimation}
            transition={{ delay: idx * 0.1 }}
          >
            {type === 'hidden'
              ? ''
              : <>
                <label htmlFor={String(key)} className="font-semibold mb-1">
                  {label}
                </label>
              </>
            }

            {type === "checkbox" && (
              <input
                id={String(key)}
                type="checkbox"
                {...register(key)}
                className="w-5 h-5"
              />
            )}

            {(type === "text" || type === "number" || type === "hidden") && (
              <input
                id={String(key)}
                type={type}
                {...register(key)}
                className="border px-3 py-2 rounded"
                placeholder={fieldConfig.placeholder}
              />
            )}

            {type === "numericformat" && (
              <Controller
                control={control}
                name={key}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    className="border px-3 py-2 rounded"
                    placeholder={fieldConfig.placeholder}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? null);
                    }}
                    value={field.value ?? ""}
                  />
                )}
              />
            )}

            {type === "select" && (
              <Controller
                control={control}
                name={key}
                render={({ field }) => (
                  <select
                    {...field}
                    id={String(key)}
                    className="border px-3 py-2 rounded"
                    //defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {fieldConfig.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}

            {type === "multiselect" && (
              <Controller
                control={control}
                name={key}
                render={({ field }) => (
                  <select
                    {...field}
                    id={String(key)}
                    multiple
                    className="border px-3 py-2 rounded h-24"
                  >
                    {fieldConfig.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}

            {errors[key] && (
              <p className="text-sm text-red-600 mt-1" role="alert">
                {(errors[key]?.message as string) || "Campo inválido"}
              </p>
            )}
          </motion.div>
        );
      })}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full gap-2"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}