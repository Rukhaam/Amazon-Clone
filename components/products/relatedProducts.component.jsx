import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <--- 1. Import Link
import { ProductsContext } from "../../src/context/products.context";
// 2. Import the CARD, not the LIST (Adjust path if needed)
import HomeSectionCard from "../home/homeSection.card";

const RelatedProducts = ({ category, currentProductId }) => {
  const { products } = useContext(ProductsContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category) {
      const filtered = products
        .filter(
          (item) => item.category === category && item.id !== currentProductId
        )
        .slice(0, 5);

      setRelated(filtered);
      window.scrollTo({top:0,behavior: 'smooth'})
    }
  }, [category, currentProductId, products]);
  if (related.length === 0) return null;

  return (
    <div className="w-full mt-10 border-t border-gray-300 pt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Products related to this item
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          // 3. Render the specific CARD for this item
          <Link to={`/product/${item.id}`} key={item.id} className="h-full">
            <HomeSectionCard
              title={item.title}
              img={item.image}
              linkText="See details"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
