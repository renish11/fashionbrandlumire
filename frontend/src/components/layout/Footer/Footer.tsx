import Link from "next/link";
import { Globe, Share2, Mail } from "lucide-react";
import styles from "./Footer.module.css";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Collections", href: "/shop" },
    { label: "Women", href: "/shop?category=women" },
    { label: "Dresses", href: "/shop?category=dresses" },
    { label: "Sale", href: "/shop?filter=sale" },
  ],
  help: [
    { label: "Size Guide", href: "#" },
    { label: "Shipping & Returns", href: "#" },
    { label: "Care Instructions", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "Our Story", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Boutiques", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top section */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Lumière</span>
            </Link>
            <p className={styles.tagline}>
              The art of effortless elegance. Crafted for those who appreciate the quiet luxury of
              exceptional quality.
            </p>
            <div className={styles.social}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Instagram"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Facebook"
              >
                <Share2 size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on YouTube"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Shop</h3>
              <ul className={styles.linkList}>
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Help</h3>
              <ul className={styles.linkList}>
                {footerLinks.help.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Company</h3>
              <ul className={styles.linkList}>
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Lumière. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link href="#" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link href="#" className={styles.legalLink}>
              Terms & Conditions
            </Link>
            <Link href="#" className={styles.legalLink}>
              Cookie Policy
            </Link>
          </div>
          <div className={styles.payment}>
            <span className={styles.paymentLabel}>We accept:</span>
            {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map((method) => (
              <span key={method} className={styles.paymentCard} aria-label={method}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
