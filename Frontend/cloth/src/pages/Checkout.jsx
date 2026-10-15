import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const BASE = "http://localhost:5000";

// Generate PDF Bill using jsPDF
const generateBill = (order, items, total, address, method) => {
  // Dynamically load jsPDF
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  script.onload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const gold   = [255, 215, 0];
    const dark   = [26,  26,  26];
    const gray   = [100, 100, 100];
    const light  = [245, 245, 245];

    // Header background
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 40, "F");

    // Brand name
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("AKSom", 14, 20);
    doc.setTextColor(...gold);
    doc.text("Cloths", 44, 20);

    // Invoice label
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "normal");
    doc.text("TAX INVOICE", 14, 30);

    // Order info - right side
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Order ID: #${order}`, 140, 16);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, 24);
    doc.setTextColor(...gold);
    doc.text(`Payment: ${method === "cod" ? "Cash on Delivery" : method === "upi" ? "UPI" : "Card"}`, 140, 32);

    // Delivery Address
    doc.setFillColor(...light);
    doc.rect(14, 48, 85, 40, "F");
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DELIVERY ADDRESS", 18, 57);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(address.name || "", 18, 65);
    doc.text(address.phone || "", 18, 72);
    doc.text(`${address.street || ""}`, 18, 79);
    doc.text(`${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`, 18, 86);

    // Store info
    doc.setFillColor(...light);
    doc.rect(110, 48, 85, 40, "F");
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("FROM", 114, 57);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("AKSom Cloths", 114, 65);
    doc.text("support@aksomcloths.com", 114, 72);
    doc.text("+91 98765 43210", 114, 79);
    doc.text("Pune, Maharashtra", 114, 86);

    // Items table header
    doc.setFillColor(...dark);
    doc.rect(14, 96, 182, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("#",   18,  103);
    doc.text("Product",  28,  103);
    doc.text("Qty",     130, 103);
    doc.text("Price",   148, 103);
    doc.text("Total",   170, 103);

    // Items rows
    let y = 113;
    items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(14, y - 6, 182, 10, "F");
      }
      doc.setTextColor(...dark);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${i + 1}`, 18, y);
      // Truncate long names
      const name = item.name.length > 30 ? item.name.substring(0, 30) + "..." : item.name;
      doc.text(name, 28, y);
      doc.text(`${item.quantity}`, 132, y);
      doc.text(`Rs.${Number(item.price).toLocaleString("en-IN")}`, 145, y);
      doc.text(`Rs.${(item.price * item.quantity).toLocaleString("en-IN")}`, 167, y);
      y += 12;
    });

    // Totals section
    y += 4;
    doc.setDrawColor(230, 230, 230);
    doc.line(14, y, 196, y);
    y += 8;

    const shipping = total > 999 ? 0 : 99;
    const subtotal = total - shipping;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text("Subtotal:", 140, y);
    doc.setTextColor(...dark);
    doc.text(`Rs.${subtotal.toLocaleString("en-IN")}`, 167, y);
    y += 8;

    doc.setTextColor(...gray);
    doc.text("Shipping:", 140, y);
    doc.setTextColor(shipping === 0 ? [34, 197, 94] : dark);
    doc.text(shipping === 0 ? "FREE" : `Rs.${shipping}`, 167, y);
    y += 8;

    // Total box
    doc.setFillColor(...gold);
    doc.rect(130, y - 2, 66, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...dark);
    doc.text("TOTAL:", 134, y + 7);
    doc.text(`Rs.${total.toLocaleString("en-IN")}`, 163, y + 7);

    // Footer
    y += 28;
    doc.setFillColor(...dark);
    doc.rect(0, y, 210, 25, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text("Thank you for shopping with AKSom Cloths!", 14, y + 10);
    doc.setTextColor(...gold);
    doc.text("www.aksomcloths.com  |  support@aksomcloths.com", 14, y + 18);

    // Save PDF
    doc.save(`AKSom_Invoice_${order}.pdf`);
  };
  document.head.appendChild(script);
};

export default function Checkout() {
  const { cartItems, cartTotal, placeOrder } = useContext(CartContext);
  const navigate = useNavigate();

  const [step,   setStep]   = useState(1); // 1=Address, 2=Payment, 3=Success
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name:    "",
    phone:   "",
    pincode: "",
    city:    "",
    state:   "",
    street:  "",
  });

  const [card, setCard] = useState({
    number: "",
    name:   "",
    expiry: "",
    cvv:    "",
  });

  const [upi, setUpi] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [cartItemsSnapshot, setCartItemsSnapshot] = useState([]); // Save items before cart clears

  const shipping = cartTotal > 999 ? 0 : 99;
  const total    = cartTotal + shipping;

  // Validate address
  const isAddressValid = () =>
    address.name && address.phone && address.pincode &&
    address.city && address.state && address.street;

  // Handle place order
  const handlePlaceOrder = () => {
    setLoading(true);
    setCartItemsSnapshot([...cartItems]); // Save items before clearing
    setTimeout(() => {
      const id = placeOrder({ paymentMethod: method, address });
      setOrderId(id);
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  // Empty cart
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 56 }}>🛒</div>
        <h4 style={{ fontWeight: 800 }}>Cart empty!</h4>
        <Link to="/" style={{ background: "#FFD700", color: "#1a1a1a", textDecoration: "none", borderRadius: 10, padding: "10px 28px", fontWeight: 800 }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ck-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e0e0e0; border-radius: 10px;
          font-size: 14px; outline: none; transition: border-color .2s;
          background: #fafafa;
        }
        .ck-input:focus { border-color: #FFD700; background: #fff; }
        .ck-label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; display: block; }
        .pay-card {
          border: 2px solid #e0e0e0; border-radius: 14px;
          padding: 16px 20px; cursor: pointer;
          transition: border-color .2s, background .2s;
          display: flex; align-items: center; gap: 14px;
        }
        .pay-card.active { border-color: #FFD700; background: #fffdf0; }
        .pay-card:hover { border-color: #FFD700; }
        .step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 13px;
        }
        .place-btn {
          width: 100%; background: #FFD700; border: none;
          border-radius: 12px; padding: 14px;
          font-weight: 900; font-size: 16px; cursor: pointer;
          transition: background .2s, transform .15s;
        }
        .place-btn:hover { background: #f0c800; transform: scale(1.01); }
        .place-btn:disabled { background: #ddd; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "32px 16px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontWeight: 900, color: "#1a1a1a", marginBottom: 4 }}>
              {step === 3 ? "🎉 Order Placed!" : "Checkout"}
            </h2>

            {/* Step indicator */}
            {step !== 3 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                {["Delivery Address", "Payment", "Confirm"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="step-dot"
                      style={{ background: step > i ? "#FFD700" : step === i + 1 ? "#1a1a1a" : "#e0e0e0", color: step === i + 1 ? "#fff" : "#1a1a1a" }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? "#1a1a1a" : "#aaa" }}>{s}</span>
                    {i < 2 && <span style={{ color: "#ddd", fontSize: 18 }}>›</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══ SUCCESS STEP ══ */}
          {step === 3 && (
            <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>Order Confirmed!</h3>
              <p style={{ color: "#888", marginBottom: 8 }}>Order ID: <strong style={{ color: "#1a1a1a" }}>#{orderId}</strong></p>
              <p style={{ color: "#888", marginBottom: 24 }}>Your order has been successfully placed!</p>
              <div style={{ background: "#f9f9f9", borderRadius: 14, padding: 20, marginBottom: 24, textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 14 }}><strong>Payment:</strong> {method === "cod" ? "Cash on Delivery" : method === "upi" ? "UPI" : "Card"}</p>
                <p style={{ margin: "6px 0 0", fontSize: 14 }}><strong>Amount:</strong> ₹{total.toLocaleString()}</p>
                <p style={{ margin: "6px 0 0", fontSize: 14 }}><strong>Address:</strong> {address.street}, {address.city}</p>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => generateBill(orderId, cartItemsSnapshot, total, address, method)}
                  style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>
                  📄 Download Bill
                </button>
                <Link to="/" style={{ background: "#FFD700", color: "#1a1a1a", textDecoration: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800 }}>
                  Continue Shopping
                </Link>
                <Link to="/orders" style={{ background: "#1a1a1a", color: "#fff", textDecoration: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800 }}>
                  View Orders
                </Link>
              </div>
            </div>
          )}

          {step !== 3 && (
            <div className="row g-4">

              {/* ── LEFT SIDE ── */}
              <div className="col-lg-8">

                {/* ══ STEP 1 — Address ══ */}
                {step === 1 && (
                  <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
                    <h5 style={{ fontWeight: 800, marginBottom: 24 }}>📦 Delivery Address</h5>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="ck-label">Full Name *</label>
                        <input className="ck-input" placeholder="Your Full Name" value={address.name}
                          onChange={e => setAddress(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="ck-label">Phone Number *</label>
                        <input className="ck-input" placeholder="10 digit number" type="tel" maxLength={10}
                          value={address.phone} onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="col-12">
                        <label className="ck-label">Street Address *</label>
                        <input className="ck-input" placeholder="House no, Street, Area" value={address.street}
                          onChange={e => setAddress(p => ({ ...p, street: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="ck-label">Pincode *</label>
                        <input className="ck-input" placeholder="411001" maxLength={6} value={address.pincode}
                          onChange={e => setAddress(p => ({ ...p, pincode: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="ck-label">City *</label>
                        <input className="ck-input" placeholder="Pune" value={address.city}
                          onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="ck-label">State *</label>
                        <input className="ck-input" placeholder="Maharashtra" value={address.state}
                          onChange={e => setAddress(p => ({ ...p, state: e.target.value }))} />
                      </div>
                    </div>

                    <button className="place-btn" style={{ marginTop: 24 }}
                      disabled={!isAddressValid()}
                      onClick={() => setStep(2)}>
                      Continue to Payment →
                    </button>
                  </div>
                )}

                {/* ══ STEP 2 — Payment ══ */}
                {step === 2 && (
                  <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,.07)" }}>
                    <h5 style={{ fontWeight: 800, marginBottom: 24 }}>💳 Payment Method</h5>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>

                      {/* COD */}
                      <div className={`pay-card ${method === "cod" ? "active" : ""}`}
                        onClick={() => setMethod("cod")}>
                        <span style={{ fontSize: 28 }}>💰</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>Cash on Delivery</div>
                          <div style={{ color: "#888", fontSize: 13 }}>Delivery at the time of delivery</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: method === "cod" ? "#FFD700" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {method === "cod" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFD700" }} />}
                          </div>
                        </div>
                      </div>

                      {/* UPI */}
                      <div className={`pay-card ${method === "upi" ? "active" : ""}`}
                        onClick={() => setMethod("upi")}>
                        <span style={{ fontSize: 28 }}>📱</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>UPI Payment</div>
                          <div style={{ color: "#888", fontSize: 13 }}>GPay, PhonePe, Paytm, BHIM</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: method === "upi" ? "#FFD700" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {method === "upi" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFD700" }} />}
                          </div>
                        </div>
                      </div>

                      {/* Card */}
                      <div className={`pay-card ${method === "card" ? "active" : ""}`}
                        onClick={() => setMethod("card")}>
                        <span style={{ fontSize: 28 }}>💳</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>Credit / Debit Card</div>
                          <div style={{ color: "#888", fontSize: 13 }}>Visa, Mastercard, RuPay</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: method === "card" ? "#FFD700" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {method === "card" && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFD700" }} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UPI Input */}
                    {method === "upi" && (
                      <div style={{ background: "#f9f9f9", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                        <label className="ck-label">UPI ID</label>
                        <input className="ck-input" placeholder="name@upi" value={upi}
                          onChange={e => setUpi(e.target.value)} />
                        <p style={{ color: "#888", fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                          Example: 9876543210@okaxis, name@ybl
                        </p>
                      </div>
                    )}

                    {/* Card Input */}
                    {method === "card" && (
                      <div style={{ background: "#f9f9f9", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="ck-label">Card Number</label>
                            <input className="ck-input" placeholder="1234 5678 9012 3456" maxLength={19}
                              value={card.number} onChange={e => setCard(p => ({ ...p, number: e.target.value }))} />
                          </div>
                          <div className="col-12">
                            <label className="ck-label">Name on Card</label>
                            <input className="ck-input" placeholder="RAHUL SHARMA"
                              value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div className="col-6">
                            <label className="ck-label">Expiry Date</label>
                            <input className="ck-input" placeholder="MM/YY" maxLength={5}
                              value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: e.target.value }))} />
                          </div>
                          <div className="col-6">
                            <label className="ck-label">CVV</label>
                            <input className="ck-input" placeholder="***" maxLength={3} type="password"
                              value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => setStep(1)}
                        style={{ background: "#f0f0f0", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 700, cursor: "pointer" }}>
                        ← Back
                      </button>
                      <button className="place-btn" style={{ flex: 1 }}
                        disabled={loading}
                        onClick={handlePlaceOrder}>
                        {loading ? "Processing... ⏳" : `Place Order ₹${total.toLocaleString()}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT SIDE — Order Summary ── */}
              <div className="col-lg-4">
                <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,.07)", position: "sticky", top: 80 }}>
                  <h6 style={{ fontWeight: 800, marginBottom: 16 }}>Order Summary ({cartItems.length} items)</h6>

                  {/* Items */}
                  <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
                    {cartItems.map(item => (
                      <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                        <img src={`${BASE}${item.image}`} alt={item.name}
                          style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, background: "#f9f9f9", padding: 4 }}
                          onError={e => { e.target.src = "https://via.placeholder.com/52x52?text=?"; }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ margin: 0, color: "#888", fontSize: 12 }}>Qty: {item.quantity}</p>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8, color: "#555" }}>
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8, color: "#555" }}>
                      <span>Shipping</span>
                      <span style={{ color: shipping === 0 ? "#22c55e" : "#1a1a1a" }}>
                        {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p style={{ color: "#22c55e", fontSize: 12, margin: "0 0 8px" }}>✓ ₹999  — Free Shipping!</p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 900, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                      <span>Total</span>
                      <span style={{ color: "#FFD700" }}>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}