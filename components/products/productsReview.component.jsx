import React, { useState, useEffect } from "react";
import { useAuth } from "../../src/context/useAuth"; 
import { useReviews } from "../../src/context/reviewsContext"; // <--- Use Context
import StarIcon from "@mui/icons-material/Star";

const ProductReviews = ({ productId }) => {
  const { currentUser } = useAuth();
  const { reviews, fetchReviews, addReview } = useReviews(); // <--- Destructure
  
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Load reviews when productId changes
  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please click a star to rate.");
    if (!comment.trim()) return alert("Please write a comment.");

    if (!currentUser) return alert("Please sign in.");

    const result = await addReview(
        { productId, rating, comment }, 
        currentUser
    );

    if (result.success) {
      setComment("");
      setRating(0);
    } else {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="mt-10 border-t border-gray-300 pt-6">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      {/* === WRITE FORM === */}
      {currentUser ? (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-8 max-w-2xl">
          <h3 className="font-semibold mb-2">Write a review</h3>
          
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`cursor-pointer transition-colors duration-200 ${
                  star <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-amazon-blue text-sm"
            rows="3"
            placeholder="What did you like or dislike?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <button
            onClick={handleSubmit}
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-md text-sm font-medium shadow-sm"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div className="mb-8 text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-200">
          Please <span className="font-bold underline cursor-pointer">Sign In</span> to write a review.
        </div>
      )}

      {/* === REVIEWS LIST === */}
      <div className="flex flex-col gap-6 max-w-3xl">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                 {rev.userName ? rev.userName.charAt(0).toUpperCase() : "U"}
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-800">{rev.userName}</p>
                <div className="flex items-center gap-2">
                   <div className="flex text-yellow-500 text-xs">
                     {[...Array(5)].map((_, i) => (
                        <StarIcon 
                           key={i} 
                           fontSize="inherit" 
                           className={i < rev.rating ? "text-yellow-500" : "text-gray-300"} 
                        />
                     ))}
                   </div>
                   <span className="text-xs text-gray-500 font-medium">
                     {rev.createdAt?.seconds 
                        ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() 
                        : "Just now"}
                   </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
