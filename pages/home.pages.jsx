import React from "react";
import Banner from "../components/home/banner.component"; // Check path
// import Products from "../components/home/products.component"; <--- REMOVE THIS
import CategoryFeed from "../components/home/categoryFeed.component"; // <--- ADD THIS

const Home = () => {
  return (
    <div className="font-bodyFont bg-gray-100 min-h-screen pb-10">
      <Banner />
      
      {/* Move the content up to overlap banner slightly (Amazon style) */}
      <div className="max-w-screen-2xl mx-auto -mt-10 md:-mt-32 relative z-10">
        <CategoryFeed />
      </div>
    </div>
  );
};

export default Home;