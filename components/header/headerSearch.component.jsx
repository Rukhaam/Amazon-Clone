import React, { useState, useRef, useEffect, useContext } from "react";
import { Search, ArrowDropDownOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProductsContext } from "../../src/context/products.context"; 
import {
  updateSuggestions,
  clearSuggestions,
} from "../../redux/search/searchSlice";

const HeaderSearch = () => {
  const [showCategory, setShowCategory] = useState(false);
  const [inputText, setInputText] = useState("");
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, products } = useContext(ProductsContext);
  const suggestions = useSelector((state) => state.search.suggestions);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputText(query);
    if (query.length > 0) {
      dispatch(updateSuggestions({ products, query }));
    } else {
      dispatch(clearSuggestions());
    }
  };

  const handleSearch = (queryOverride) => {
    const query = typeof queryOverride === "string" ? queryOverride : inputText;
    if (query) {
      dispatch(clearSuggestions());
      setInputText(query);
      navigate(`/search?q=${query}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        dispatch(clearSuggestions());
        setShowCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  return (
    // Height: h-9 for mobile/tiny, h-10 for lg+
    <div ref={searchRef} className="h-9 lg:h-10 rounded-md flex flex-grow relative bg-white">
      
      {/* 1. Category Dropdown */}
      <div className="relative h-full flex items-center bg-gray-200 hover:bg-gray-300 rounded-l-md">
        <span
          onClick={() => setShowCategory(!showCategory)}
          className="px-1 sm:px-2 h-full cursor-pointer duration-300 text-xs md:text-sm text-amazon-blue font-title-font flex items-center justify-center rounded-l-md capitalize whitespace-nowrap"
        >
          {/* Hide 'All' text on tiny screens, show on sm+ */}
          <span className="hidden sm:inline">All</span> 
          <ArrowDropDownOutlined fontSize="small" />
        </span>
        
        {showCategory && (
          <ul className="absolute w-40 md:w-56 h-80 top-10 left-0 overflow-y-scroll bg-white border border-amazon-blue text-black p-2 z-[60] shadow-xl">
            <li
              onClick={() => { setShowCategory(false); navigate(`/category/all`); }}
              className="text-sm cursor-pointer hover:bg-gray-100 p-1"
            >
              All Departments
            </li>
            {categories && categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => { setShowCategory(false); navigate(`/category/${cat}`); }}
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 capitalize"
                >
                  {cat}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* 2. Search Input */}
      <input
        className="h-full text-sm md:text-base text-amazon-blue flex-grow outline-none border-none px-2 bg-white rounded-none w-full"
        type="text"
        placeholder="Search Amazon"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* 3. Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-10 lg:top-11 bg-white border border-gray-200 rounded-b-md shadow-xl z-[60] max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="px-3 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer font-medium flex items-center gap-2"
            >
              <Search fontSize="small" className="text-gray-400" />
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* 4. Search Button */}
      <span
        onClick={() => handleSearch()}
        className="w-10 sm:w-12 h-full flex items-center justify-center bg-amazon-yellow hover:bg-[#f3a847] duration-300 text-amazon-blue cursor-pointer rounded-r-md"
      >
        <Search />
      </span>
    </div>
  );
};

export default HeaderSearch;