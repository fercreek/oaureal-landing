'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { containerVariants } from '@/lib/animations';

interface GridProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  cols?: {
    base?: number;
    md?: number;
    lg?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  animate?: boolean;
}

const gapMap = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const colsClassMap: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  'md-1': 'md:grid-cols-1',
  'md-2': 'md:grid-cols-2',
  'md-3': 'md:grid-cols-3',
  'md-4': 'md:grid-cols-4',
  'lg-1': 'lg:grid-cols-1',
  'lg-2': 'lg:grid-cols-2',
  'lg-3': 'lg:grid-cols-3',
  'lg-4': 'lg:grid-cols-4',
};

export default function Grid({
  cols = { base: 1, md: 3 },
  gap = 'md',
  children,
  animate = true,
  className = '',
  ...motionProps
}: GridProps) {
  const baseCols = cols.base ? colsClassMap[cols.base.toString()] : '';
  const mdCols = cols.md ? colsClassMap[`md-${cols.md}`] : '';
  const lgCols = cols.lg ? colsClassMap[`lg-${cols.lg}`] : '';
  
  const colsClass = `grid ${baseCols} ${mdCols} ${lgCols} ${gapMap[gap]}`.trim();

  if (animate) {
    return (
      <motion.div
        className={`${colsClass} ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${colsClass} ${className}`} {...motionProps}>
      {children}
    </div>
  );
}
