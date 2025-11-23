// // packages/ui/src/components/Input/index.tsx
// import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// export interface BaseInputProps {
//   label?: string;
//   error?: string;
//   helperText?: string;
//   className?: string;
//   containerClassName?: string;
//   leftIcon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
//   variant?: 'default' | 'filled' | 'outlined';
//   size?: 'sm' | 'md' | 'lg';
//   multiline?: boolean;
// }

// export type InputProps = BaseInputProps & 
//   (| ({ multiline?: false } & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>)
//     | ({ multiline: true } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>));

// // Utility function for class names (framework-agnostic)
// export const cn = (...classes: (string | undefined | null | false)[]): string => {
//   return classes.filter(Boolean).join(' ');
// };

// const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
//   (props, ref) => {
//     const {
//       label,
//       error,
//       helperText,
//       className,
//       containerClassName,
//       leftIcon,
//       rightIcon,
//       variant = 'default',
//       size = 'md',
//       multiline = false,
//       id,
//       ...rest
//     } = props;

//     // Generate ID if not provided
//     const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

//     // Size classes
//     const sizeClasses = {
//       sm: 'px-3 py-1.5 text-sm',
//       md: 'px-4 py-2.5 text-base',
//       lg: 'px-5 py-3 text-lg',
//     };

//     // Variant classes
//     const variantClasses = {
//       default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
//       filled: 'border border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
//       outlined: 'border-2 border-gray-200 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
//     };

//     // Error classes
//     const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200';

//     const baseClasses = cn(
//       'w-full rounded-lg transition-all duration-200 outline-none placeholder-gray-400',
//       'disabled:opacity-50 disabled:cursor-not-allowed',
//       sizeClasses[size],
//       variantClasses[variant],
//       error && errorClasses,
//       leftIcon && 'pl-10',
//       rightIcon && 'pr-10',
//       multiline && 'resize-y min-h-[80px]',
//       className
//     );

//     const containerClasses = cn('space-y-1.5 w-full', containerClassName);

//     return (
//       <div className={containerClasses}>
//         {/* Label */}
//         {label && (
//           <label 
//             htmlFor={inputId}
//             className="block text-sm font-medium text-gray-700"
//           >
//             {label}
//             {rest.required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         {/* Input Container */}
//         <div className="relative">
//           {/* Left Icon */}
//           {leftIcon && (
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//               {leftIcon}
//             </div>
//           )}

//           {/* Input/Textarea */}
//           {multiline ? (
//             <textarea
//               id={inputId}
//               ref={ref as React.Ref<HTMLTextAreaElement>}
//               className={baseClasses}
//               {...rest as TextareaHTMLAttributes<HTMLTextAreaElement>}
//             />
//           ) : (
//             <input
//               id={inputId}
//               ref={ref as React.Ref<HTMLInputElement>}
//               className={baseClasses}
//               {...rest as InputHTMLAttributes<HTMLInputElement>}
//             />
//           )}

//           {/* Right Icon */}
//           {rightIcon && (
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//               {rightIcon}
//             </div>
//           )}
//         </div>

//         {/* Error Message */}
//         {error && (
//           <p className="text-sm text-red-600 flex items-center gap-1">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//             {error}
//           </p>
//         )}

//         {/* Helper Text */}
//         {helperText && !error && (
//           <p className="text-sm text-gray-500">{helperText}</p>
//         )}
//       </div>
//     );
//   }
// );

Input.displayName = 'Input';

export default Input;