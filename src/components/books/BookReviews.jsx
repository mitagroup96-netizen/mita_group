"use client";

import { useEffect, useState } from "react";
import { Star, Calendar, Send } from "lucide-react";

// Convert number → Bangla number
const toBanglaNumber = (num) => {
  const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return num.toString().replace(/\d/g,(d)=>banglaDigits[d]);
};

export default function BookReviews({ bookId }) {

  const [reviews,setReviews] = useState([]);
  const [loading,setLoading] = useState(true);
  const [submitting,setSubmitting] = useState(false);

  const [form,setForm] = useState({
    name:"",
    rating:5,
    comment:""
  });

  const [hoveredRating,setHoveredRating] = useState(0);

  const fetchReviews = async () => {
    try{
      const res = await fetch(`/api/books/${bookId}/reviews`);
      const data = await res.json();
      setReviews(data.data || []);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(bookId) fetchReviews();
  },[bookId]);

  const submitReview = async(e)=>{
    e.preventDefault();
    setSubmitting(true);

    try{

      const res = await fetch(`/api/books/${bookId}/reviews`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(form)
      });

      if(res.ok){

        setForm({
          name:"",
          rating:5,
          comment:""
        });

        fetchReviews();
      }

    }catch(err){
      console.error(err);
    }finally{
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc,r)=>acc+r.rating,0)/reviews.length
      : 0;

  const ratingCounts = reviews.reduce((acc,r)=>{
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  },{});

  const ratingDistribution = [5,4,3,2,1].map((star)=>({
    star,
    count:ratingCounts[star] || 0,
    percentage:reviews.length
      ? ((ratingCounts[star] || 0)/reviews.length)*100
      : 0
  }));


  return (
    <div className="bg-white border rounded-xl p-6">

      {/* Header */}
      <div className="border-b pb-6 mb-6">

        <h3 className="text-xl font-bold mb-4">
          রিভিউ ({toBanglaNumber(reviews.length)})
        </h3>

        {reviews.length > 0 && (

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Average Rating */}
            <div className="text-center">

              <div className="text-4xl font-bold">
                {toBanglaNumber(averageRating.toFixed(1))}
              </div>

              <div className="flex justify-center mt-1">

                {[...Array(5)].map((_,i)=>(
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}

              </div>

              <p className="text-sm text-gray-500">
                {toBanglaNumber(reviews.length)} টি রিভিউ
              </p>

            </div>


            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">

              {ratingDistribution.map(({star,count,percentage})=>(
                <div key={star} className="flex items-center gap-2 text-sm">

                  <span className="w-6">{toBanglaNumber(star)}</span>

                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>

                  <div className="flex-1 bg-gray-200 h-2 rounded">

                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{width:`${percentage}%`}}
                    />

                  </div>

                  <span>{toBanglaNumber(count)}</span>

                </div>
              ))}

            </div>

          </div>
        )}

      </div>


      {/* Review Form */}

      <form onSubmit={submitReview} className="bg-gray-50 p-5 rounded-xl mb-8">

        <h4 className="font-semibold mb-4">
          আপনার মন্তব্য লিখুন
        </h4>

        <div className="space-y-4">

          <input
            type="text"
            required
            placeholder="আপনার নাম"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border px-4 py-2 rounded-lg"
          />

          {/* Rating */}
          <div className="flex items-center gap-2">

            {[5,4,3,2,1].map((rating)=>(
              <button
                key={rating}
                type="button"
                onClick={()=>setForm({...form,rating})}
                onMouseEnter={()=>setHoveredRating(rating)}
                onMouseLeave={()=>setHoveredRating(0)}
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= (hoveredRating || form.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}

            <span className="text-sm text-gray-500">
              {toBanglaNumber(form.rating)} তারকা
            </span>

          </div>


          <textarea
            required
            rows={4}
            placeholder="আপনার মতামত লিখুন..."
            value={form.comment}
            onChange={(e)=>setForm({...form,comment:e.target.value})}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >

            {submitting ? "জমা হচ্ছে..." : (
              <>
                <Send size={16}/>
                রিভিউ জমা দিন
              </>
            )}

          </button>

        </div>

      </form>


      {/* Reviews */}

      {loading ? (

        <p className="text-center py-10">
          Loading...
        </p>

      ) : reviews.length === 0 ? (

        <p className="text-center text-gray-500">
          এখনও কোনো রিভিউ নেই
        </p>

      ) : (

        <div className="space-y-4">

          {reviews.map((review)=>(
            <div
              key={review._id}
              className="border rounded-lg p-4"
            >

              <div className="flex justify-between mb-2">

                <p className="font-medium">
                  {review.name || "বেনামী পাঠক"}
                </p>

                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                </span>

              </div>

              <div className="flex mb-2">

                {[...Array(5)].map((_,i)=>(
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}

              </div>

              <p className="text-sm text-gray-600">
                {review.comment}
              </p>

            </div>
          ))}

        </div>

      )}

    </div>
  );
}