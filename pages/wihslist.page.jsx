import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../src/context/wishList.context";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const dispatch = useDispatch();

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ 
        id: item.productId, 
        title: item.title, 
        image: item.image, 
        price: item.price, 
        quantity: 1 
    }));
    removeFromWishlist(item.id); // Optional: Remove from wishlist after adding to cart
  };

  if (loading) return <div className="p-10 text-center">Loading Wish List...</div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-10 font-bodyFont">
      <div className="max-w-screen-xl mx-auto p-4 md:p-8">
        
        <div className="bg-white p-6 rounded shadow-sm">
          <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
             <h1 className="text-2xl font-medium">Your Wish List</h1>
             <span className="text-sm text-gray-500">{wishlist.length} items</span>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">Your list is empty.</p>
              <Link to="/">
                <button className="bg-yellow-400 px-6 py-2 rounded-md font-medium hover:bg-yellow-500">
                  Explore Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded p-4 flex flex-col justify-between">
                  
                  {/* Image & Title */}
                  <div>
                    <Link to={`/product/${item.productId}`} className="flex justify-center mb-4 h-48">
                      <img src={item.image} alt={item.title} className="h-full object-contain" />
                    </Link>
                    <Link to={`/product/${item.productId}`}>
                        <h2 className="text-sm font-medium hover:text-orange-600 hover:underline line-clamp-2 h-10 mb-1">
                        {item.title}
                        </h2>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold">${Math.floor(item.price)}<span className="text-xs align-top">{(item.price % 1).toFixed(2).substring(1)}</span></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 py-1.5 rounded-full text-xs font-medium shadow-sm border border-yellow-500"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full bg-white hover:bg-gray-100 py-1.5 rounded-full text-xs font-medium shadow-sm border border-gray-300"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;