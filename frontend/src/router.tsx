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
import { useAuthStore } from './store/authStore';

export const RouterWrapper = () => {
  const { isAuthenticated, user } = useAuthStore();
  const userRole = user?.role || 'buyer';

  return createBrowserRouter([
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
    // Protected Routes
    {
      element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
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
    // Admin Protected Routes
    {
      element: (
        <ProtectedRoute 
          isAuthenticated={isAuthenticated} 
          isAdmin={userRole === 'admin'} 
          requiredAdmin={true} 
        />
      ),
      children: [
        {
          path: '/admin',
          element: <Admin />,
        },
      ],
    },
  ]);
};

// Exporting a static router for initial load, but it won't react to state changes well without RouterProvider update
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
  {
    element: <ProtectedRoute isAuthenticated={false} />,
    children: [
      { path: '/checkout', element: <Checkout /> },
      { path: '/account', element: <BuyerAccount /> },
    ],
  },
  {
    element: <ProtectedRoute isAuthenticated={false} requiredAdmin={true} />,
    children: [
      { path: '/admin', element: <Admin /> },
    ],
  },
]);
