"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { Loader } from "./Loader"



interface AdvancedLoaderProps {
  data: any
  children: React.ReactNode
  loadingText?: string
  successText?: string
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse" | "engineering" | "gear" | "wave"
  transitionType: "fade" | "slide" | "scale" | "flip" | "curtain"
  className?: string
  successDuration?: number
  showSuccess?: boolean
}

export function AdvancedLoader({
  data,
  children,
  loadingText = "Cargando datos...",
  successText = "¡Completado!",
  size = "md",
  variant = "spinner",
  transitionType = "fade",
  className,
  successDuration = 1000,
  showSuccess = true,
}: AdvancedLoaderProps) {
  const [loadingState, setLoadingState] = useState<"loading" | "success" | "complete">("loading")

  useEffect(() => {
    if (data !== undefined && data !== null && loadingState === "loading") {
      if (showSuccess) {
        setLoadingState("success")
        const timer = setTimeout(() => {
          setLoadingState("complete")
        }, successDuration)
        return () => clearTimeout(timer)
      } else {
        setLoadingState("complete")
      }
    } else if (data === undefined || data === null) {
      setLoadingState("loading")
    }
  }, [data, loadingState, successDuration, showSuccess])

  const getTransitionVariants = () => {
    switch (transitionType) {
      case "slide":
        return {
          loading: {
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 50 },
          },
          content: {
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
          },
        }
      case "scale":
        return {
          loading: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.2 },
          },
          content: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
          },
        }
      case "flip":
        return {
          loading: {
            initial: { opacity: 0, rotateY: -90 },
            animate: { opacity: 1, rotateY: 0 },
            exit: { opacity: 0, rotateY: 90 },
          },
          content: {
            initial: { opacity: 0, rotateY: -90 },
            animate: { opacity: 1, rotateY: 0 },
          },
        }
      case "curtain":
        return {
          loading: {
            initial: { opacity: 0, scaleY: 0 },
            animate: { opacity: 1, scaleY: 1 },
            exit: { opacity: 0, scaleY: 0 },
          },
          content: {
            initial: { opacity: 0, scaleY: 0, originY: 0 },
            animate: { opacity: 1, scaleY: 1, originY: 0 },
          },
        }
      default: // fade
        return {
          loading: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          content: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          },
        }
    }
  }

  const variants = getTransitionVariants()

  return (
    <div className="relative min-h-[200px]">
      <AnimatePresence mode="wait">
        {loadingState === "loading" && (
          <motion.div
            key="loading"
            initial={variants.loading.initial}
            animate={variants.loading.animate}
            exit={variants.loading.exit}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader text={loadingText} size={size} variant={variant} className={className} />
          </motion.div>
        )}

        {loadingState === "success" && showSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="relative"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#8B1538] via-[#D4A017] to-[#8B1538] rounded-full flex items-center justify-center shadow-2xl">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>

                {/* Partículas de éxito */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.cos((i * 60 * Math.PI) / 180) * 40],
                      y: [0, Math.sin((i * 60 * Math.PI) / 180) * 40],
                    }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#D4A017] rounded-full"
                  />
                ))}

                {/* Anillo expansivo */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 border-4 border-[#D4A017] rounded-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-center"
              >
                <p className="font-bold bg-gradient-to-r from-[#8B1538] to-[#D4A017] bg-clip-text text-transparent text-xl">
                  {successText}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="h-1 bg-gradient-to-r from-[#8B1538] to-[#D4A017] rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {loadingState === "complete" && (
          <motion.div
            key="content"
            initial={variants.content.initial}
            animate={variants.content.animate}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
