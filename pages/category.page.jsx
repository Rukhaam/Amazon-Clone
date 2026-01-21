import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductsContext } from "../src/context/products.context";
import StarIcon from "@mui/icons-material/Star";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { selectFilter } from "../redux/filter/filterSlice";
import { applyFilterAndSort } from "../redux/filter/filter.utils";
import FilterSidebar from "../components/filter/filter.componet";

const CategoryPage = () => {
  const { category } = useParams();
  const { products } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();

  const filters = useSelector(selectFilter);

  useEffect(() => {
    if (products) {
      let categoryProducts = products;
      if (category !== "all") {
        categoryProducts = products.filter((item) => item.category === category);
      }
      const finalResult = applyFilterAndSort(categoryProducts, filters);
      setFilteredProducts(finalResult);
    }
  }, [category, products, filters]);

  const renderStars = (rate) => {
    const stars = [];
    const roundedRate = Math.round(rate || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={i < roundedRate ? "text-[#F4A41C]" : "text-gray-300"}
          fontSize="small"
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full bg-white min-h-screen font-bodyFont">
      <div className="max-w-[1500px] mx-auto p-4">
        
        {/* === HEADER === */}
        <div className="border-b border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold capitalize text-black">
              {category === "all" ? "All Products" : category}
            </h1>
            <span className="text-sm text-gray-600">
              {filteredProducts.length} results
            </span>
        </div>

        {/* === TOP FILTER BAR === */}
        <FilterSidebar />

        {/* === PRODUCT LIST === */}
        <div className="w-full flex flex-col gap-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                // === SOLD OUT CHECK ===
                // If quantity is 0 or less, it is sold out.
                // We assume undefined means "in stock" to be safe, or you can default to 0.
                const isSoldOut = item.quantity !== undefined && item.quantity <= 0;

                return (
                  <div
                    key={item.id}
                    className="w-full border border-gray-200 rounded-lg flex flex-col md:flex-row gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="w-full md:w-64 bg-gray-100 h-64 md:h-52 flex items-center justify-center rounded-md overflow-hidden flex-shrink-0 relative"
                    >
                      {/* GREYSCALE IMAGE IF SOLD OUT */}
                      <img
                        className={`h-full w-full object-contain p-4 mix-blend-multiply ${
                           isSoldOut ? "grayscale opacity-60" : "hover:scale-105 duration-300"
                        }`}
                        src={item.image}
                        alt={item.title}
                      />
                      
                      {/* SOLD OUT BADGE */}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded shadow-md">
                                SOLD OUT
                            </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-grow flex flex-col gap-1">
                      <Link to={`/product/${item.id}`}>
                        <h2 className="text-lg md:text-xl font-medium text-black hover:text-[#c7511f] hover:underline cursor-pointer line-clamp-2">
                          {item.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-500">
                          {renderStars(item.rating?.rate)}
                        </div>
                        <span className="text-[#007185] text-sm hover:text-[#c7511f] hover:underline cursor-pointer font-medium">
                          {item.rating?.count || 0}
                        </span>
                      </div>
                      <div className="mt-2">
                          <Link to={`/product/${item.id}`} className="flex items-start">
                          <span className="text-xs pt-[2px] font-normal">$</span>
                          <span className="text-2xl font-medium px-0.5 -mt-1">{Math.floor(item.price)}</span>
                          <span className="text-xs pt-[2px] font-normal">{(item.price % 1).toFixed(2).substring(1)}</span>
                          </Link>
                      </div>
                      
                      {/* AVAILABILITY TEXT */}
                      <div className="text-sm mt-1">
                        {isSoldOut ? (
                            <span className="text-red-600 font-bold">Currently unavailable.</span>
                        ) : (
                            <span className="text-gray-600">Get it by <span className="font-bold text-gray-800">Tuesday, Aug 25</span></span>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-48 flex flex-col gap-3 justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6">
                      
                      {/* DISABLE BUTTON IF SOLD OUT */}
                      {isSoldOut ? (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-1.5 rounded-full text-sm font-bold cursor-not-allowed border border-gray-300"
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <button
                          onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                          className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1.5 rounded-full text-sm font-normal shadow-sm border border-[#FCD200] active:border-[#FCD200] cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )}

                      <Link to={`/product/${item.id}`}>
                          <button className="w-full bg-white hover:bg-gray-100 text-black py-1.5 rounded-full text-sm font-normal shadow-sm border border-gray-300 cursor-pointer">
                             View Details
                          </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-lg text-gray-600">No products match your criteria.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;