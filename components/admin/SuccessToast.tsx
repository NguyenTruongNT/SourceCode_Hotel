import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessToast({ message, onClose, duration = 6000 }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto"
        >
          <div className="bg-emerald-50 border border-emerald-200 shadow-xl rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 bg-emerald-500 rounded-full p-1 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-emerald-800 text-sm font-medium leading-5">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-emerald-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
