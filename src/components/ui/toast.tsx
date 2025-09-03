import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icon =
    type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <XCircle className="w-5 h-5" />
    );
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const borderColor =
    type === "success" ? "border-green-600" : "border-red-600";

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColor} ${borderColor} text-white max-w-sm`}
        >
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0">{icon}</div>
              <p className="flex-1 text-sm font-medium">{message}</p>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
