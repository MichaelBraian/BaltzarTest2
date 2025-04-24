"use client"
import { motion } from "framer-motion"

// Replace the 3D implementation with a simpler animated SVG/image approach
export function Tooth3D() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1.5,
      }}
      className="relative w-48 h-48 mx-auto"
    >
      <motion.div
        animate={{
          rotateY: [0, 180, 360],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 10,
          ease: "linear",
        }}
        className="w-full h-full"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Tooth Root */}
          <path d="M40,50 L30,90 Q50,85 70,90 L60,50 Z" fill="#f8f8ff" stroke="#e0e0e0" strokeWidth="1" />

          {/* Tooth Crown */}
          <rect x="30" y="20" width="40" height="30" rx="5" fill="white" stroke="#e0e0e0" strokeWidth="1" />

          {/* Tooth Top */}
          <path d="M30,20 Q50,10 70,20" fill="white" stroke="#e0e0e0" strokeWidth="1" />

          {/* Tooth Shine */}
          <ellipse cx="45" cy="30" rx="5" ry="8" fill="rgba(255,255,255,0.8)" transform="rotate(-20, 45, 30)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
