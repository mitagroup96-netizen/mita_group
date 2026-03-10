"use client";

import { useEffect, useState } from "react";
import { Star, User, Calendar, Send, ThumbsUp } from "lucide-react";

// Bangla number converter
const toBanglaNumber = (num) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
};

export default function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});

  const [form, setForm] = useState({
    name: "",
    rating: "৫",
    comment: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/books/${bookId}/reviews`);
      const data = await res.json();
      setReviews(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating)
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setForm({
          name: "",
          rating: "৫",
          comment: "",
        });
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (reviewId) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || "০") + "১"
    }));
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0;

  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || "০") + "১";
    return acc;
  }, {});

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratingCounts[Number(star)] || "০",
    percentage: reviews.length ? ((ratingCounts[Number(star)] || "০") / reviews.length * 100) : 0
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8">
      {/* Header with Stats - Rokomari Style */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          রিভিউ ({toBanglaNumber(reviews.length)})
        </h3>
        
        {reviews.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Average Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">{toBanglaNumber(averageRating.toFixed(1))}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {toBanglaNumber(reviews.length)}টি রিভিউ
                </div>
              </div>
            </div>

            {/* Rating Distribution - Rokomari Style */}
            <div className="flex-1 space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-gray-600">{toBanglaNumber(star)}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600">{toBanglaNumber(count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form - Rokomari Style */}
      <form onSubmit={submitReview} className="mb-8 bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          আপনার মন্তব্য লিখুন
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              আপনার নাম
            </label>
            <input
              type="text"
              placeholder="আপনার নাম লিখুন"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              রেটিং দিন
            </label>
            <div className="flex items-center gap-1 sm:gap-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const numRating = Number(rating);
                const banglaRating = toBanglaNumber(rating);
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setForm({ ...form, rating: banglaRating })}
                    onMouseEnter={() => setHoveredRating(numRating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        numRating <= (hoveredRating || Number(form.rating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-sm text-gray-500 ml-2">
                {toBanglaNumber(form.rating)} তারকা
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              আপনার মন্তব্য
            </label>
            <textarea
              placeholder="বইটি সম্পর্কে আপনার মতামত জানান..."
              required
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                জমা হচ্ছে...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                রিভিউ জমা দিন
              </>
            )}
          </button>
        </div>
      </form>

      {/* Reviews List - Rokomari Style */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              এখনও কোনো রিভিউ নেই। প্রথম রিভিউটি লিখুন!
            </p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-base flex-shrink-0">
                    {review.name?.charAt(0).toUpperCase() || 'প'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">
                        {review.name || 'বেনামী পাঠক'}
                      </p>
                      {review.createdAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d])}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {toBanglaNumber(review.rating)}/{toBanglaNumber(5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-3 ml-13">
                {review.comment}
              </p>

            </div>
          ))
        )}
      </div>
    </div>
  );
}