'use client';

import { motion } from 'framer-motion';
import { sectionTitleAnimation, sectionTitleAnimationSimple } from '@/lib/animations';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  showDivider?: boolean;
  centered?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  useSimpleAnimation?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  showDivider = false,
  centered = true,
  size = 'md',
  className = '',
  useSimpleAnimation = false
}: SectionTitleProps) {
  const sizeClass = size === 'lg' 
    ? 'text-5xl md:text-6xl' 
    : 'text-4xl md:text-5xl';
  
  const animationProps = useSimpleAnimation 
    ? sectionTitleAnimationSimple 
    : sectionTitleAnimation;

  return (
    <motion.div
      {...animationProps}
      className={`${centered ? 'text-center' : ''} mb-16 ${className}`}
    >
      <h2 className={`${sizeClass} font-title text-primary italic ${subtitle ? 'mb-6' : ''}`}>
        {title}
      </h2>
      {showDivider && (
        <div className="w-48 h-0.5 bg-primary mx-auto mt-4" />
      )}
      {subtitle && (
        <p className={`text-lg text-text-muted font-body ${centered ? 'max-w-3xl mx-auto' : ''} leading-relaxed ${showDivider ? 'mt-4' : 'mt-6'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
