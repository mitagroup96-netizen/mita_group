"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HeroSkeleton } from "./HeroSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const {
    data: monthly,
    isLoading,
    isError,
  } = useBooks({
    limit: 8,
    bestOfMonth: true,
    sortBy: "rating",
    order: "desc",
  });

  const books = monthly?.data ?? [];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (isError || books.length === 0) {
    return <p className="text-center py-20 text-[clamp(1rem,2vw,1.2rem)]">No book of the month yet...</p>;
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-[clamp(0.75rem,1vw,0.9rem)] mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              📚 বেস্ট বুক অফ দ্য মান্থ
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-bold text-gray-900 leading-tight text-[clamp(2rem,4vw,4.5rem)]"
            >
              স্বপ্নের ক্যরিয়ার গড়তে{" "}
              <span className="bg-gradient-to-r from-amber-500 to-pink-500 text-transparent bg-clip-text">
                বিশ্বস্ত নিয়োগ সহায়িকা
              </span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 max-w-lg mx-auto lg:mx-0 text-[clamp(0.9rem,1.2vw,1.2rem)]"
            >
              হাতে বাছাই করা বই যা তোমাকে বেশি জানতে সাহায্য করে এবং জীবনে বেশি দূর যেতে উৎসাহ দেয়।
            </motion.p>
          </motion.div>

          {/* RIGHT CAROUSEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative w-full"
          >
            <div className="relative max-w-[800px] mx-auto">
              
              {/* Carousel */}
              <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
                <div className="flex">
                  {books.map((book, index) => (
                    <div
                      key={book._id}
                      className={cn(
                        "flex-[0_0_70%] sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_60%] xl:flex-[0_0_50%] min-w-0 pl-4 transition-opacity duration-300",
                        index === selectedIndex
                          ? "opacity-100"
                          : "opacity-40 hover:opacity-60"
                      )}
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                        <Image
                          src={book.images?.[0]?.url || "/placeholder-book.jpg"}
                          alt={book.title}
                          fill
                          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 400px"
                          className="object-cover"
                          priority={index === 0}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold line-clamp-1 text-[clamp(0.85rem,1vw,1rem)]">
                            {book.title}
                          </h3>

                          <p className="opacity-90 line-clamp-1 text-[clamp(0.75rem,0.9vw,0.9rem)]">
                            {book.author}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[clamp(0.7rem,0.9vw,0.9rem)]">
                            <span>★ {book.rating?.toFixed(1)}</span>
                            <span>•</span>
                            <span>৳{book.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-1/4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full w-10 h-10 border-0 hidden sm:flex"
                onClick={scrollPrev}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-1/4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full w-10 h-10 border-0 hidden sm:flex"
                onClick={scrollNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === selectedIndex
                        ? "w-8 bg-indigo-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};