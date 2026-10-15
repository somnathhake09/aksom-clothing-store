import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";   // ← Home 
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory"; //  add 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import './App.css'
import Footer from "./components/Footer";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Navbar —  */}
      <Navbar />

      <Routes>

        {/* PUBLIC — login  */}
        <Route path="/"               element={<Dashboard />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/category/:type" element={<Category />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* PROTECTED — login */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />

            </ProtectedRoute>
          }
        />
<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <OrderHistory />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Footer />
    </>
  );
}