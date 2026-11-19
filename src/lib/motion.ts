import type { Variants } from 'framer-motion';

export const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.2,
} as const;

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EDITORIAL_EASE,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
