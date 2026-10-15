import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showTop, setShowTop]     = useState(false);
  const [openSection, setOpenSection] = useState(null); // mobile accordion

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const toggleSection = (key) => setOpenSection(p => p === key ? null : key);

  const year = new Date().getFullYear();

  const links = {
    Men:   ["T-Shirts", "Shirts", "Jeans & Pants", "Ethnic Wear", "Jackets"],
    Women: ["Kurtis", "Sarees", "Dresses", "Ethnic Wear", "Jackets"],
    Kids:  ["Boys Clothing", "Girls Clothing", "Frocks & Sets", "Hoodies"],
    Help:  ["About Us", "Contact Us", "FAQs", "Track Order", "Returns & Refunds"],
  };

  const socials = [
    { name: "Instagram", href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg> },
    { name: "Facebook",  href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
    { name: "X",         href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { name: "YouTube",   href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg> },
    { name: "WhatsApp",  href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
  ];

  return (
    <>
      <style>{`
        /* Links */
        .ft-link {
          display: block; color: #888; text-decoration: none;
          font-size: 13.5px; padding: 4px 0;
          border-left: 2px solid transparent;
          transition: color .18s, padding-left .18s, border-color .18s;
        }
        .ft-link:hover { color: #FFD700; padding-left: 6px; border-left-color: #FFD700; }

        /* Social */
        .ft-social {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.10);
          color: #999; text-decoration: none;
          transition: background .2s, color .2s, transform .2s;
        }
        .ft-social:hover { background: #FFD700; color: #1a1a1a; transform: translateY(-2px); border-color: #FFD700; }

        /* Inputs */
        .ft-input {
          flex: 1; background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12); border-right: none;
          border-radius: 8px 0 0 8px; padding: 10px 14px;
          color: #fff; font-size: 13px; outline: none; min-width: 0;
          transition: border-color .2s;
        }
        .ft-input:focus { border-color: #FFD700; }
        .ft-input::placeholder { color: #555; }
        .ft-sub-btn {
          background: #FFD700; border: none; border-radius: 0 8px 8px 0;
          padding: 10px 16px; color: #1a1a1a; font-weight: 800; font-size: 13px;
          cursor: pointer; transition: background .18s; white-space: nowrap;
        }
        .ft-sub-btn:hover { background: #f0c800; }

        /* Section heading */
        .ft-head {
          font-size: 12px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: #fff; margin-bottom: 14px;
        }

        /* Mobile accordion header */
        .ft-acc-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,.07);
          font-size: 13px; font-weight: 700; color: #ccc;
          letter-spacing: .5px; text-transform: uppercase;
          user-select: none;
        }
        .ft-acc-head:hover { color: #FFD700; }
        .ft-acc-arrow { font-size: 10px; transition: transform .25s; color: #666; }
        .ft-acc-body { overflow: hidden; transition: max-height .3s ease; }

        /* Payment badge */
        .ft-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
          border-radius: 7px; padding: 7px 12px; font-size: 12px; color: #888;
          transition: border-color .2s, color .2s;
        }
        .ft-badge:hover { border-color: #FFD700; color: #FFD700; }

        /* Divider */
        .ft-divider { height: 1px; background: rgba(255,255,255,.07); margin: 28px 0; }

        /* Bottom links */
        .ft-bot-link {
          color: #555; text-decoration: none; font-size: 12px;
          transition: color .18s;
        }
        .ft-bot-link:hover { color: #FFD700; }

        /* Responsive top strip */
        @media (max-width: 576px) {
          .ft-strip-item { font-size: 11px; }
          .ft-strip-desc { display: none; }
        }
      `}</style>

      <footer style={{ background: "#0d0d0d", color: "#fff", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

        {/* ── Yellow top strip ── */}
        {/* <div style={{ background: "#111111", padding: "10px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="row g-2 align-items-center">
              {[["🚚","Free Shipping","Above ₹999"],["↩️","30-Day Returns","Easy returns"],["🔒","Secure Pay","Encrypted"],["⭐","Top Quality","Certified"]].map(([icon,t,d]) => (
                <div className="col-6 col-md-3" key={t}>
                  <div className="d-flex align-items-center gap-2 ft-strip-item">
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 12, color: "#1a1a1a", lineHeight: 1.2 }}>{t}</div>
                      <div className="ft-strip-desc" style={{ fontSize: 11, color: "#555" }}>{d}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* ── Main body ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 24px 28px" }}>

          {/* ═══ DESKTOP layout ═══ */}
          <div className="d-none d-md-block">
            <div className="row g-4">

              {/* Brand */}
              <div className="col-lg-3 col-md-5">
                <div style={{ fontWeight: 900, fontSize: 21, letterSpacing: "-0.7px", marginBottom: 10 }}>
                  AKSom <span style={{ color: "#FFD700" }}>Cloths</span>
                </div>
                <p style={{ color: "#777", fontSize: 13.5, lineHeight: 1.75, marginBottom: 18 }}>
                  Your one-stop destination for premium fashion — Men, Women & Kids.
                </p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
                  {socials.map(s => (
                    <a key={s.name} href={s.href} className="ft-social" title={s.name}>{s.icon}</a>
                  ))}
                </div>
                <div style={{ color: "#666", fontSize: 13, lineHeight: 2 }}>
                  <div>📧 support@aksomcloths.com</div>
                  <div>📞 +91 98765 43210</div>
                  <div>📍 Pune, Maharashtra</div>
                </div>
              </div>

              {/* Link columns */}
              {Object.entries(links).map(([section, items]) => (
                <div className="col-lg-2 col-md-3 col-6" key={section}>
                  <div className="ft-head">{section}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map(item => (
                      <li key={item}>
                        <Link className="ft-link"
                          to={section === "Help" ? "#" : `/category/${section.toLowerCase()}?q=${encodeURIComponent(item)}`}>
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Newsletter */}
              <div className="col-lg-3 col-md-7">
                <div className="ft-head">Newsletter</div>
                <p style={{ color: "#777", fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>
                  Exclusive deals & new arrivals in your inbox.
                </p>
                <form onSubmit={handleSubscribe}>
                  <div style={{ display: "flex", marginBottom: 10 }}>
                    <input className="ft-input" placeholder="your@email.com" type="email"
                      value={email} onChange={e => setEmail(e.target.value)} />
                    <button type="submit" className="ft-sub-btn">
                      {subscribed ? "✓" : "Subscribe"}
                    </button>
                  </div>
                </form>
                {subscribed && <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ Subscribed!</p>}
                <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>No spam. Unsubscribe anytime.</p>
                <div className="ft-head" style={{ marginTop: 20 }}>We Accept</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {["💳 Visa","🏦 UPI","📱 Paytm","💰 COD"].map(p => <span key={p} className="ft-badge">{p}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ MOBILE layout — accordion ═══ */}
          <div className="d-md-none">

            {/* Brand — always visible on mobile */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.7px", marginBottom: 8 }}>
                AKSom <span style={{ color: "#FFD700" }}>Cloths</span>
              </div>
              <p style={{ color: "#777", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                Premium fashion for Men, Women & Kids.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
                {socials.map(s => (
                  <a key={s.name} href={s.href} className="ft-social" title={s.name}>{s.icon}</a>
                ))}
              </div>
              <div style={{ color: "#666", fontSize: 12.5, lineHeight: 1.9 }}>
                <div>📧 support@aksomcloths.com</div>
                <div>📞 +91 98765 43210</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
              {/* Accordion for each link section */}
              {Object.entries(links).map(([section, items]) => (
                <div key={section}>
                  <div className="ft-acc-head" onClick={() => toggleSection(section)}>
                    <span>{section}</span>
                    <span className="ft-acc-arrow"
                      style={{ transform: openSection === section ? "rotate(180deg)" : "none" }}>▼</span>
                  </div>
                  <div className="ft-acc-body"
                    style={{ maxHeight: openSection === section ? "300px" : "0" }}>
                    <ul style={{ listStyle: "none", padding: "8px 0 16px 8px", margin: 0 }}>
                      {items.map(item => (
                        <li key={item}>
                          <Link className="ft-link"
                            to={section === "Help" ? "#" : `/category/${section.toLowerCase()}?q=${encodeURIComponent(item)}`}
                            onClick={() => setOpenSection(null)}>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {/* Newsletter on mobile */}
              <div>
                <div className="ft-acc-head" onClick={() => toggleSection("newsletter")}>
                  <span>Newsletter</span>
                  <span className="ft-acc-arrow"
                    style={{ transform: openSection === "newsletter" ? "rotate(180deg)" : "none" }}>▼</span>
                </div>
                <div className="ft-acc-body"
                  style={{ maxHeight: openSection === "newsletter" ? "220px" : "0" }}>
                  <div style={{ padding: "12px 0 16px" }}>
                    <form onSubmit={handleSubscribe}>
                      <div style={{ display: "flex", marginBottom: 10 }}>
                        <input className="ft-input" placeholder="your@email.com" type="email"
                          value={email} onChange={e => setEmail(e.target.value)} />
                        <button type="submit" className="ft-sub-btn">
                          {subscribed ? "✓" : "Go"}
                        </button>
                      </div>
                    </form>
                    {subscribed && <p style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ Subscribed!</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment on mobile */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <div className="ft-head" style={{ justifyContent: "center" }}>We Accept</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {["💳 Visa","🏦 UPI","📱 Paytm","💰 COD"].map(p => <span key={p} className="ft-badge">{p}</span>)}
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="ft-divider" />

          {/* ── Bottom bar ── */}
          <div className="row align-items-center g-2">
            <div className="col-md-6 text-center text-md-start">
              <p style={{ color: "#555", fontSize: 12.5, margin: 0 }}>
                © {year} <span style={{ color: "#FFD700", fontWeight: 700 }}>AKSom Cloths</span>. All rights reserved. Made with ❤️ in India.
              </p>
            </div>
            <div className="col-md-6">
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
                className="justify-content-md-end">
                {["Privacy Policy","Terms of Service","Cookie Policy","Sitemap"].map(t => (
                  <a key={t} href="#" className="ft-bot-link">{t}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back to Top ── */}
      <button onClick={scrollToTop} title="Back to Top"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 44, height: 44, borderRadius: "50%",
          background: "#FFD700", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,.4)",
          zIndex: 999,
          opacity: showTop ? 1 : 0,
          transform: showTop ? "scale(1) translateY(0)" : "scale(0.7) translateY(12px)",
          pointerEvents: showTop ? "auto" : "none",
          transition: "opacity .3s ease, transform .3s ease",
        }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </>
  );
}