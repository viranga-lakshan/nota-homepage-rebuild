"use client";

import { useState, useEffect, useRef } from "react";
import type { OrderPopup } from "@/domain/site";
import { submissionSchema } from "@/shared/lib/submission-schema";
import styles from "./OrderPopupModal.module.css";

interface OrderPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderPopup?: OrderPopup | null;
}

export function OrderPopupModal({
  isOpen,
  onClose,
  orderPopup,
}: OrderPopupModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const heading = orderPopup?.heading || "Stay ahead";
  const subtext =
    orderPopup?.subtext ||
    "Launching soon. Get early access and insider updates";
  const emailPlaceholder = orderPopup?.emailPlaceholder || "E-mail";
  const buttonLabel = orderPopup?.buttonLabel || "Notify me";
  const successMessage =
    orderPopup?.successMessage || "All set. We’ll keep you posted";

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setFieldError(null);
      setEmail("");
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError("Something went wrong! Try again");
      inputRef.current?.focus();
      return;
    }

    const validation = submissionSchema.safeParse({ email: trimmed });
    if (!validation.success) {
      setFieldError("Something went wrong! Try again");
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong! Try again");
      }

      setIsSuccess(true);
      setEmail("");
    } catch {
      setFieldError("Something went wrong! Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.backdrop}
      data-open={isOpen}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Order early access popup"
      inert={!isOpen}
    >
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className={styles.stateSuccess}>
            <div className={styles.successHeadline}>
              <span className={styles.successLine}>All set. We’ll keep</span>
              <span className={styles.successLine}>you posted</span>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              <span>Close</span>
            </button>
          </div>
        ) : (
          <>
            <div className={styles.popupTextWrapper}>
              <div className={styles.headline}>
                <span>{heading}</span>
              </div>
              <div className={styles.mainText}>
                {subtext.includes("and insider updates") ? (
                  <>
                    <span className={styles.subtextLine}>
                      {subtext.replace("and insider updates", "").trim()}
                    </span>
                    <span className={styles.subtextLine}>and insider updates</span>
                  </>
                ) : (
                  <span>{subtext}</span>
                )}
              </div>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.inputGroup}>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  placeholder={emailPlaceholder}
                  className={`${styles.input} ${
                    fieldError ? styles.inputError : ""
                  }`}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "order-email-error" : undefined}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {fieldError && (
                  <span id="order-email-error" className={styles.errorText}>
                    {fieldError}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={styles.spinner} aria-label="Submitting..." />
                ) : (
                  <>
                    <span>{buttonLabel}</span>
                    <div className={styles.buttonSeparator} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span>Close</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
