'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'highlighted' | 'gradient';
  hover?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles = {
  default: 'bg-bg-secondary/80 backdrop-blur-sm border border-primary/40',
  highlighted: 'bg-bg-secondary/80 backdrop-blur-sm border-2 border-primary shadow-[0_0_40px_var(--color-primary)]',
  gradient: 'bg-gradient-to-br from-bg-deep/80 to-secondary/40 border border-primary/20',
};

export default function Card({
  variant = 'default',
  hover = true,
  glow = false,
  padding = 'lg',
  children,
  className = '',
  ...motionProps
}: CardProps) {
  const baseClasses = `rounded-3xl ${paddingMap[padding]} flex flex-col transition-all duration-300 ${variantStyles[variant]} ${className}`;
  
  const hoverProps = hover ? {
    whileHover: { 
      y: -10, 
      boxShadow: glow || variant === 'highlighted'
        ? '0 0 40px var(--color-primary)'
        : '0 0 20px rgba(120, 232, 248, 0.2)',
      transition: { duration: 0.3 } 
    }
  } : {};

  const defaultStyle = glow && variant !== 'highlighted' 
    ? { boxShadow: '0 0 20px rgba(120, 232, 248, 0.1)' }
    : variant === 'highlighted'
    ? { boxShadow: '0 0 40px var(--color-primary)' }
    : {};

  return (
    <motion.div
      className={baseClasses}
      style={defaultStyle}
      {...hoverProps}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
