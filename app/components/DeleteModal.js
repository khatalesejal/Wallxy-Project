"use client";

import { useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteModal({ show, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  // Close modal when pressing ESC
   useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose(); 
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, loading]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this catalog? This action cannot be undone.
            </p>

              <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className={`px-5 py-2 rounded-xl border transition-all
                  ${
                    loading
                      ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-5 py-2 rounded-xl text-white transition-all shadow-md flex items-center justify-center
                  ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
