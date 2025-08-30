import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

const Card: React.FC<CardProps> = ({ children, className = '', as: Component = 'div' }) => {
    const baseStyles = "bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700";
    
    return (
        <Component className={`${baseStyles} ${className}`}>
            {children}
        </Component>
    );
};

export default Card;