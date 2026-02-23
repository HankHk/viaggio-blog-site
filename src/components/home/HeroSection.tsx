"use client";

import { motion } from "framer-motion";
import { DecorativePattern } from "@/components/ui/DecorativePattern";

export function HeroSection() {
  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <DecorativePattern variant="petals" animated />
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-serif text-4xl font-medium text-[#2c2c2c] sm:text-5xl md:text-6xl">
          Viaggio
        </h1>
        <motion.p
          className="mt-4 max-w-xl mx-auto font-sans text-lg text-neutral-light sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Storie e luoghi dal mondo. Un passo alla volta.
        </motion.p>
      </motion.div>
    </section>
  );
}
