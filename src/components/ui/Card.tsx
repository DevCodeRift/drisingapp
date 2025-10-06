'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
  glass = false,
  gradient = false,
  onClick,
  style
}: CardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300";

  const variantClasses = cn(
    glass && "backdrop-blur-md bg-white/10 border-white/20",
    gradient && "bg-gradient-to-br from-white/90 to-white/70 border-white/30",
    !glass && !gradient && "bg-white border-gray-200 shadow-card",
    hover && "hover:shadow-xl hover:scale-[1.02] cursor-pointer",
    glow && "hover:shadow-glow",
    onClick && "cursor-pointer"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(baseClasses, variantClasses, className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.div>
  );
}