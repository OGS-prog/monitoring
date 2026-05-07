"use client";

// ═══════════════════════════════════════════════════════════════════
//  FILE LOCATION:  src/app/monitoring/page.tsx
//
//  This creates a new page at:  yoursite.com.au/monitoring
//
//  SETUP (one-time):
//  1. Copy this file to:  src/app/monitoring/page.tsx
//  2. Copy create-checkout.ts to:  netlify/functions/create-checkout.ts
//  3. In Stripe dashboard, create a $30/month AUD recurring product
//  4. In Netlify dashboard → Environment variables, add:
//       STRIPE_SECRET_KEY  =  sk_live_xxxx
//       STRIPE_PRICE_ID    =  price_xxxx
//       SITE_URL           =  https://www.omegagreensolutions.com.au
//  5. Run:  npm install stripe
//  6. git add . && git commit -m "Add monitoring page" && git push
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import Link from "next/link";

const FEATURES = [
  { icon: "☀️", title: "Daily System Checks", desc: "We review your system's output every single day — not just when something breaks." },
  { icon: "⚡", title: "Fault Detection & Alerts", desc: "Instant notification if your inverter, panels, or battery show any anomaly." },
  { icon: "📊", title: "Monthly Reports", desc: "Clear, readable performance summaries delivered to your inbox each month." },
  { icon: "🔋", title: "Battery Health Tracking", desc: "Keep your battery running at peak capacity with proactive health monitoring." },
  { icon: "📧", title: "Automatic Invoicing", desc: "Stripe automatically issues your monthly invoice — no manual payment needed." },
  { icon: "🛠️", title: "Priority Support", desc: "Subscribers jump the queue. Our technicians get to you faster." },
];

export default function MonitoringPage() {
  const [form, setForm] = useState({ name: "", email: "", address: "", inverterSerial: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.search.includes("success=true")) setSuccess(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #061a0e; }

        .monitor-page {
          min-height: 100vh;
          background: #061a0e;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 40px;
          background: rgba(6,26,14,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(74,222,128,0.1);
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; color: #4ade80; text-decoration: none;
          letter-spacing: -0.01em;
        }
        .nav-logo span { color: #fff; }
        .nav-back {
          font-size: 13px; color: rgba(255,255,255,0.5);
          text-decoration: none; display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .nav-back:hover { color: #4ade80; }

        /* ── HERO ── */
        .hero {
          padding: 160px 24px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80; padding: 8px 20px; border-radius: 999px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 28px;
        }
        .hero-badge::before { content: "●"; font-size: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 7vw, 72px);
          line-height: 1.08; letter-spacing: -0.02em;
          margin-bottom: 24px; max-width: 780px; margin-left: auto; margin-right: auto;
        }
        .hero h1 em { font-style: italic; color: #4ade80; }

        .hero-sub {
          font-size: clamp(16px, 2vw, 19px);
          color: rgba(255,255,255,0.6); max-width: 520px;
          margin: 0 auto 20px; line-height: 1.7;
        }
        .hero-price {
          display: inline-block;
          font-size: 15px; color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 10px 20px;
        }
        .hero-price strong { color: #fff; font-size: 22px; font-weight: 700; }

        /* ── GRID DIVIDER ── */
        .grid-line {
          width: 1px; height: 60px; background: linear-gradient(to bottom, transparent, rgba(74,222,128,0.4), transparent);
          margin: 0 auto;
        }

        /* ── FEATURES ── */
        .features {
          padding: 0 24px 80px;
          max-width: 1100px; margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px;
          transition: border-color 0.3s, background 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(74,222,128,0.25);
          background: rgba(74,222,128,0.04);
        }
        .feature-icon { font-size: 28px; margin-bottom: 14px; display: block; }
        .feature-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #fff; }
        .feature-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; }

        /* ── FORM SECTION ── */
        .form-section {
          padding: 0 24px 100px;
          max-width: 640px; margin: 0 auto;
        }
        .form-section-label {
          text-align: center; margin-bottom: 40px;
        }
        .form-section-label h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 40px); margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .form-section-label p {
          color: rgba(255,255,255,0.5); font-size: 15px; line-height: 1.7;
        }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: clamp(28px,5vw,48px);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
        }

        .field { margin-bottom: 20px; }
        .field label {
          display: block; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.6); margin-bottom: 8px; letter-spacing: 0.02em;
        }
        .field label .hint {
          color: rgba(255,255,255,0.3); font-weight: 400;
        }
        .field input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 18px;
          color: #fff; font-size: 15px; font-family: 'Outfit', sans-serif;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .field input:focus {
          border-color: #4ade80;
          background: rgba(74,222,128,0.04);
        }
        .field input::placeholder { color: rgba(255,255,255,0.2); }

        .submit-btn {
          width: 100%; margin-top: 8px;
          background: #4ade80; color: #061a0e;
          border: none; border-radius: 14px;
          padding: 17px; font-size: 16px; font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          background: #86efac; transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(74,222,128,0.3);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-note {
          text-align: center; margin-top: 16px;
          font-size: 12px; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }

        .error-box {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px; padding: 14px 18px;
          color: #fca5a5; font-size: 14px; margin-bottom: 20px;
        }

        /* ── SUCCESS ── */
        .success-screen {
          text-align: center; padding: 40px 0;
        }
        .success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(74,222,128,0.15);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; font-size: 32px;
        }
        .success-screen h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 30px; color: #4ade80; margin-bottom: 14px;
        }
        .success-screen p {
          color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.7;
          max-width: 380px; margin: 0 auto 28px;
        }
        .success-back {
          display: inline-block; padding: 12px 28px;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80; border-radius: 10px; font-size: 14px;
          text-decoration: none; transition: background 0.2s;
        }
        .success-back:hover { background: rgba(74,222,128,0.2); }

        /* ── FOOTER ── */
        .page-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 32px 24px;
          text-align: center;
          color: rgba(255,255,255,0.3); font-size: 13px;
        }
        .page-footer a { color: rgba(74,222,128,0.7); text-decoration: none; }
        .page-footer a:hover { color: #4ade80; }

        @media (max-width: 600px) {
          .nav { padding: 16px 20px; }
          .hero { padding: 120px 20px 60px; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="monitor-page">

        {/* NAV */}
        <nav className="nav">
          <Link href="/" className="nav-logo">
            Omega <span>Green Solutions</span>
          </Link>
          <Link href="/" className="nav-back">
            ← Back to main site
          </Link>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-badge">Daily Monitoring Service</div>
          <h1>
            Your solar system,<br />
            <em>watched every day.</em>
          </h1>
          <p className="hero-sub">
            We monitor your solar panels and battery system daily, catching faults and dips in performance before they cost you money.
          </p>
          <div className="hero-price">
            <strong>$1/day</strong> &nbsp;·&nbsp; Billed monthly (~$30/month) &nbsp;·&nbsp; Cancel anytime
          </div>
        </section>

        <div className="grid-line" />

        {/* FEATURES */}
        <section className="features">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid-line" />
        <br /><br />

        {/* FORM */}
        <section className="form-section">
          <div className="form-section-label">
            <h2>Sign up today</h2>
            <p>Fill in your details and you&apos;ll be taken to our secure payment page. Your monitoring starts immediately.</p>
          </div>

          <div className="form-card">
            {success ? (
              <div className="success-screen">
                <div className="success-icon">✅</div>
                <h3>You&apos;re all set!</h3>
                <p>
                  Thank you for subscribing. Your monitoring service is now active and your first invoice will arrive at the end of the month.
                </p>
                <Link href="/" className="success-back">← Back to main site</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="error-box">{error}</div>}

                <div className="field">
                  <label>Full Name</label>
                  <input
                    name="name" type="text" required
                    placeholder="John Smith"
                    value={form.name} onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    name="email" type="email" required
                    placeholder="john@example.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Property Address</label>
                  <input
                    name="address" type="text" required
                    placeholder="123 Main St, Sydney NSW 2000"
                    value={form.address} onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>
                    Inverter Serial Number{" "}
                    <span className="hint">(on your inverter label)</span>
                  </label>
                  <input
                    name="inverterSerial" type="text" required
                    placeholder="e.g. SN2024XXXXXX"
                    value={form.inverterSerial} onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Redirecting to payment…" : "Subscribe — $30/month →"}
                </button>

                <p className="form-note">
                  🔒 Secure checkout via Stripe. Cancel anytime.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="page-footer">
          © {new Date().getFullYear()} Omega Green Solutions &nbsp;·&nbsp;{" "}
          <a href="mailto:info@omegagreensolutions.com.au">
            info@omegagreensolutions.com.au
          </a>
          &nbsp;·&nbsp;
          <Link href="/">omegagreensolutions.com.au</Link>
        </footer>

      </div>
    </>
  );
}
