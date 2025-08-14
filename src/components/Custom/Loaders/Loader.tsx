"use client"

import { motion } from "framer-motion"
import { Loader2, Cpu, Cog } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
  variant?: "spinner" | "dots" | "pulse" | "engineering" | "gear" | "wave"
}

export function Loader({ size = "md", text = "Cargando...", className, variant = "spinner" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  // Colores del Colegio de Ingenieros del Perú
  const colors = {
    wine: "#8B1538", // Rojo vino
    darkYellow: "#D4A017", // Amarillo oscuro/dorado
    gradient: "from-[#8B1538] to-[#D4A017]",
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative"
          >
            <Loader2 className={cn(sizeClasses[size], "text-[#8B1538]")} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0"
          >
            <div
              className={cn(
                "border-2 border-transparent border-t-[#D4A017] rounded-full",
                size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10",
              )}
            />
          </motion.div>
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={cn("rounded-full", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")}
              style={{
                background: index % 2 === 0 ? colors.wine : colors.darkYellow,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="relative">
          <motion.div
            className={cn(
              "rounded-full bg-gradient-to-r from-[#8B1538] to-[#D4A017]",
              size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16",
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-[#D4A017]",
              size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16",
            )}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "engineering") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Cog className={cn(sizeClasses[size], "text-[#8B1538]")} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0"
          >
            <Cpu className={cn(sizeClasses[size], "text-[#D4A017]")} />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-r from-[#8B1538]/20 to-[#D4A017]/20 blur-sm",
              size === "sm" ? "w-8 h-8 -m-2" : size === "md" ? "w-12 h-12 -m-3" : "w-16 h-16 -m-4",
            )}
          />
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "gear") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Cog
              className={cn(size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10", "text-[#8B1538]")}
            />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute"
          >
            <Cog className={cn(size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6", "text-[#D4A017]")} />
          </motion.div>
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className={cn(
                "rounded-full bg-gradient-to-t from-[#8B1538] to-[#D4A017]",
                size === "sm" ? "w-1 h-6" : size === "md" ? "w-1.5 h-8" : "w-2 h-10",
              )}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className={cn(
              "font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent",
              textSizeClasses[size],
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  return null
}
