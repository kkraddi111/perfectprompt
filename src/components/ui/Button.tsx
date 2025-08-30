import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className = '', 
    isLoading = false, 
    variant = 'primary',
    icon,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all disabled:cursor-not-allowed";
    
    const variantStyles = {
        primary: 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600',
        secondary: 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:ring-primary-500',
        ghost: 'border-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500 disabled:opacity-50',
    };

    const isDisabled = props.disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Spinner className="-ml-1 mr-2" />}
        {!isLoading && icon && <span className="-ml-1 mr-2 h-5 w-5">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;