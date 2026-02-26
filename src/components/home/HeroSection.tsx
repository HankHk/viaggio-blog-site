"use client";

import { motion } from "framer-motion";
import { DecorativePattern } from "@/components/ui/DecorativePattern";

export function HeroSection() {
  return (
    <section className="relative min-h-[45vh] sm:min-h-[50vh] flex flex-col items-center justify-center px-3 py-12 sm:px-4 sm:py-20 overflow-hidden">
      <DecorativePattern variant="petals" animated />
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-center">
          <span className="block font-serif text-4xl font-semibold text-[#2c2c2c] sm:text-5xl md:text-6xl tracking-tight">
            Between Places
          </span>
          <span className="block mt-1 sm:mt-2 font-sans text-xl font-normal text-neutral-light sm:text-2xl md:text-3xl">
            a moving travel journal
          </span>
        </h1>
        <motion.p
          className="mt-6 max-w-xl mx-auto font-sans text-base text-neutral-light sm:text-lg"
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
