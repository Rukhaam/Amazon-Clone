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
} from "react-router-dom";
import Home from "../pages/home.pages";
import CategoryPage from "../pages/category.page";
import ProductDetails from "../pages/productDetails.page";
import Cart from "../pages/cart.page";
import SearchResults from "../pages/search.page";
import SignIn from "../pages/signIn.page";
import Registration from "../pages/register.page";
import { useAuth } from "./context/auth.context";
import Checkout from "../pages/checkout.page";
import Orders from "../pages/orders.page";

// === NEW ADMIN IMPORTS ===
import AdminRoute from "../components/admin/adminRoute.component";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddProduct from "../pages/admin/addProduct.page";
import AdminOrders from "../pages/admin/adminOrders.page";
import AdminProducts from "../pages/admin/adminProducts.page";
const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  const { currentUser } = useAuth();

  // NOTE: useCartSync() is removed because CartProvider in main.jsx now handles syncing.

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* === PUBLIC LAYOUT ROUTES === */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* === ADMIN ROUTES (Protected & Separate Layout) === */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          {/* Define sub-routes for the admin panel here */}
          <Route
            index
            element={<h2 className="p-4">Welcome to Admin Dashboard</h2>}
          />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* === AUTH ROUTES === */}
        <Route
          path="/signin"
          element={currentUser ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/registration"
          element={currentUser ? <Navigate to="/" replace /> : <Registration />}
        />
      </Route>
    )
  );

  return (
    <div className="font-sans">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
