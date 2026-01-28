'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

const sizeMap = {
  sm: 'px-6 py-3 text-sm',
  md: 'px-8 py-4',
  lg: 'px-10 py-5',
};

const variantStyles = {
  primary: 'bg-primary text-bg font-subtitle font-bold rounded-full shadow-[0_0_30px_var(--color-primary)] hover:scale-105',
  secondary: 'border border-white/20 text-text hover:bg-white/5 rounded-xl',
  ghost: 'text-primary hover:text-primary-light',
};

export default function Button({
  variant = 'primary',
  size = 'lg',
  glow = true,
  fullWidth = false,
  children,
  className = '',
  as = 'button',
  href,
  ...motionProps
}: ButtonProps) {
  const baseClasses = `${sizeMap[size]} ${variantStyles[variant]} transition-all ${fullWidth ? 'w-full' : ''} ${className}`;
  
  const glowStyle = glow && variant === 'primary' 
    ? { boxShadow: '0 0 30px var(--color-primary)' }
    : {};

  const Component = as === 'a' ? motion.a : motion.button;
  const props = as === 'a' ? { href } : {};

  return (
    <Component
      className={baseClasses}
      style={glowStyle}
      whileHover={variant === 'primary' ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.98 }}
      {...props}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
