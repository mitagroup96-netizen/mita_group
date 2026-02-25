// app/page.js - Complete HomePage with Centered Cards
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ThreeDCard } from "@/components/ui/3d-card";
import {
  Star,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Heart,
  Eye,
  Tag,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCategories } from "@/hooks/api/categories";
import { useBooks, useAllBooks } from "@/hooks/useBooks";

// Bangla number formatter
const formatBanglaNumber = (num) => {
  if (!num && num !== 0) return "০";
  const banglaDigits = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/[0-9]/g, d => banglaDigits[d] || d);
};

// Price formatter in Bangla
const formatPrice = (price) => {
  const num = Number(price) || 0;
  return `৳ ${formatBanglaNumber(Math.round(num))}`;
};

// Book Card Component - Centered with proper padding
const BookCard = ({ book }) => {
  if (!book) return null;

  const originalPrice = Number(book.price) || 0;
  const discount = Number(book.discount) || 0;
  const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

  return (
    <ThreeDCard
      rotateDelta={10}
      translateZ={20}
      containerClassName="h-full w-full max-w-[280px] mx-auto shadow-lg hover:shadow-2xl transition-shadow"
    >
      <div className="group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Book Cover */}
        <Link href={`/books/${book._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          {book.images?.[0]?.url ? (
            <Image
              src={book.images[0].url}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 240px, 280px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md font-bangla">
                -{formatBanglaNumber(discount)}%
              </span>
            )}
            {book.bestseller && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md flex items-center font-bangla">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> বেস্টসেলার
              </span>
            )}
          </div>

          {/* Quick Actions - Desktop only */}
          <div className="absolute top-3 right-3 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10 hidden lg:block">
            <div className="flex flex-col gap-2">
              <button className="p-2.5 bg-white/90 backdrop-blur rounded-full hover:bg-white shadow-lg">
                <Heart className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2.5 bg-white/90 backdrop-blur rounded-full hover:bg-white shadow-lg">
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </Link>

        {/* Book Details - Centered */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow text-center">
          <Link href={`/books/${book._id}`}>
            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors font-bangla leading-tight">
              {book.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-1 font-bangla">
            {book.author}
          </p>

          {/* Rating - Centered */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(book.rating || 0) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs sm:text-sm text-gray-600 font-bangla">
              ({book.rating?.toFixed(1) || '০'})
            </span>
          </div>

          {/* Price and Action - Centered */}
          <div className="mt-auto flex flex-col items-center gap-3">
            <div className="text-center">
              {discount > 0 && (
                <span className="text-xs sm:text-sm text-gray-500 line-through block mb-1 font-bangla">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 font-bangla">
                {formatPrice(finalPrice)}
              </span>
            </div>
            
            <Link
              href={`/books/${book._id}`}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition text-center font-bangla"
            >
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      </div>
    </ThreeDCard>
  );
};

// Category Section Component
const CategorySection = ({ category }) => {
  const { data: categoryBooksData, isLoading } = useBooks({
    category: category.name,
    limit: 8,
    sortBy: "rating",
    order: "desc",
  });

  const books = categoryBooksData?.data || [];

  if (books.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="mb-12 sm:mb-16 lg:mb-20"
    >
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 lg:mb-12">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 shadow-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-bangla">
                {category.displayName || category.name}
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base font-bangla">
                {formatBanglaNumber(category.bookCount || books.length)}+ টি বই
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/books?category=${category.name}`}
          className="inline-flex items-center px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition group text-sm sm:text-base font-bangla w-full sm:w-auto justify-center"
        >
          সব বই দেখুন
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Books Grid - Centered cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full max-w-[280px]">
              <div className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-3"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {books.slice(0, 4).map((book) => (
            <div key={book._id} className="w-full flex justify-center">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryOffset, setCategoryOffset] = useState(0);
  const CATEGORIES_PER_VIEW = 6;

  // Fetch all categories
  const { data: categories = [], isLoading: categoriesLoading } = useCategories({
    lang: "bn",
    isActive: true,
    sort: "bookCount",
    limit: 20,
  });

  // Fetch hero books
  const { data: heroBooksData } = useBooks({
    featured: true,
    limit: 4,
    sortBy: "rating",
    order: "desc",
  });
  
  const { data: allBooksData } = useAllBooks();

  const heroBooks = heroBooksData?.data || [];

  // Memoized visible categories
  const visibleCategories = useMemo(() => {
    return categories.slice(
      categoryOffset,
      categoryOffset + CATEGORIES_PER_VIEW
    );
  }, [categories, categoryOffset]);

  const canScrollLeft = categoryOffset > 0;
  const canScrollRight = categoryOffset + CATEGORIES_PER_VIEW < categories.length;

  // Reset offset when active category changes
  useEffect(() => {
    setCategoryOffset(0);
  }, [activeCategory]);

  // Navigation handlers
  const handleNextCategories = () => {
    if (canScrollRight) {
      setCategoryOffset(prev => Math.min(prev + 1, categories.length - CATEGORIES_PER_VIEW));
    }
  };

  const handlePrevCategories = () => {
    if (canScrollLeft) {
      setCategoryOffset(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 sm:mb-8"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="font-medium text-sm sm:text-base lg:text-lg font-bangla">
                বাংলাদেশের বৃহত্তম অনলাইন বইয়ের দোকান
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight font-bangla"
            >
              পড়ুন, জানুন,
              <span className="block text-yellow-300">বিকশিত হোন</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 font-bangla"
            >
              {formatBanglaNumber(10000)}+ বইয়ের বিশাল সংগ্রহ থেকে আপনার পছন্দের বই খুঁজে নিন। হোম ডেলিভারি সহ দেশব্যাপী সেবা।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center px-4"
            >
              <Link
                href="/books"
                className="px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:shadow-2xl transition-shadow flex items-center justify-center text-base sm:text-lg lg:text-xl font-bangla"
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                সব বই দেখুন
              </Link>
              <Link
                href="/books?featured=true"
                className="px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base sm:text-lg lg:text-xl font-bangla"
              >
                ফিচার্ড বই
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      {heroBooks.length > 0 && (
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center font-bangla">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-500 mr-3" />
                ফিচার্ড বইসমূহ
              </h2>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-bangla">
                এই সপ্তাহের সেরা বইগুলো
              </p>
            </div>
            <Link
              href="/books?featured=true"
              className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-700 font-medium flex items-center text-base sm:text-lg font-bangla"
            >
              আরও দেখুন
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
            {heroBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full flex justify-center"
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {[
              { icon: BookOpen, value: formatBanglaNumber(allBooksData?.length || 0), label: "বই" },
              { icon: Users, value: "৫,০০০+", label: "পাঠক" },
              { icon: Tag, value: formatBanglaNumber(categories?.length || 0), label: "ক্যাটাগরি" },
              { icon: Clock, value: "২৪/৭", label: "সাপোর্ট" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 font-bangla">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-bangla">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 sm:py-20">
        {/* Categories Navigation */}
        {categories.length > 0 && (
          <div className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 lg:mb-12 text-center font-bangla">
              ক্যাটাগরি অনুযায়ী বই
            </h2>

            <div className="relative">
              {/* Navigation Arrows */}
              {categories.length > CATEGORIES_PER_VIEW && (
                <>
                  <button
                    onClick={handlePrevCategories}
                    disabled={!canScrollLeft}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity hidden sm:flex ${
                      canScrollLeft
                        ? "opacity-100 hover:shadow-xl"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    aria-label="Previous categories"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextCategories}
                    disabled={!canScrollRight}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity hidden sm:flex ${
                      canScrollRight
                        ? "opacity-100 hover:shadow-xl"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    aria-label="Next categories"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* Category Buttons */}
              <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                <div className="flex gap-2 sm:gap-3 mx-auto">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`flex-shrink-0 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base lg:text-lg font-bangla ${
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    সব ক্যাটাগরি
                  </button>

                  {visibleCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setActiveCategory(category.name)}
                      className={`flex-shrink-0 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base lg:text-lg font-bangla ${
                        activeCategory === category.name
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.displayName || category.name}
                    </button>
                  ))}

                  {categories.length > CATEGORIES_PER_VIEW && (
                    <div className="flex-shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 text-gray-500 font-medium text-sm sm:text-base lg:text-lg font-bangla">
                      {formatBanglaNumber(categoryOffset + CATEGORIES_PER_VIEW)} / {formatBanglaNumber(categories.length)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Content */}
        {categoriesLoading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-bangla">ক্যাটাগরি লোড হচ্ছে...</p>
          </div>
        ) : activeCategory === "all" ? (
          categories.map((category) => (
            <CategorySection key={category._id} category={category} />
          ))
        ) : (
          categories
            .filter((cat) => cat.name === activeCategory)
            .map((category) => (
              <CategorySection key={category._id} category={category} />
            ))
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 sm:p-10 lg:p-12 text-white text-center mt-16 sm:mt-20 shadow-2xl"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 font-bangla">
            আপনার পছন্দের বই এখনই সংগ্রহ করুন
          </h3>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 max-w-2xl mx-auto px-4 font-bangla">
            {formatBanglaNumber(500)}+ টাকার অর্ডারে ফ্রি ডেলিভারি এবং {formatBanglaNumber(7)} দিনের রিটার্ন পলিসি
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/books"
              className="px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl text-base sm:text-lg lg:text-xl font-bangla"
            >
              সব বই ব্রাউজ করুন
            </Link>
            <Link
              href="/books?bestseller=true"
              className="px-8 sm:px-10 lg:px-12 py-3.5 sm:py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base sm:text-lg lg:text-xl font-bangla"
            >
              বেস্টসেলার দেখুন
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer Banner */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 font-bangla">দ্রুত ডেলিভারি</h4>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-bangla">
                ঢাকা শহরে ২৪ ঘন্টায়, অন্যান্য বিভাগে ২-৩ কর্মদিবসে
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 font-bangla">সুরক্ষিত পেমেন্ট</h4>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-bangla">
                SSL সিকিউরড পেমেন্ট গেটওয়ে দিয়ে নিরাপদ লেনদেন
              </p>
            </div>
            <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 font-bangla">২৪/৭ সাপোর্ট</h4>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg font-bangla">
                যেকোনো সমস্যায় কল করুন: {formatBanglaNumber(16)}XX-XXXXXX
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Hind Siliguri', sans-serif;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}