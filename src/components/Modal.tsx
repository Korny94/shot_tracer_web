import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Cross-browser, dependency-free modal.
 *
 * Replaces the previous framer-motion <AnimatePresence>/<motion.div> modals.
 * Enter/exit animations are done with plain CSS transitions (opacity + scale),
 * which work in every browser. The element stays mounted for the length of the
 * exit transition so the close animation is preserved.
 *
 * Features:
 *  - Backdrop (blurred) click closes (toggle via closeOnBackdrop)
 *  - Esc key closes
 *  - Locks body scroll while open
 *  - Accessible: role="dialog" + aria-modal
 */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind max-width class for the content wrapper. */
  maxWidth?: string;
  /** Allow closing by clicking the blurred backdrop. Default: true. */
  closeOnBackdrop?: boolean;
  /** Accessible label for the dialog. */
  label?: string;
}

const TRANSITION_MS = 200;

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-sm",
  closeOnBackdrop = true,
  label,
}: ModalProps) {
  // `render` keeps the node mounted during the exit animation.
  const [render, setRender] = useState(open);
  // `show` drives the enter/exit transition classes.
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (open) {
      setRender(true);
      // Wait a frame so the initial (hidden) styles are committed before we
      // flip to the visible state — otherwise the transition is skipped.
      raf = requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
      timer = setTimeout(() => setRender(false), TRANSITION_MS);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll while a modal is on screen.
  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  if (!render || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* Blurred backdrop */}
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        style={{
          opacity: show ? 1 : 0,
          transition: `opacity ${TRANSITION_MS}ms ease-out`,
        }}
      />

      {/* Content wrapper (scales + fades) */}
      <div
        className={`relative w-full ${maxWidth}`}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.95)",
          transition: `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`,
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
