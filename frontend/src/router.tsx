import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Browse } from './pages/Browse';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { BuyerAccount } from './pages/BuyerAccount';
import { Notifications } from './pages/Notifications';
import { Negotiations } from './pages/Negotiations';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/browse',
    element: <Browse />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/negotiations',
    element: <Negotiations />,
  },
  // Protected Routes for Logged-In Users
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/account',
        element: <BuyerAccount />,
      },
    ],
  },
  // Protected Routes for Admins Only
  {
    element: <ProtectedRoute requiredAdmin={true} />,
    children: [
      {
        path: '/admin',
        element: <Admin />,
      },
    ],
  },
]);
