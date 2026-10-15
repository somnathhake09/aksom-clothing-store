import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/landing/LandingPage_1.jpg";
import img2 from "../assets/images/landing/LandingPage_2.jpg";
import img3 from "../assets/images/landing/LandingPage_3.jpg";
import img4 from "../assets/images/landing/LandingPage_4.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ── Original data — unchanged ──────────────────────────────────────
  const categories = [
    { title: "Men",           type: "men",      img: "/images/men/Men_1.png"      },
    { title: "Women",         type: "women",    img: "/images/women/Women_1.png"  },
    { title: "Kids",          type: "kids",     img: "/images/kids/Kids_1.png"    },
    { title: "New & Featured",type: "featured", img: "/images/men/Men_2.png"      },
  ];

  const featuredShoes = [
    { id: 1, name: "Nike Air Force",   price: 9695, oldPrice: 12000, image: img1, tag: "Trending", rating: 4.5 },
    { id: 2, name: "Nike Shox Z",      price: 3795, oldPrice: 5000,  image: img2, tag: "Sale",     rating: 4.2 },
    { id: 3, name: "Nike Flex Runner", price: 3995, oldPrice: 5500,  image: img3, tag: "New",      rating: 4.0 },
    { id: 4, name: "Nike Witness",     price: 8695, oldPrice: 11000, image: img4, tag: "Hot",      rating: 4.7 },
  ];

  const tagColors = {
    New: "#22c55e", Trending: "#f59e0b", Sale: "#ef4444", Hot: "#f97316",
  };

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");
  };

  return (
    <>
      <style>{`
        /* Card hover */
        .dk-card { transition: transform .25s ease, box-shadow .25s ease; border-radius: 16px; }
        .dk-card:hover { transform: translateY(-7px); box-shadow: 0 20px 50px rgba(0,0,0,.15) !important; }
        .dk-card:hover .prod-img { transform: scale(1.06); }
        .prod-img { transition: transform .4s ease; width: 100%; height: 100%; object-fit: contain; }

        /* Category hover */
        .dk-cat { transition: transform .3s ease, box-shadow .3s ease; cursor: pointer; border-radius: 16px !important; overflow: hidden; }
        .dk-cat:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.18) !important; }
        .dk-cat:hover .cat-img { transform: scale(1.07); }
        .cat-img { transition: transform .4s ease; width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Wishlist btn */
        .wish-btn { transition: transform .2s ease; cursor: pointer; }
        .wish-btn:hover { transform: scale(1.25) !important; }

        /* Toast */
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .ak-toast { animation: slideIn .3s ease; }

        /* Hero badge pulse */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.7} }
        .hero-badge { animation: pulse 2.5s infinite; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div className="ak-toast" style={{
          position: "fixed", top: 76, right: 24, zIndex: 9999,
          background: "#1a1a1a", color: "#fff",
          padding: "12px 22px", borderRadius: 10, fontSize: 14,
          boxShadow: "0 8px 28px rgba(0,0,0,.3)", display: "flex", alignItems: "center", gap: 8
        }}>
          ✓ {toast}
        </div>
      )}

      <div className="container-fluid p-0" style={{ background: "#f5f5f5" }}>

        {/* ══ HERO ═══════════════════════════════════════════════════ */}
        <div style={{ background: "linear-gradient(135deg, #000000, #2a2a2a)", padding: "72px 24px" }}>
          <div className="container">
            <div className="row align-items-center g-4">

              {/* Left: Text */}
              <div className="col-lg-6 col-md-12 text-center text-lg-start">
                <span className="hero-badge" style={{
                  display: "inline-block", background: "#FFD700", color: "#1a1a1a",
                  padding: "4px 16px", borderRadius: 4, fontSize: 11,
                  fontWeight: 800, letterSpacing: 2, marginBottom: 20
                }}>NEW COLLECTION 2026</span>

                <h1 className="fw-bold text-white mb-3"
                  style={{ fontSize: "clamp(40px,6vw,68px)", letterSpacing: "-1.5px", lineHeight: 1.08 }}>
                  JUST DO IT.
                </h1>
                <p className="mb-4" style={{ color: "#aaa", fontSize: 17, lineHeight: 1.75 }}>
                  Discover the latest Cloth and Accessories Collection for Men, Women & Kids.<br />
                  Best quality. Unbeatable prices.
                </p>

                <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                  <Link to="/category/featured">
                    <button className="btn btn-light btn-lg px-4 fw-bold" style={{ borderRadius: 8 }}>
                      Shop Now
                    </button>
                  </Link>
                  <Link to="/category/men">
                    <button className="btn btn-outline-light btn-lg px-4" style={{ borderRadius: 8 }}>
                      New Arrivals →
                    </button>
                  </Link>
                </div>

                {/* Trust icons */}
                <div className="d-flex gap-4 mt-4 justify-content-center justify-content-lg-start flex-wrap">
                  {[["🚚","Free Delivery"],["↩️","Easy Returns"],["🔒","Secure Pay"]].map(([icon,lbl]) => (
                    <div key={lbl} style={{ color: "#777", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                      <span>{icon}</span><span>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Image */}
              <div className="col-lg-6 col-md-12 text-center">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <div style={{
                    borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,.55)",
                    border: "3px solid rgba(255,255,255,.08)",
                    maxWidth: 320
                  }}>
                    <img
                      src="http://localhost:5000/images/men/Men_1.png"
                      alt="Nike"
                      style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
                    />
                  </div>
                  {/* Floating badge */}
                  <div style={{
                    position: "absolute", top: -14, right: -14,
                    background: "#FFD700", color: "#1a1a1a",
                    padding: "9px 15px", borderRadius: 10,
                    fontSize: 13, fontWeight: 800,
                    boxShadow: "0 4px 16px rgba(0,0,0,.2)"
                  }}>Up to 40% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ANNOUNCEMENT BAR ── */}
        <div style={{
          background: "#FFD700", padding: "11px 24px",
          textAlign: "center", fontSize: 14, fontWeight: 700, color: "#1a1a1a"
        }}>
          🎉 FREE DELIVERY on orders above ₹999 &nbsp;|&nbsp;
          Code <strong>AKSOM10</strong> for extra 10% off &nbsp;|&nbsp;
          New arrivals every week!
        </div>

        {/* ══ SHOP BY CATEGORY ═══════════════════════════════════════ */}
        <div className="container mt-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1">Shop By Category</h2>
            <p className="text-muted">Find the perfect style for every occasion</p>
          </div>

          <div className="row g-4">
            {categories.map((cat, i) => (
              <div className="col-md-3 col-sm-6" key={i}>
                <div className="card border-0 shadow dk-cat h-100"
                  onClick={() => navigate(`/category/${cat.type}`)}>

                  <div style={{ height: 220, position: "relative", overflow: "hidden" }}>
                    <img
                      className="cat-img"
                      src={`http://localhost:5000${cat.img}`}
                      alt={cat.title}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%)"
                    }} />
                    <h5 className="fw-bold text-white"
                      style={{ position: "absolute", bottom: 14, left: 16, margin: 0, fontSize: 18 }}>
                      {cat.title}
                    </h5>
                  </div>

                  <div className="card-body text-center py-2">
                    <Link to={`/category/${cat.type}`}>
                      <button className="btn btn-dark btn-sm w-100 fw-bold">
                        Explore {cat.title} →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FEATURED PRODUCTS ══════════════════════════════════════ */}
        <div className="container mt-5 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1">Featured Shoes</h2>
              <p className="text-muted mb-0">Handpicked styles just for you</p>
            </div>
            <Link to="/category/featured" style={{
              color: "#1a1a1a", fontWeight: 700, fontSize: 14,
              textDecoration: "none", border: "1.5px solid #1a1a1a",
              padding: "8px 18px", borderRadius: 24
            }}>View All →</Link>
          </div>

          <div className="row g-4">
            {featuredShoes.map((shoe) => (
              <div className="col-md-3 col-sm-6" key={shoe.id}>
                <div className="card border-0 shadow dk-card h-100">

                  {/* Image section */}
                  <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#f9f9f9", padding: 12 }}>
                    {/* Tag */}
                    <span style={{
                      position: "absolute", top: 12, left: 12,
                      background: tagColors[shoe.tag] || "#333",
                      color: "#fff", padding: "3px 12px", borderRadius: 20,
                      fontSize: 11, fontWeight: 700, zIndex: 2
                    }}>{shoe.tag}</span>

                    {/* Wishlist */}
                    <button className="wish-btn border-0 bg-white rounded-circle"
                      onClick={() => toggleWishlist(shoe.id)}
                      style={{
                        position: "absolute", top: 10, right: 10, width: 36, height: 36,
                        fontSize: 17, zIndex: 2, display: "flex", alignItems: "center",
                        justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)"
                      }}>
                      {wishlist.includes(shoe.id) ? "❤️" : "🤍"}
                    </button>

                    {/* Discount */}
                    <div style={{
                      position: "absolute", bottom: 10, left: 10,
                      background: "#1a1a1a", color: "#FFD700",
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700
                    }}>
                      {Math.round((1 - shoe.price / shoe.oldPrice) * 100)}% OFF
                    </div>

                    <img src={shoe.image} className="prod-img" alt={shoe.name} />
                  </div>

                  {/* Info */}
                  <div className="card-body text-center px-3 pb-3">
                    <h6 className="fw-bold mb-1">{shoe.name}</h6>

                    {/* Rating */}
                    <div className="mb-2" style={{ color: "#FFD700", fontSize: 13 }}>
                      {renderStars(shoe.rating)}
                      <span style={{ color: "#999", fontSize: 12, marginLeft: 4 }}>({shoe.rating})</span>
                    </div>

                    {/* Price */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                      <span className="fw-bold" style={{ fontSize: 18 }}>
                        ₹{shoe.price.toLocaleString()}
                      </span>
                      <span style={{ textDecoration: "line-through", color: "#bbb", fontSize: 13 }}>
                        ₹{shoe.oldPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-dark btn-sm flex-fill fw-bold"
                        onClick={() => showToast(`${shoe.name} added to cart! 🛍️`)}>
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-warning btn-sm flex-fill fw-bold"
                        onClick={() => navigate("/cart")}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES STRIP ── */}
        <div style={{ background: "#1a1a1a", padding: "48px 24px" }}>
          <div className="container">
            <div className="row g-4 text-center text-white">
              {[
                ["🚚","Free Shipping","On orders above ₹999"],
                ["↩️","30-Day Returns","Hassle-free policy"],
                ["🔒","Secure Payment","100% encrypted"],
                ["⭐","Premium Quality","Certified products"],
                ["📦","Fast Delivery","2–3 business days"],
              ].map(([icon, title, desc]) => (
                <div className="col-md-2 col-4" key={title}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: 13 }}>{title}</h6>
                  <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div style={{ background: "#FFD700", padding: "52px 24px", textAlign: "center" }}>
          <h2 className="fw-bold mb-2" style={{ color: "#1a1a1a" }}>Stay in the Loop</h2>
          <p style={{ color: "#555", marginBottom: 24, fontSize: 15 }}>
            Exclusive deals & new arrivals straight to your inbox.
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <input
              placeholder="Enter your email address"
              className="form-control"
              style={{ maxWidth: 300, borderRadius: 8, border: "none" }}
            />
            <button
              className="btn btn-dark fw-bold"
              style={{ borderRadius: 8, padding: "10px 24px" }}
              onClick={() => showToast("Subscribed! Welcome to AKSom ✓")}>
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </>
  );
}