// src/components/forms/FormSelect.tsx
import {FieldErrors, Path, UseFormRegister} from 'react-hook-form';

type FormSelectProps<TFormValues extends Record<string, any>> = {
    label: string;
    name: Path<TFormValues>;
    register: UseFormRegister<TFormValues>;
    errors: FieldErrors<TFormValues>;
    registerOptions?: Parameters<UseFormRegister<TFormValues>>[1];
    children: React.ReactNode; // Para los <option>
} & Omit<React.ComponentProps<'select'>, 'name'>;

export default function FormSelect<TFormValues extends Record<string, any>>({
                                                                                label,
                                                                                name,
                                                                                register,
                                                                                errors,
                                                                                registerOptions,
                                                                                children,
                                                                                className,
                                                                                ...props
                                                                            }: FormSelectProps<TFormValues>) {

    const hasError = !!errors[name];

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>
            <select
                id={name}
                {...register(name, registerOptions)}
                {...props}
                className={`
          w-full px-3 py-2 border rounded-lg 
          text-gray-900 
          focus:outline-none focus:ring-2 focus:ring-purple-500
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
            >
                {children}
            </select>
            {hasError && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
}