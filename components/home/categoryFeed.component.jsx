import React, { useContext } from "react";
import { ProductsContext } from "../../src/context/products.context";
import Products from "./products.component";
import { Link } from "react-router-dom";

const CategoryFeed = () => {
  const { products, categories } = useContext(ProductsContext);

  if (!categories || categories.length === 0) return null;

  return (
    // Wrapper: Pulls up over the banner (-mt-32) and stays on top (z-20)
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 -mt-16 md:-mt-32 relative z-20 mb-10">
      {/* Grid: 1 column on mobile, 4 columns on desktop (Amazon Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          // Get the single "Hero Image" for this category (Amazon usually shows 1 big image or a 2x2 grid)
          const categoryProduct = products.find(
            (item) => item.category === category
          );

          if (!categoryProduct) return null;

          return (
            <div
              key={category}
              className="bg-white p-5 flex flex-col justify-between h-[420px] shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-200"
            >
              <div>
                <h2 className="text-xl font-bold capitalize text-gray-900 mb-4">
                  {category}
                </h2>

                {/* Single Hero Image for the Category */}
                <Link
                  to={`/category/${category}`}
                  className="flex justify-center items-center h-[300px] overflow-hidden"
                >
                  <img
                    src={categoryProduct.image}
                    alt={category}
                    className="h-full w-full object-contain transform hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <Link
                to={`/category/${category}`}
                className="text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline mt-2 block"
              >
                See more
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFeed;
