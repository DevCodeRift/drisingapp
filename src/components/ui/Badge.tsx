'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'arc' | 'solar' | 'void' | 'kinetic' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  glow = false
}: BadgeProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    arc: "bg-cyan-100 text-cyan-800 border border-cyan-200",
    solar: "bg-orange-100 text-orange-800 border border-orange-200",
    void: "bg-purple-100 text-purple-800 border border-purple-200",
    kinetic: "bg-gray-100 text-gray-800 border border-gray-300",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200"
  };

  const glowVariants = {
    arc: glow ? "shadow-glow" : "",
    solar: glow ? "shadow-glow-orange" : "",
    void: glow ? "shadow-glow-purple" : "",
    default: "",
    kinetic: "",
    success: "",
    warning: "",
    error: ""
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        glowVariants[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}