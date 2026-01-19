import React, { useContext } from 'react';
import { ProductsContext } from '../../src/context/products.context';
import HomeSectionCard from './homeSection.card'; 
import { Link } from "react-router-dom";
const Products = () => {
  const { products, loading } = useContext(ProductsContext);
  if (loading) {
    return <div className="w-full h-32 flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="w-full px-4 relative z-30 -mt-20 md:-mt-32 lgl:-mt-60 xl:-mt-80 pb-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Map through the API data */}
        {products.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id}>    
          <HomeSectionCard 
            key={item.id}
            title={item.title}  
            img={item.image}    
            linkText="See More" 
          />
             </Link>
        ))}

      </div>
    </div>
  );
};

export default Products;