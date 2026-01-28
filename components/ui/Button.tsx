'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type ButtonPropsBase = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonPropsBase & Omit<HTMLMotionProps<'button'>, 'children' | 'className'> & {
  as?: 'button';
  href?: never;
};

type ButtonAsAnchor = ButtonPropsBase & Omit<HTMLMotionProps<'a'>, 'children' | 'className'> & {
  as: 'a';
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

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

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'lg',
    glow = true,
    fullWidth = false,
    children,
    className = '',
    as = 'button',
    ...motionProps
  } = props;

  const baseClasses = `${sizeMap[size]} ${variantStyles[variant]} transition-all ${fullWidth ? 'w-full' : ''} ${className}`;
  
  const glowStyle = glow && variant === 'primary' 
    ? { boxShadow: '0 0 30px var(--color-primary)' }
    : {};

  const hoverProps = variant === 'primary' ? { scale: 1.05 } : {};

  if (as === 'a' && 'href' in props) {
    return (
      <motion.a
        href={props.href}
        className={baseClasses}
        style={glowStyle}
        whileHover={hoverProps}
        whileTap={{ scale: 0.98 }}
        {...(motionProps as HTMLMotionProps<'a'>)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      style={glowStyle}
      whileHover={hoverProps}
      whileTap={{ scale: 0.98 }}
      {...(motionProps as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
