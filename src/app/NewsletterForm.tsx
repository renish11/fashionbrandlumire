"use client";

import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export default function NewsletterForm() {
  return (
    <form
      className={styles.newsletterForm}
      onSubmit={(e) => e.preventDefault()}
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        placeholder="Your email address"
        className={styles.newsletterInput}
        aria-label="Email address"
        required
      />
      <Button type="submit" variant="primary" size="md">
        Subscribe
      </Button>
    </form>
  );
}
