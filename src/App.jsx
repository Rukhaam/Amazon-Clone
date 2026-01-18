import React from "react";
import Header from "../components/header/header.component";
import Footer from "../components/footer/footer.component";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "../pages/home.pages";

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
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* FIX: Add this line. 'index' tells the router to load Banner 
            when the path is exactly "/" */}
        <Route index element={<Home />} />
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