"use client";

import { motion } from "framer-motion";

type Variant = "petals" | "leaves" | "tree";

const patternPaths: Record<Variant, string> = {
  petals: "/patterns/petals.svg",
  leaves: "/patterns/leaves.svg",
  tree: "/patterns/tree.svg",
};

interface DecorativePatternProps {
  variant?: Variant;
  animated?: boolean;
  className?: string;
}

export function DecorativePattern({
  variant = "petals",
  animated = true,
  className = "",
}: DecorativePatternProps) {
  const path = patternPaths[variant];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${path})` }}
        initial={animated ? { opacity: 0.6 } : undefined}
        animate={
          animated
            ? {
                opacity: [0.6, 0.9, 0.6],
                scale: [1, 1.02, 1],
              }
            : undefined
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {variant === "petals" && (
        <>
          <motion.div
            className="absolute top-[10%] left-[5%] w-4 h-4 bg-leaf/20 rounded-full"
            animate={{
              y: [0, -12, 0],
              x: [0, 6, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[20%] right-[10%] w-3 h-3 bg-leaf/15 rounded-full"
            animate={{
              y: [0, -8, 0],
              x: [0, -4, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[15%] w-3 h-3 bg-leaf-dark/15 rounded-full"
            animate={{
              y: [0, -6, 0],
              x: [0, 5, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}
