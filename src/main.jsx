import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./context/auth.context.jsx"; // <--- Import this
import { ProductsProvider } from "./context/products.context.jsx";
import { OrdersProvider } from "./context/orders.context.jsx";
import { CheckoutProvider } from "./context/checkout.cotext.jsx";
import { CartProvider } from "./context/cart.context.jsx";
import { AdminProvider } from "./context/adminOrder.context.jsx";
import { ReviewsProvider } from "./context/reviewsContext.jsx";
import { WishlistProvider } from "./context/wishList.context.jsx";
import { AddressProvider } from "./context/adresses.context.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Wrap App with AuthProvider */}
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              <ReviewsProvider>
                <OrdersProvider>
                  <AddressProvider>
                    <CheckoutProvider>
                      <AdminProvider>
                        <WishlistProvider>
                          <App />
                        </WishlistProvider>
                      </AdminProvider>
                    </CheckoutProvider>
                  </AddressProvider>
                </OrdersProvider>
              </ReviewsProvider>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
