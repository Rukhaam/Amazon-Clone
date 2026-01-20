import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import BuyBox from "../components/products/BuyBox.component";
// FIXED: Capitalized file names to match standard React naming
import ProductReviews from "../components/products/productsReview.component";
import RelatedProducts from "../components/products/relatedProducts.component";
import { useProducts } from "../src/context/products.context";

const ProductDetails = () => {
  const { id } = useParams();
  const { fetchProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      setLoading(false);
    };

    if (id) {
      getData();
    }
    window.scrollTo(0, 0);
  }, [id, fetchProductById]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-blue"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <div className="w-full bg-white min-h-screen pb-10 font-bodyFont">
      <div className="max-w-[1500px] mx-auto p-4 flex flex-col gap-10 mt-4">
        {/* === TOP SECTION === */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-2/5 flex items-start justify-center  top-24 h-fit">
            <img
              className="w-full max-w-[400px] h-auto object-contain"
              src={product.image}
              alt={product.title}
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-2/5 flex flex-col gap-2">
            <h1 className="text-2xl font-medium text-black">{product.title}</h1>
            <div className="flex items-center gap-1 text-sm text-amazon-blue hover:text-orange-500 cursor-pointer">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    fontSize="small"
                    className={
                      i < Math.round(product.rating?.rate || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-medium text-blue-600 ml-1">
                {product.rating?.count || 120} ratings
              </span>
            </div>
            <div className="border-b border-gray-300 my-1"></div>
            <div className="flex items-start gap-1">
              <span className="text-sm pt-1">$</span>
              <span className="text-3xl font-medium">
                {Math.floor(product.price)}
              </span>
              <span className="text-sm pt-1">
                {(product.price % 1).toFixed(2).substring(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">All prices include VAT.</div>
            <div className="mt-4">
              <h3 className="font-bold text-sm mb-2">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Buy Box */}
          <div className="w-full md:w-1/5">
            <BuyBox product={product} />
          </div>
        </div>

        {/* === RELATED PRODUCTS === */}
        {/* Wrapper: Added border-t for separator. Removed extra padding to fix alignment. */}
        <div className="  border-t border-gray-200 pt-4">
          <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          />
        </div>

        {/* === REVIEWS SECTION === */}
        {/* Wrapper: Added border-t for separator. */}
        <div className="border-t border-gray-200 pt-4">
          <ProductReviews productId={id} />
        </div>
      </div>
      
    </div>
  );
};

export default ProductDetails;
