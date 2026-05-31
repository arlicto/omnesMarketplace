import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import Home from './pages/Home';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Browse from './pages/Browse';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import MakeOffer from './pages/MakeOffer';
import Negotiations from './pages/Negotiations';
import Notifications from './pages/Notifications';
import PlaceBid from './pages/PlaceBid';
import Product from './pages/Product';
import ShopNow from './pages/ShopNow';
import Register from './pages/Register';
import Seller from './pages/Seller';
import SellerOnboarding from './pages/SellerOnboarding';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RoleProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  if (!authLoaded || !userLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.unsafeMetadata?.role as string | undefined;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/place-bid" element={<PlaceBid />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/make-offer" element={<MakeOffer />} />
        <Route path="/negotiations" element={<Negotiations />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/product" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop-now" element={<ShopNow />} />
        <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboarding /></ProtectedRoute>} />
        <Route path="/seller" element={<RoleProtectedRoute allowedRoles={['seller', 'admin']}><Seller /></RoleProtectedRoute>} />
        <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><Admin /></RoleProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

# 1780251488117855645
