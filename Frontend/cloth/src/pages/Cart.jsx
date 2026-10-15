import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    navigate("/checkout"); // Navigate to Checkout page
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Your Cart</h3>

      {cartItems.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map(item => (
              <div className="col-md-4 mb-4" key={item.id}>
                <div className="card shadow">
                  <img
                    src={`http://localhost:5000${item.image}`}
                    className="card-img-top p-3"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body text-center">
                    <h6>{item.name}</h6>
                    <p>₹{item.price * item.quantity}</p>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL SECTION */}
          <div className="text-end mt-4">
            <h4>Total: ₹{cartTotal}</h4>

            <button
              className="btn btn-success mt-2"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}