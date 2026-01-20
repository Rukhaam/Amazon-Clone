import React, { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom"; // 1. Changed to URL params
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { selectFilter } from "../redux/filter/filterSlice"; 
import { applyFilterAndSort } from "../redux/filter/filter.utils"; 
import { ProductsContext } from "../src/context/products.context"; // 2. Import Context
import StarIcon from "@mui/icons-material/Star";
import FilterSidebar from "../components/filter/filter.componet"; 

const SearchResults = () => {
  const dispatch = useDispatch();
  const { products, loading } = useContext(ProductsContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); 

  const filters = useSelector(selectFilter); 
  const [finalProducts, setFinalProducts] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      let results = products;
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = products.filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          const catMatch = item.category.toLowerCase().includes(lowerQuery);
          return titleMatch || catMatch;
        });
      }
      const fullyFiltered = applyFilterAndSort(results, filters);
      
      setFinalProducts(fullyFiltered);
    }
  }, [query, products, filters]);

  // Helper for stars
  const renderStars = (rate) => {
     const roundedRate = Math.round(rate || 0);
     return [...Array(5)].map((_, i) => (
      <StarIcon 
        key={i} 
        className={i < roundedRate ? "text-[#F4A41C]" : "text-gray-300"} 
        fontSize="small" 
      />
    ));
  };

  // 4. Loading State (Keeps the layout stable)
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-blue"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen font-bodyFont">
      <div className="max-w-[1500px] mx-auto flex">
        
        {/* Sidebar (Kept exactly as requested) */}
        <div className="w-[20%] min-w-[220px] hidden md:block border-r border-gray-200">
             <FilterSidebar />
        </div>

        {/* Results Area */}
        <div className="w-full md:w-[80%] p-4">
            <div className="border-b border-gray-200 pb-4 mb-4">
                <h1 className="text-xl font-bold">
                    Results for <span className="text-[#c7511f]">"{query}"</span>
                </h1>
                <span className="text-sm text-gray-600">
                    {finalProducts.length} items found
                </span>
            </div>

            <div className="flex flex-col gap-2">
                {finalProducts.length > 0 ? (
                    finalProducts.map((item) => (
                        <div key={item.id} className="w-full border border-gray-200 rounded-lg flex flex-col md:flex-row gap-4 p-4 hover:bg-gray-50 transition-colors">
                            {/* Image Section */}
                            <Link to={`/product/${item.id}`} className="w-full md:w-64 flex justify-center items-center bg-gray-100 rounded-md flex-shrink-0">
                                <img className="h-44 object-contain mix-blend-multiply p-2 hover:scale-105 duration-300" src={item.image} alt={item.title} />
                            </Link>
                            
                            {/* Details Section */}
                            <div className="flex-grow flex flex-col gap-1">
                                <Link to={`/product/${item.id}`}>
                                    <h2 className="text-lg font-medium hover:text-[#c7511f] hover:underline cursor-pointer line-clamp-2">
                                        {item.title}
                                    </h2>
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-500">{renderStars(item.rating?.rate)}</div>
                                    <span className="text-blue-600 text-sm hover:underline cursor-pointer">
                                        {item.rating?.count || 0}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-start">
                                    <span className="text-xs pt-1">$</span>
                                    <span className="text-2xl font-bold">{Math.floor(item.price)}</span>
                                    <span className="text-xs pt-1">{(item.price % 1).toFixed(2).substring(1)}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-2 max-w-2xl">
                                    {item.description}
                                </p>
                            </div>

                            {/* Buy Box Section */}
                            <div className="w-full md:w-48 flex flex-col gap-3 justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6">
                                <button 
                                    onClick={() => dispatch(addToCart({...item, quantity: 1}))}
                                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1.5 rounded-full text-sm font-normal shadow-sm border border-[#FCD200] active:border-[#FCD200] cursor-pointer"
                                >
                                    Add to Cart
                                </button>
                                <Link to={`/product/${item.id}`}>
                                     <button className="w-full bg-white hover:bg-gray-100 text-black py-1.5 rounded-full text-sm font-normal shadow-sm border border-gray-300 cursor-pointer">
                                        View Details
                                     </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold">No results found.</h2>
                        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                        <Link to="/">
                            <button className="mt-4 bg-yellow-400 px-6 py-2 rounded-md font-medium hover:bg-yellow-500">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;