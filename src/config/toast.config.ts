import { ToasterProps } from "react-hot-toast";

/**
 * Toast notification configuration
 * Centralized styling for consistent toast appearance
 */
export const TOAST_CONFIG: ToasterProps = {
  position: "top-right",
  toastOptions: {
    duration: 3000,
    style: {
      background: "#333",
      color: "#fff",
    },
    success: {
      style: {
        background: "#22c55e",
      },
    },
    error: {
      style: {
        background: "#ef4444",
      },
    },
  },
};

