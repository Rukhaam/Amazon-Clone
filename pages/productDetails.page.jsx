import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import BuyBox from "../components/products/BuyBox.component"; 
import { useProducts } from "../src/context/products.context"; // <--- Import Context

const ProductDetails = () => {
  const { id } = useParams();
  const { fetchProductById } = useProducts(); // <--- Use the helper
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchProductById(id); // <--- So clean!
      setProduct(data);
      setLoading(false);
    };

    if (id) {
        getData();
    }
  }, [id, fetchProductById]);

  // === UI RENDER (Same as before) ===
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amazon-blue"></div>
        <p className="mt-4 text-lg font-semibold text-amazon-blue">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto p-4 flex flex-col md:flex-row gap-8 mt-4">
        
        {/* IMAGE */}
        <div className="w-full md:w-2/5 flex items-start justify-center sticky top-24 h-fit">
          <img
            className="w-full max-w-[400px] h-auto object-contain"
            src={product.image}
            alt={product.title}
          />
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-2/5 flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-black">{product.title}</h1>
          
          <div className="flex items-center gap-1 text-sm text-amazon-blue hover:text-orange-500 cursor-pointer">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                 <StarIcon key={i} fontSize="small" />
              ))}
            </div>
            <span className="font-medium text-blue-600 ml-1">
              {product.rating?.count || 120} ratings
            </span>
          </div>

          <div className="border-b border-gray-300 my-1"></div>

          <div className="flex items-start gap-1">
            <span className="text-sm pt-1">$</span>
            <span className="text-3xl font-medium">{Math.floor(product.price)}</span>
            <span className="text-sm pt-1">{(product.price % 1).toFixed(2).substring(1)}</span>
          </div>

          <div className="text-sm text-gray-600">All prices include VAT.</div>

          <div className="mt-4">
            <h3 className="font-bold text-sm mb-2">About this item</h3>
            <ul className="list-disc ml-4 text-sm text-gray-700 flex flex-col gap-2">
              <li>{product.description || "No description available."}</li>
            </ul>
          </div>
        </div>

        {/* BUY BOX */}
        <div className="w-full md:w-1/5">
           <BuyBox product={product} />
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;