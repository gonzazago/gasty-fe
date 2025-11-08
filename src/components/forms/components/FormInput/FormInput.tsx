// src/components/forms/components/FormInput/FormInput.tsx
import { UseFormRegister, FieldErrors, Path, FieldValues } from 'react-hook-form'; // 1. Importa FieldValues

// 2. Usa FieldValues en lugar de Record<string, any>
type FormInputProps<TFormValues extends FieldValues> = {
    label: string;
    name: Path<TFormValues>;
    register: UseFormRegister<TFormValues>;
    errors: FieldErrors<TFormValues>;
    registerOptions?: Parameters<UseFormRegister<TFormValues>>[1];
    prefix?: string; // Para el "$" en el campo de monto
} & Omit<React.ComponentProps<'input'>, 'name'>; // Hereda props de <input>

// 3. Usa FieldValues aquí también
export default function FormInput<TFormValues extends FieldValues>({
                                                                       label,
                                                                       name,
                                                                       register,
                                                                       errors,
                                                                       registerOptions,
                                                                       prefix,
                                                                       className,
                                                                       ...props // (ej: type, placeholder, step, min)
                                                                   }: FormInputProps<TFormValues>) {

    const hasError = !!errors[name];

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
            >
                {label}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">
            {prefix}
          </span>
                )}
                <input
                    id={name}
                    {...register(name, registerOptions)}
                    {...props}
                    className={`
            w-full px-3 py-2.5 sm:py-2 border rounded-lg 
            text-sm sm:text-base text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-purple-500
            ${prefix ? 'pl-7 sm:pl-8' : ''}
            ${hasError ? 'border-red-500' : 'border-gray-300'}
            ${className || ''}
          `}
                />
            </div>
            {hasError && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
}