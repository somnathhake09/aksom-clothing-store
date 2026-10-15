import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const BASE = "http://localhost:5000";

export default function OrderHistory() {
  const { orders }          = useContext(CartContext);
  const [expanded, setExpanded] = useState(null);

  const statusColor = {
    "Confirmed": "#22c55e",
    "Shipped":   "#3b82f6",
    "Delivered": "#FFD700",
    "Cancelled": "#ef4444",
  };

  const paymentIcon = {
    "cod":  "💰",
    "upi":  "📱",
    "card": "💳",
  };

  return (
    <>
      <style>{`
        .order-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #f0f0f0;
          transition: border-color .2s, box-shadow .2s;
          overflow: hidden;
        }
        .order-card:hover { border-color: #FFD700; box-shadow: 0 8px 28px rgba(0,0,0,.08); }
        .order-header {
          padding: 18px 20px; cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between; gap: 12;
          flex-wrap: wrap;
        }
        .order-header:hover { background: #fffdf0; }
      `}</style>

      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "32px 16px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>📦 My Orders</h2>
            <p style={{ color: "#888", fontSize: 14 }}>
              {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? "s" : ""} placed` : "अजून कोणताही order नाही"}
            </p>
          </div>

          {/* Empty state */}
          {orders.length === 0 && (
            <div style={{ background: "#fff", borderRadius: 20, padding: 60, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
              <h4 style={{ fontWeight: 800, marginBottom: 8 }}>No Orders Yet!</h4>
              <p style={{ color: "#888", marginBottom: 24 }}>अजून कोणतेही products order केले नाहीत.</p>
              <Link to="/" style={{
                background: "#FFD700", color: "#1a1a1a",
                textDecoration: "none", borderRadius: 10,
                padding: "12px 28px", fontWeight: 800
              }}>
                Start Shopping →
              </Link>
            </div>
          )}

          {/* Order list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map(order => (
              <div key={order.id} className="order-card">

                {/* Order Header */}
                <div className="order-header"
                  onClick={() => setExpanded(p => p === order.id ? null : order.id)}>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>
                      Order #{order.id}
                    </span>
                    <span style={{ color: "#888", fontSize: 13 }}>
                      📅 {order.date}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {/* Payment method */}
                    <span style={{ fontSize: 13, color: "#555" }}>
                      {paymentIcon[order.paymentMethod] || "💳"} {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "upi" ? "UPI" : "Card"}
                    </span>

                    {/* Total */}
                    <span style={{ fontWeight: 900, fontSize: 16, color: "#1a1a1a" }}>
                      ₹{order.total.toLocaleString()}
                    </span>

                    {/* Status badge */}
                    <span style={{
                      background: statusColor[order.status] + "22",
                      color: statusColor[order.status],
                      padding: "4px 12px", borderRadius: 20,
                      fontSize: 12, fontWeight: 700
                    }}>{order.status}</span>

                    {/* Expand arrow */}
                    <span style={{ color: "#aaa", transition: "transform .2s", transform: expanded === order.id ? "rotate(180deg)" : "none", display: "inline-block" }}>▼</span>
                  </div>
                </div>

                {/* Order Details — expanded */}
                {expanded === order.id && (
                  <div style={{ borderTop: "1px solid #f0f0f0", padding: "16px 20px" }}>

                    {/* Delivery Address */}
                    <div style={{ background: "#f9f9f9", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>📍 Delivery Address</p>
                      <p style={{ margin: 0, color: "#555", fontSize: 13 }}>
                        {order.address.name}, {order.address.phone}<br/>
                        {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                    </div>

                    {/* Items */}
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🛍️ Items ({order.items.length})</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <img src={`${BASE}${item.image}`} alt={item.name}
                            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, background: "#f0f0f0", padding: 4 }}
                            onError={e => { e.target.src = "https://via.placeholder.com/56x56?text=?"; }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                            <p style={{ margin: 0, color: "#888", fontSize: 12 }}>
                              Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                            </p>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 16, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>Total Amount</span>
                      <span style={{ fontWeight: 900, fontSize: 18, color: "#FFD700" }}>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Back to shopping */}
          {orders.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link to="/" style={{
                background: "#1a1a1a", color: "#fff",
                textDecoration: "none", borderRadius: 10,
                padding: "12px 28px", fontWeight: 800
              }}>
                Continue Shopping →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}