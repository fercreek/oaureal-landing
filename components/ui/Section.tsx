import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  background?: 'default' | 'secondary';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: ReactNode;
}

const maxWidthMap = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

export default function Section({ 
  id, 
  background = 'default', 
  maxWidth = 'lg',
  className = '',
  children 
}: SectionProps) {
  const bgClass = background === 'secondary' ? 'bg-bg-secondary' : 'bg-bg';
  
  return (
    <section 
      id={id} 
      className={`py-24 px-6 ${bgClass} overflow-hidden ${className}`}
    >
      <div className={`${maxWidthMap[maxWidth]} mx-auto`}>
        {children}
      </div>
    </section>
  );
}
