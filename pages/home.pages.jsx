import React from "react";
import Banner from "../components/home/banner.component";
import Products from "../components/home/products.component";

const Home = () => {
  return (
    <div className="font-bodyFont bg-gray-100"> {/* Added bg-gray-100 */}
      <Banner />
      <div className="-mt-20"> {/* Negative margin to pull products up into the banner area */}
        <Products />
      </div>
    </div>
  );
};

export default Home;