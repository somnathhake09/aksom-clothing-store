import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart }             = useContext(CartContext);
  const navigate                  = useNavigate();
  const [wishlist,  setWishlist]  = useState(false);
  const [added,     setAdded]     = useState(false);
  const [quickView, setQuickView] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imgSrc = product.image
    ? `http://localhost:5000${product.image}`
    : "https://via.placeholder.com/200x200?text=No+Image";

  return (
    <>
      <style>{`
        .pk-card {
          border-radius: 16px !important;
          border: 1.5px solid #f0f0f0 !important;
          transition: transform .25s, box-shadow .25s, border-color .25s !important;
          overflow: hidden;
          background: #fff;
        }
        .pk-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 48px rgba(0,0,0,.13) !important;
          border-color: #FFD700 !important;
        }
        .pk-card:hover .pk-img { transform: scale(1.07); }
        .pk-img {
          transition: transform .4s ease;
          height: 200px; object-fit: contain;
          width: 100%; padding: 12px;
        }
        .pk-wish {
          position: absolute; top: 10px; right: 10px;
          width: 34px; height: 34px; border-radius: 50%;
          background: #fff; border: none; cursor: pointer;
          font-size: 16px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
          transition: transform .2s; z-index: 2;
        }
        .pk-wish:hover { transform: scale(1.25); }
        .pk-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(26,26,26,.85); padding: 10px;
          transform: translateY(100%);
          transition: transform .28s ease; z-index: 2;
        }
        .pk-card:hover .pk-overlay { transform: translateY(0); }
        .pk-qv {
          width: 100%; background: #FFD700; border: none;
          border-radius: 8px; padding: 8px;
          font-weight: 800; font-size: 13px; cursor: pointer;
        }
        .pk-modal-bg {
          position: fixed; inset: 0; background: rgba(0,0,0,.6);
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn .2s ease;
        }
        .pk-modal {
          background: #fff; border-radius: 20px;
          max-width: 500px; width: 100%; padding: 24px;
          position: relative; animation: slideUp .25s ease;
        }
        .pk-close {
          position: absolute; top: 12px; right: 12px;
          background: #f0f0f0; border: none; border-radius: 50%;
          width: 32px; height: 32px; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background .18s;
        }
        .pk-close:hover { background: #FFD700; }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* ── Card ── */}
      <div className="card shadow h-100 pk-card">

        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", background: "#f9f9f9" }}>

          {/* Featured badge */}
          {product.isFeatured === 1 && (
            <span style={{
              position: "absolute", top: 10, left: 10, zIndex: 2,
              background: "#FFD700", color: "#1a1a1a",
              padding: "3px 10px", borderRadius: 20,
              fontSize: 11, fontWeight: 800
            }}>⭐ Featured</span>
          )}

          {/* Wishlist */}
          <button className="pk-wish" onClick={() => setWishlist(p => !p)}>
            {wishlist ? "❤️" : "🤍"}
          </button>

          {/* Image */}
          <img
            className="card-img-top pk-img"
            src={imgSrc}
            alt={product.name}
            onError={e => { e.target.src = "https://via.placeholder.com/200x200?text=No+Image"; }}
          />

          {/* Quick View overlay */}
          <div className="pk-overlay">
            <button className="pk-qv" onClick={() => setQuickView(true)}>
              👁 Quick View
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body text-center px-3 pb-3">

          {/* Subcategory tag */}
          {product.subcategory && (
            <span style={{
              fontSize: 11, color: "#888", background: "#f4f4f4",
              padding: "2px 9px", borderRadius: 20,
              display: "inline-block", marginBottom: 6,
              textTransform: "capitalize"
            }}>{product.subcategory}</span>
          )}

          {/* Name */}
          <h6 className="fw-bold" style={{
            fontSize: 14, color: "#1a1a1a", marginBottom: 4,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
          }}>{product.name}</h6>

          {/* Description */}
          <p style={{
            fontSize: 12, color: "#aaa", marginBottom: 8, lineHeight: 1.5,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
          }}>{product.description}</p>

          {/* Price */}
          <p style={{ fontWeight: 900, fontSize: 18, color: "#1a1a1a", marginBottom: 12 }}>
            ₹{Number(product.price).toLocaleString()}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn w-100 fw-bold"
              style={{
                background: added ? "#22c55e" : "#1a1a1a",
                color: "#fff", borderRadius: 8,
                transition: "background .2s", fontSize: 13
              }}
              onClick={handleAddToCart}>
              {added ? "✓ Added!" : "Add to Cart"}
            </button>
            <button
              className="btn fw-bold"
              style={{
                background: "#FFD700", color: "#1a1a1a",
                borderRadius: 8, fontSize: 13, whiteSpace: "nowrap"
              }}
              onClick={() => { addToCart(product); navigate("/cart"); }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick View Modal ── */}
      {quickView && (
        <div className="pk-modal-bg" onClick={() => setQuickView(false)}>
          <div className="pk-modal" onClick={e => e.stopPropagation()}>
            <button className="pk-close" onClick={() => setQuickView(false)}>✕</button>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

              {/* Modal Image */}
              <div style={{
                flex: "0 0 180px", height: 180,
                background: "#f9f9f9", borderRadius: 12, overflow: "hidden"
              }}>
                <img src={imgSrc} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                  onError={e => { e.target.src = "https://via.placeholder.com/180x180?text=No+Image"; }}
                />
              </div>

              {/* Modal Details */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {product.isFeatured === 1 && (
                    <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>⭐ Featured</span>
                  )}
                  {product.subcategory && (
                    <span style={{ background: "#f4f4f4", color: "#666", padding: "2px 10px", borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{product.subcategory}</span>
                  )}
                  {product.category && (
                    <span style={{ background: "#1a1a1a", color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{product.category}</span>
                  )}
                </div>

                <h5 style={{ fontWeight: 800, color: "#1a1a1a", marginBottom: 8, fontSize: 16 }}>
                  {product.name}
                </h5>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                  {product.description}
                </p>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>
                  ₹{Number(product.price).toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{
                      flex: 1, background: added ? "#22c55e" : "#1a1a1a",
                      color: "#fff", border: "none", borderRadius: 10,
                      padding: "10px 0", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      transition: "background .2s"
                    }}
                    onClick={() => { handleAddToCart(); setQuickView(false); }}>
                    {added ? "✓ Added!" : "Add to Cart"}
                  </button>
                  <button
                    style={{
                      flex: 1, background: "#FFD700", color: "#1a1a1a",
                      border: "none", borderRadius: 10,
                      padding: "10px 0", fontWeight: 800, fontSize: 14, cursor: "pointer"
                    }}
                    onClick={() => { addToCart(product); navigate("/cart"); setQuickView(false); }}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}