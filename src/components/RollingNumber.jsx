import React, { useEffect } from 'react';
import { useSpring, useTransform, motion } from 'motion/react';

/**
 * Apple-style Smooth Rolling Number Counter
 * Interpolates numeric changes using fluid spring physics (60fps)
 */
export default function RollingNumber({ value, className = '' }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  const spring = useSpring(numericValue, {
    stiffness: 85,
    damping: 18,
    mass: 0.7,
  });

  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}
