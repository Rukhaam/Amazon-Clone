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
import useCartSync from "./hooks/useCartSync";
import Checkout from "../pages/checkout.page";
import Orders from "../pages/orders.page";

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
  // 1. Get User from Context (Replaces Redux Selector)
  const { currentUser } = useAuth();

  // 2. Activate Firestore Cart Sync
  // This hook listens to the user & redux cart to sync them automatically
  useCartSync();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Dynamic Route for Categories */}
          <Route path="/category/:category" element={<CategoryPage />} />

          {/* Dynamic Route for Single Product */}
          <Route path="/product/:id" element={<ProductDetails />} />
          
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Protected Routes (Redirect if logged in) */}
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
