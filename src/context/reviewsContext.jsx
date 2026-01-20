import React, { createContext, useContext, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp,
  orderBy 
} from "firebase/firestore";
import { db } from "../../firebase/firebase.utils"; 

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Reviews for a specific product
  const fetchReviews = async (productId) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
     
      );

      const snapshot = await getDocs(q);
      const fetchedReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

 
      fetchedReviews.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a Review
  const addReview = async (reviewData, userInfo) => {
    const newReview = {
      productId: reviewData.productId,
      userId: userInfo.uid,
      userName: userInfo.displayName || "Amazon User",
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: Timestamp.now(),
    };

    try {
      // A. Add to Firebase
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      
      // B. Update Local State (Optimistic UI)
      const reviewWithId = { id: docRef.id, ...newReview };
      setReviews((prev) => [reviewWithId, ...prev]);
      
      return { success: true };
    } catch (error) {
      console.error("Error adding review:", error);
      return { success: false, error };
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, loading, fetchReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  return useContext(ReviewsContext);
};