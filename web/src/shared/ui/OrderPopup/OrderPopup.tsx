"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrderPopup as OrderPopupData } from "@/domain/site";
import { submissionSchema, type SubmissionFormValues } from "@/shared/lib/submission-schema";
import styles from "./OrderPopup.module.css";

interface OrderPopupProps {
  popup: OrderPopupData;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The email-capture dialog Header's order button (and Hero's price, via
 * the same button) opens. Confirmed against fetched reference HTML/CSS,
 * not the supplied spec's guesses: the heading and success message both
 * reuse the same large serif headline style hero uses (not a small h4),
 * the dialog is considerably wider (55.44vw, not 38.89vw) with 4px
 * corners (not a heavily rounded 1.39vw), and the email field is a plain
 * underlined input (border-bottom only) rather than a rounded pill.
 *
 * Validates with the same schema the server route uses
 * (shared/lib/submission-schema) via zodResolver, so client and server
 * checks cannot drift (CLAUDE.md §2 — forms must validate input).
 */
export function OrderPopup({ popup, isOpen, onClose }: OrderPopupProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
  });

  async function onSubmit(values: SubmissionFormValues) {
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setIsSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className={styles.overlay} data-open={isOpen} inert={!isOpen} onClick={onClose}>
      <div className={styles.popup} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {isSuccess ? (
          <p className={styles.heading}>{popup.successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className={styles.heading}>{popup.heading}</h2>
            <p className={styles.subtext}>{popup.subtext}</p>

            <div className={styles.field}>
              <input
                type="email"
                placeholder={popup.emailPlaceholder}
                className={styles.input}
                {...register("email")}
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            {serverError && <p className={styles.error}>{serverError}</p>}

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {popup.buttonLabel}
            </button>
          </form>
        )}

        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          Close
        </button>
      </div>
    </div>
  );
}
