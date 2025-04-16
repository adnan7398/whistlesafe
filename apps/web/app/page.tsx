import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="WhistleSafe Logo"
              width={150}
              height={40}
              priority
            />
          </div>
          <div className={styles.navLinks}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login" className={styles.loginBtn}>Login</Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Report Safely, Act Responsibly</h1>
          <p>WhistleSafe provides a secure platform for reporting incidents while protecting your identity</p>
          <Link href="/report" className={styles.primaryBtn}>
            Submit a Report
          </Link>
        </section>

        <section className={styles.features}>
          <h2>How It Works</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <Image
                src="/anonymous.svg"
                alt="Anonymous Reporting"
                width={64}
                height={64}
              />
              <h3>Anonymous Reporting</h3>
              <p>Submit reports without revealing your identity</p>
            </div>
            <div className={styles.featureCard}>
              <Image
                src="/secure.svg"
                alt="Secure Platform"
                width={64}
                height={64}
              />
              <h3>Secure Platform</h3>
              <p>End-to-end encryption for all your data</p>
            </div>
            <div className={styles.featureCard}>
              <Image
                src="/track.svg"
                alt="Track Progress"
                width={64}
                height={64}
              />
              <h3>Track Progress</h3>
              <p>Monitor your report's status in real-time</p>
            </div>
          </div>
        </section>

        <section className={styles.roles}>
          <h2>Platform Access</h2>
          <div className={styles.roleGrid}>
            <div className={styles.roleCard}>
              <h3>For Users</h3>
              <p>Submit reports anonymously and track their progress</p>
              <Link href="/report" className={styles.secondaryBtn}>
                Start Reporting
              </Link>
            </div>
            <div className={styles.roleCard}>
              <h3>For Admins</h3>
              <p>Manage and respond to reports in your jurisdiction</p>
              <Link href="/admin/login" className={styles.secondaryBtn}>
                Admin Login
              </Link>
            </div>
            <div className={styles.roleCard}>
              <h3>For Super Admins</h3>
              <p>Oversee the entire platform and manage administrators</p>
              <Link href="/superadmin/login" className={styles.secondaryBtn}>
                Super Admin Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>WhistleSafe</h4>
            <p>Secure. Anonymous. Responsible.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>support@whistlesafe.com</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 WhistleSafe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
