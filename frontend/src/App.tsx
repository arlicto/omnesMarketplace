import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import Home from './pages/Home';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Browse from './pages/Browse';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Negotiations from './pages/Negotiations';
import Notifications from './pages/Notifications';
import Product from './pages/Product';
import Register from './pages/Register';
import Seller from './pages/Seller';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/negotiations" element={<Negotiations />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/product" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
