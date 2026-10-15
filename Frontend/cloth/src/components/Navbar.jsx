import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const auth = useContext(AuthContext);
  const user   = auth?.user;
  const logout = auth?.logout;

  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(null);
  const [dark,         setDark]         = useState(true);
  const navigate   = useNavigate();
  const closeTimer = useRef(null);
  const searchRef  = useRef(null);

  useEffect(() => {
    document.body.style.background = dark ? "#0f0f0f" : "#f5f5f5";
    document.body.style.color      = dark ? "#fff"    : "#1a1a1a";
  }, [dark]);

  const T = {
    navBg:      dark ? "#141414" : "#ffffff",
    border:     dark ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(0,0,0,.08)",
    shadow:     dark ? "0 4px 24px rgba(0,0,0,.5)" : "0 4px 24px rgba(0,0,0,.08)",
    linkColor:  dark ? "#e0e0e0" : "#333333",
    linkHov:    "#FFD700",
    ddBg:       dark ? "#1e1e1e" : "#ffffff",
    ddBorder:   dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
    ddItem:     dark ? "#d0d0d0" : "#444444",
    ddItemHov:  dark ? "#252525" : "#fffbf0",
    mobSubBg:   dark ? "#0d0d0d" : "#f8f8f8",
    mobSubLink: dark ? "#aaaaaa" : "#555555",
    searchBg:   dark ? "#1e1e1e" : "#f0f0f0",
    searchBdr:  dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.15)",
    searchTxt:  dark ? "#ffffff" : "#1a1a1a",
    searchPh:   dark ? "#666666" : "#aaaaaa",
    togBg:      dark ? "#2a2a2a" : "#e8e8e8",
    togKnob:    dark ? "#FFD700" : "#333333",
    divider:    dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
  };

  // Each item: { label: display name, sub: subcategory key in DB }
  const dropdowns = {
    men: [
      { label: "T-Shirts",      sub: "t-shirts"   },
      { label: "Shirts",        sub: "shirts"     },
      { label: "Jeans & Pants", sub: "jeans"      },
      { label: "Ethnic Wear",   sub: "ethnic"     },
      { label: "Jackets",       sub: "jackets"    },
    ],
    women: [
      { label: "Kurtis",        sub: "kurtis"     },
      { label: "Sarees",        sub: "sarees"     },
      { label: "Dresses",       sub: "dresses"    },
      { label: "Ethnic Wear",   sub: "ethnic"     },
      { label: "Jackets",       sub: "jackets"    },
    ],
    kids: [
      { label: "Boys Clothing",  sub: "boys"      },
      { label: "Girls Clothing", sub: "girls"     },
      { label: "Frocks & Sets",  sub: "frocks"    },
      { label: "Hoodies",        sub: "hoodies"   },
    ],
    accessories: [
      { label: "Shoes",       sub: "shoes"       },
      { label: "Belt",        sub: "belt"        },
      { label: "Watches",     sub: "watches"     },
      { label: "Sunglasses",  sub: "sunglasses"  },
    ],
  };
  const navItems = [
    { key: "men",        label: "Men"        },
    { key: "women",      label: "Women"      },
    { key: "kids",       label: "Kids"       },
    { key: "accessories", label: "Accessories"},
  ];

  const onEnter = (k) => { clearTimeout(closeTimer.current); setOpenDropdown(k); };
  const onLeave = ()  => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 180); };
  const toggleMobile = (k) => setMobileOpen(p => p === k ? null : k);

  const doSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/category/All?q=${encodeURIComponent(q)}`);
      setSearchQuery(""); setSearchOpen(false);
    }
  };
  const handleSearch  = (e) => { e.preventDefault(); doSearch(); };
  const handleKeyDown = (e) => {
    if (e.key === "Enter")  { e.preventDefault(); doSearch(); }
    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
  };
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      <style>{`
        /* ══ Dropdown ══ */
        .ak-dd-wrap { position: relative; }
        .ak-dd-menu {
          display: none;
          position: absolute; top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          min-width: 210px;
          border-radius: 12px;
          z-index: 9999;
          overflow: hidden;
          animation: ddFade .16s ease;
          border: 1px solid rgba(255,215,0,.18);
        }
        .ak-dd-menu.open { display: block; }
        .ak-dd-head {
          padding: 10px 16px 6px;
          font-size: 10px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: #FFD700; opacity: .8;
        }
        .ak-dd-item {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px;
          text-decoration: none; font-size: 13.5px; font-weight: 500;
          transition: background .13s, padding-left .13s;
          border-left: 2px solid transparent;
        }
        .ak-dd-item:hover { border-left-color: #FFD700; padding-left: 20px; }
        .ak-dd-divider { height: 1px; margin: 4px 12px; }
        .ak-dd-viewall {
          display: block; text-align: center;
          padding: 10px 16px; font-size: 12px; font-weight: 700;
          text-decoration: none; letter-spacing: .5px;
          transition: background .15s;
        }
        .ak-dd-viewall:hover { background: #FFD700 !important; color: #1a1a1a !important; }

        /* ══ Nav link ══ */
        .ak-nav-link {
          text-decoration: none; font-size: 13.5px; font-weight: 600;
          padding: 0 14px; height: 64px;
          display: flex; align-items: center; gap: 5px;
          letter-spacing: .3px;
          border-bottom: 2px solid transparent;
          transition: color .18s, border-color .18s;
          white-space: nowrap;
        }
        .ak-nav-link:hover,
        .ak-nav-link.active { color: #FFD700 !important; border-bottom-color: #FFD700; }
        .ak-arrow {
          font-size: 8px; opacity: .5;
          transition: transform .22s, opacity .22s;
          margin-top: 1px;
        }
        .ak-dd-wrap:hover .ak-arrow { opacity: 1; transform: rotate(180deg); }

        /* ══ Mobile accordion ══ */
        .ak-mob-sub { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
        .ak-mob-sub.open { max-height: 320px; }
        .ak-mob-sub-item {
          display: block; padding: 9px 32px;
          text-decoration: none; font-size: 13.5px; font-weight: 500;
          border-left: 2px solid transparent;
          transition: color .15s, border-color .15s, padding-left .15s;
        }
        .ak-mob-sub-item:hover { color: #FFD700 !important; border-left-color: #FFD700; padding-left: 36px; }
        .ak-mob-sub-viewall {
          display: block; padding: 10px 32px 14px;
          color: #FFD700 !important; font-weight: 700; font-size: 13px;
          text-decoration: none;
        }

        /* ══ Search ══ */
        .ak-search-box {
          display: flex; align-items: center; gap: 8px;
          border-radius: 10px; padding: 6px 12px;
          max-width: 0; overflow: hidden; opacity: 0;
          transition: max-width .32s ease, opacity .32s ease;
          border: 1.5px solid transparent;
        }
        .ak-search-box.open { max-width: 280px; opacity: 1; border-color: #FFD700; }
        .ak-search-in {
          background: transparent; border: none; outline: none;
          font-size: 13px; width: 140px; letter-spacing: .2px;
        }
        .ak-search-go {
          background: #FFD700; border: none; border-radius: 6px;
          padding: 3px 10px; cursor: pointer;
          color: #1a1a1a; font-size: 12px; font-weight: 800;
          white-space: nowrap;
        }
        .ak-icon-btn {
          background: none; border-radius: 10px;
          width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px;
          transition: background .18s, border-color .18s;
        }
        .ak-icon-btn:hover { background: rgba(255,215,0,.12) !important; border-color: #FFD700 !important; }

        /* ══ Theme toggle ══ */
        .ak-tog {
          width: 46px; height: 24px; border-radius: 12px;
          border: none; cursor: pointer; position: relative;
          transition: background .3s; flex-shrink: 0;
          display: flex; align-items: center;
        }
        .ak-knob {
          width: 18px; height: 18px; border-radius: 50%;
          position: absolute; transition: left .28s cubic-bezier(.4,0,.2,1);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.3);
        }

        /* ══ Mobile menu ══ */
        .mob-srch-row {
          display: flex; align-items: center;
          border-radius: 10px; overflow: hidden;
        }
        .mob-srch-row:focus-within { outline: 1.5px solid #FFD700; }
        .mob-srch-in { flex: 1; background: transparent; border: none; outline: none; font-size: 14px; padding: 11px 14px; }
        .mob-srch-btn { background: #FFD700; border: none; padding: 11px 16px; cursor: pointer; font-size: 15px; }

        /* ══ Cart btn ══ */
        .ak-cart-btn {
          display: flex; align-items: center; gap: 7px;
          background: #FFD700; color: #1a1a1a;
          border: none; border-radius: 10px;
          padding: 7px 14px; font-weight: 800; font-size: 13px;
          text-decoration: none; white-space: nowrap;
          transition: background .18s, transform .18s;
          position: relative;
        }
        .ak-cart-btn:hover { background: #f0c800; transform: translateY(-1px); color: #1a1a1a; }

        @keyframes ddFade {
          from { opacity:0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          background: T.navBg,
          borderBottom: T.border,
          boxShadow: T.shadow,
          position: "sticky", top: 0, zIndex: 400,
          transition: "background .3s, box-shadow .3s",
        }}
      >
        <div className="container-fluid" style={{ height: 64, padding: "0 28px", display: "flex", alignItems: "center", gap: 16 }}>

          {/* ── Logo ── */}
          <Link to="/" style={{
            textDecoration: "none",
            color: dark ? "#ffffff" : "#111111",
            fontWeight: 900, fontSize: 19,
            letterSpacing: "-0.8px", whiteSpace: "nowrap",
            marginRight: 4,
          }}>
            AKSom <span style={{ color: "#FFD700" }}>Cloths</span>
          </Link>

          {/* ── Mobile icons ── */}
          <div className="d-flex align-items-center gap-2 d-lg-none ms-auto">
            <button className="ak-tog" onClick={() => setDark(d => !d)} style={{ background: T.togBg }}>
              <span className="ak-knob" style={{ background: T.togKnob, left: dark ? 24 : 4 }}>
                {dark ? "🌙" : "☀️"}
              </span>
            </button>
            <Link className="ak-cart-btn" to="/cart" style={{ padding: "7px 12px", fontSize: 18, background: "#FFD700" }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "#ef4444", color: "#fff",
                  borderRadius: "50%", width: 18, height: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800
                }}>{cartCount}</span>
              )}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarMain"
              aria-controls="navbarMain"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                border: `1px solid ${T.searchBdr}`,
                borderRadius: 10, padding: "6px 10px",
                background: "none",
              }}
            >
              <span className="navbar-toggler-icon"
                style={{ filter: dark ? "invert(1)" : "none" }} />
            </button>
          </div>

          {/* ══ Collapse ══ */}
          <div className="collapse navbar-collapse" id="navbarMain"
            style={{ background: T.navBg }}>

            {/* Nav links */}
            <ul className="navbar-nav mx-auto mb-0" style={{ gap: 0 }}>
              {navItems.map(({ key, label }) => (
                <li key={key} className="nav-item ak-dd-wrap"
                  onMouseEnter={() => onEnter(key)}
                  onMouseLeave={onLeave}>

                  {/* Desktop */}
                  <Link className="ak-nav-link d-none d-lg-flex"
                    to={`/category/${key}`}
                    style={{ color: openDropdown === key ? "#FFD700" : T.linkColor, borderBottomColor: openDropdown === key ? "#FFD700" : "transparent" }}>
                    {label}
                    <span className="ak-arrow">▼</span>
                  </Link>

                  {/* Mobile row */}
                  <div className="d-flex d-lg-none align-items-center justify-content-between px-3 py-2"
                    style={{ cursor: "pointer", borderBottom: `1px solid ${T.divider}` }}
                    onClick={() => toggleMobile(key)}>
                    <Link to={`/category/${key}`}
                      style={{ color: T.linkColor, textDecoration: "none", fontSize: 15, fontWeight: 600 }}
                      onClick={e => e.stopPropagation()}>
                      {label}
                    </Link>
                    <span style={{
                      color: T.searchPh, fontSize: 10,
                      transform: mobileOpen === key ? "rotate(180deg)" : "none",
                      transition: "transform .22s"
                    }}>▼</span>
                  </div>

                  {/* Desktop Dropdown */}
                  <div className={`ak-dd-menu${openDropdown === key ? " open" : ""}`}
                    style={{ background: T.ddBg, boxShadow: T.shadow }}>
                    <div className="ak-dd-head">{label}</div>
                    {dropdowns[key].map(item => (
                      <Link key={item.sub} className="ak-dd-item"
                        to={`/category/${key}?sub=${encodeURIComponent(item.sub)}`}
                        style={{ color: T.ddItem }}
                        onMouseOver={e => { e.currentTarget.style.background = T.ddItemHov; e.currentTarget.style.paddingLeft = "20px"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "16px"; }}
                        onClick={() => setOpenDropdown(null)}>
                        <span style={{ opacity: .4, fontSize: 11 }}>›</span> {item.label}
                      </Link>
                    ))}
                    <div className="ak-dd-divider" style={{ background: T.ddBorder }} />
                    <Link className="ak-dd-viewall"
                      to={`/category/${key}`}
                      style={{ color: T.ddItem, background: "transparent" }}
                      onClick={() => setOpenDropdown(null)}>
                      View All {label} →
                    </Link>
                  </div>

                  {/* Mobile Accordion */}
                  <div className={`ak-mob-sub d-lg-none${mobileOpen === key ? " open" : ""}`}
                    style={{ background: T.mobSubBg }}>
                    {dropdowns[key].map(item => (
                      <Link key={item.sub} className="ak-mob-sub-item"
                        to={`/category/${key}?sub=${encodeURIComponent(item.sub)}`}
                        style={{ color: T.mobSubLink }}
                        onClick={() => setMobileOpen(null)}>
                        {item.label}
                      </Link>
                    ))}
                    <Link className="ak-mob-sub-viewall"
                      to={`/category/${key}`}
                      onClick={() => setMobileOpen(null)}>
                      → View All {label}
                    </Link>
                  </div>
                </li>
              ))}

              {/* New & Featured */}
              <li className="nav-item">
                <Link className="ak-nav-link" to="/category/featured"
                  style={{ color: "#FFD700", fontWeight: 700, letterSpacing: ".3px" }}>
                  New & Featured
                  <span style={{ fontSize: 10, marginLeft: 3, opacity: .8 }}>✦</span>
                </Link>
              </li>
            </ul>

            {/* ══ Desktop: Right side ══ */}
            <div className="d-none d-lg-flex align-items-center gap-2">

              {/* Search icon */}
              {!searchOpen && (
                <button className="ak-icon-btn" onClick={() => setSearchOpen(true)}
                  style={{ border: `1px solid ${T.searchBdr}` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.linkColor} strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              )}

              {/* Search slide */}
              <form onSubmit={handleSearch} style={{ display: "flex" }}>
                <div className={`ak-search-box${searchOpen ? " open" : ""}`}
                  style={{ background: T.searchBg, borderColor: searchOpen ? "#FFD700" : T.searchBdr }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.searchPh} strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    ref={searchRef}
                    className="ak-search-in"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ color: T.searchTxt }}
                  />
                  {searchQuery && <button type="submit" className="ak-search-go">Go</button>}
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: T.searchPh, fontSize: 15, padding: "0 2px" }}>
                      ✕
                    </button>
                  )}
                  <button type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.searchPh, padding: "0 4px", whiteSpace: "nowrap" }}>
                    ✕
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div style={{ width: 1, height: 26, background: T.divider, margin: "0 4px" }} />

              {/* Theme Toggle */}
              <button className="ak-tog" onClick={() => setDark(d => !d)}
                title={dark ? "Light Mode" : "Dark Mode"}
                style={{ background: T.togBg }}>
                <span className="ak-knob" style={{ background: T.togKnob, left: dark ? 24 : 4 }}>
                  {dark ? "🌙" : "☀️"}
                </span>
              </button>

              {/* Divider */}
              <div style={{ width: 1, height: 26, background: T.divider, margin: "0 4px" }} />

              {/* Cart */}
              <Link className="ak-cart-btn" to="/cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Cart
                <span style={{
                  background: "#1a1a1a", color: "#FFD700",
                  borderRadius: 20, padding: "1px 8px", fontSize: 12, fontWeight: 800
                }}>{cartCount}</span>
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    background: "#ef4444", color: "#fff",
                    borderRadius: "50%", width: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800
                  }}>{cartCount}</span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <>
                  <span style={{ fontSize: 13, color: T.searchPh, whiteSpace: "nowrap", fontWeight: 600 }}>
                    Hi, {user.name?.split(" ")[0]} 👋
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      background: "none", border: `1px solid rgba(239,68,68,.5)`,
                      color: "#ef4444", borderRadius: 8, padding: "6px 14px",
                      cursor: "pointer", fontSize: 13, fontWeight: 700,
                      transition: "background .18s",
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,.1)"}
                    onMouseOut={e => e.currentTarget.style.background = "none"}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{
                    color: T.linkColor, textDecoration: "none",
                    fontSize: 13, fontWeight: 700,
                    border: `1px solid ${T.searchBdr}`,
                    borderRadius: 8, padding: "6px 14px",
                    transition: "border-color .18s, color .18s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#FFD700"; e.currentTarget.style.color = "#FFD700"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.searchBdr; e.currentTarget.style.color = T.linkColor; }}>
                    Login
                  </Link>
                  <Link to="/register" style={{
                    background: "#FFD700", color: "#1a1a1a",
                    textDecoration: "none", fontSize: 13, fontWeight: 800,
                    borderRadius: 8, padding: "6px 16px",
                    transition: "background .18s",
                  }}>
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ══ Mobile menu content ══ */}
            <div className="d-lg-none" style={{ borderTop: `1px solid ${T.divider}`, marginTop: 8 }}>

              {/* Search */}
              <div style={{ padding: "12px 16px 8px" }}>
                <form className="mob-srch-row" onSubmit={handleSearch}
                  style={{ background: T.searchBg, border: `1px solid ${T.searchBdr}`, borderRadius: 10 }}>
                  <input
                    className="mob-srch-in"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ color: T.searchTxt }}
                  />
                  <button type="submit" className="mob-srch-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </button>
                </form>
              </div>

              {/* Auth */}
              <div style={{ padding: "8px 16px 16px", display: "flex", gap: 8 }}>
                {user ? (
                  <>
                    <span style={{ fontSize: 13, color: T.searchPh, margin: "auto 0", fontWeight: 600 }}>
                      Hi, {user.name?.split(" ")[0]} 👋
                    </span>
                    <button onClick={logout}
                      style={{
                        marginLeft: "auto", background: "none",
                        border: "1px solid rgba(239,68,68,.4)",
                        color: "#ef4444", borderRadius: 8,
                        padding: "8px 16px", cursor: "pointer", fontWeight: 700
                      }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"
                      style={{
                        flex: 1, textAlign: "center",
                        color: T.linkColor, textDecoration: "none", fontWeight: 700,
                        border: `1px solid ${T.searchBdr}`, borderRadius: 8, padding: "10px",
                      }}>
                      Login
                    </Link>
                    <Link to="/register"
                      style={{
                        flex: 1, textAlign: "center",
                        background: "#FFD700", color: "#1a1a1a",
                        textDecoration: "none", fontWeight: 800,
                        borderRadius: 8, padding: "10px",
                      }}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

          </div>{/* /collapse */}
        </div>
      </nav>

      {searchOpen && (
        <div onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          style={{ position: "fixed", inset: 0, zIndex: 399 }} />
      )}
    </>
  );
}