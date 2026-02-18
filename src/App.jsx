import React from "react";
import Header from "../components/header/header.component";
import Footer from "../components/footer/footer.component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";
import Home from "../pages/home.pages";
import CategoryPage from "../pages/category.page";
import ProductDetails from "../pages/productDetails.page";
import Cart from "../pages/cart.page";
import SearchResults from "../pages/search.page";
import SignIn from "../pages/signIn.page";
import Registration from "../pages/register.page";
import { useAuth } from "./context/useAuth";
import Checkout from "../pages/checkout.page";
import Orders from "../pages/orders.page";
import Wishlist from "../pages/wihslist.page";

// === ADMIN IMPORTS ===
import AdminRoute from "../components/admin/adminRoute.component";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddProduct from "../pages/admin/addProduct.page";
import AdminOrders from "../pages/admin/adminOrders.page";
import AdminProducts from "../pages/admin/adminProducts.page";
import AddressPage from "../pages/adress.page";
import ForgotPassword from "../components/forgetpassword/forgetPassword.component";

// 1. Create an Auth/Guest Route wrapper to redirect logged-in users away from SignIn/Registration
const GuestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 2. Layouts
const RootLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

const PublicLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

// 3. Define the Router OUTSIDE the App component so it doesn't get recreated on re-renders
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* === PUBLIC ROUTES === */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="addresses" element={<AddressPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* === ADMIN ROUTES === */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      >
        <Route index element={<h2 className="p-4">Welcome to Admin Dashboard</h2>} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>

      {/* === AUTH ROUTES === */}
      {/* Wrap them in GuestRoute instead of using ternary operators */}
      <Route
        path="/signin"
        element={
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        }
      />
      <Route
        path="/registration"
        element={
          <GuestRoute>
            <Registration />
          </GuestRoute>
        }
      />
    </Route>
  )
);

function App() {
  // App no longer needs to listen to useAuth() directly.
  return (
    <div className="font-sans">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;