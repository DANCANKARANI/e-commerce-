"use client";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  user_role?: string;
}

interface Rating {
  id: string;
  seller_id: string;
  user_id: string;
  stars: number;
  comment: string;
  created_at: string;
  user: User;
  seller: User;
}

export default function Ratings() {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string>("");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [newRating, setNewRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  const [clickedSeller, setClickedSeller] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("sellerId") || "";
    setSellerId(id);
  }, []);

  useEffect(() => {
    if (sellerId) {
      fetchRatings();
    } else {
      fetchAllRatings();
    }
  }, [sellerId]);

  const fetchAllRatings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/ratings`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ratings: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data) {
        throw new Error("No ratings data found");
      }

      processRatingsData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ratings");
    } finally {
      
      setIsLoading(false);
    }
  };

  const fetchRatings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/ratings?sellerId=${sellerId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ratings: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data) {
        throw new Error("No ratings data found");
      }

      processRatingsData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ratings");
    } finally {
      setIsLoading(false);
    }
  };

  const processRatingsData = (ratingsData: any[]) => {
    const mappedRatings = ratingsData.map((item) => ({
      id: item.id,
      seller_id: item.seller_id,
      user_id: item.user_id,
      stars: item.stars,
      comment: item.comment,
      created_at: item.created_at,
      user: {
        id: item.user?.id || "",
        first_name: item.user?.first_name || "Anonymous",
        last_name: item.user?.last_name || "",
        email: item.user?.email,
        phone_number: item.user?.phone_number
      },
      seller: {
        id: item.seller?.id || "",
        first_name: item.seller?.first_name || "Unknown",
        last_name: item.seller?.last_name || "Seller",
        email: item.seller?.email,
        phone_number: item.seller?.phone_number,
        user_role: item.seller?.user_role
      }
    }));

    setRatings(mappedRatings);
    
    if (mappedRatings.length > 0) {
      const avg = mappedRatings.reduce((sum, rating) => sum + rating.stars, 0) / mappedRatings.length;
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  };

  const handleSubmitRating = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        throw new Error("Please login to submit a rating");
      }

      if (newRating === 0) {
        throw new Error("Please select a rating");
      }

      const response = await fetch(`${API_URL}/products/ratings/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerId,
          stars: newRating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating");
      }

      await fetchRatings();
      setNewRating(0);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSellerClick = (sellerId: string) => {
    setSellerId(sellerId);
    setShowRatingForm(true);
    setClickedSeller(sellerId);
    setTimeout(() => {
      document.getElementById('rating-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleBackToAllRatings = () => {
    setSellerId("");
    setShowRatingForm(false);
    setClickedSeller(null);
    fetchAllRatings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const seller = ratings[0]?.seller;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <br />
      <br />
      
      <main className="flex-grow py-8 px-4 md:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-lg">Loading ratings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={sellerId ? fetchRatings : fetchAllRatings}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Back Button when viewing specific seller */}
            {sellerId && (
              <button 
                onClick={handleBackToAllRatings}
                className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to all ratings
              </button>
            )}

            {/* Seller Profile Section - Clickable */}
            {seller && (
              <section 
                className={`bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-200 ${
                  clickedSeller === seller.id ? 'ring-2 ring-blue-500' : ''
                } ${
                  !sellerId ? 'cursor-pointer hover:shadow-lg' : ''
                }`}
                onClick={!sellerId ? () => handleSellerClick(seller.id) : undefined}
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-medium">
                        {seller.first_name.charAt(0)}
                        {seller.last_name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      {seller.first_name} {seller.last_name}
                      {seller.user_role === "seller" && (
                        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Verified Seller
                        </span>
                      )}
                    </h2>
                    {seller.email && (
                      <p className="text-gray-600 mt-1">{seller.email}</p>
                    )}
                    {seller.phone_number && (
                      <p className="text-gray-600">{seller.phone_number}</p>
                    )}
                    {!sellerId && (
                      <p className="text-blue-600 mt-2 font-medium">
                        Click to rate this seller
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Rating Summary */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {seller ? "Seller" : "Overall"} Ratings
              </h2>
              <div className="flex items-center justify-center mb-4">
                <div className="flex mr-2">
                  {renderStars(averageRating)}
                </div>
                <span className="text-xl font-semibold">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
              <p className="text-gray-600">
                Based on {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
              </p>
            </section>

            {/* Rating Form */}
            {(sellerId || showRatingForm) && (
              <section id="rating-form" className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Rate This Seller</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-2xl focus:outline-none transition-transform hover:scale-110"
                        disabled={isSubmitting}
                      >
                        {star <= newRating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Share your experience with this seller..."
                    disabled={isSubmitting}
                  />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">↻</span>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </section>
            )}

            {/* Ratings List */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                {seller ? "Customer Reviews" : "All Reviews"}
              </h3>
              {ratings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-gray-400 mt-2">
                    {sellerId ? "Be the first to leave a review!" : "No reviews available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {rating.user.first_name} {rating.user.last_name}
                          </h4>
                          {!sellerId && rating.seller && (
                            <button
                              onClick={() => handleSellerClick(rating.seller.id)}
                              className="text-sm text-blue-600 mt-1 hover:underline focus:outline-none"
                            >
                              For seller: {rating.seller.first_name} {rating.seller.last_name}
                            </button>
                          )}
                        </div>
                        <div className="flex">
                          {renderStars(rating.stars)}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {new Date(rating.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-800">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}