// packages/ui/src/components/Input/index.tsx
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export interface BaseInputProps {
  label?: string;
  type?: "text" | "email" | "password" | "number" | "textarea" |"color";
  className?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
export type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, type = "text", className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label htmlFor={label} className='block text-sm font-medium text-gray-300 mb-1'>
            {label}
          </label>
        )}

        {type === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={label}
            className={`w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:outline-none focus:ring focus:ring-blue-500 ${className}`}
            {...(props as TextareaProps)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            id={label}
            className={`w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-gray-100 focus:outline-none focus:ring focus:ring-blue-500 ${className}`}
            {...(props as InputProps)}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
