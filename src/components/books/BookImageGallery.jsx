"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

// Lightbox Modal Component
const LightboxModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Navigation Buttons */}
      {images?.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 sm:left-4 z-50 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 sm:p-3 transition-all"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 sm:right-4 z-50 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 sm:p-3 transition-all"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {images?.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-white bg-black/40 px-3 py-1.5 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main Image */}
      <div 
        className="relative w-full h-full max-w-7xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images?.[currentIndex]?.url ? (
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || "Book image"}
            fill
            className="object-contain"
            sizes="100vw"
            quality={100}
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-gray-600" />
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images?.length > 1 && (
        <div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 bg-black/40 rounded-lg overflow-x-auto max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => onPrev(idx)} // You'll need to pass set function
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                idx === currentIndex 
                  ? 'ring-2 ring-white scale-105' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Gallery Component
export default function BookImageGallery({ 
  book, 
  discount,
  showThumbnails = true,
  aspectRatio = "3/4",
  badgePosition = "top-4 left-4"
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);

  const images = book.images || [];
  const hasImages = images.length > 0;

  const openLightbox = (index) => {
    setLightboxImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setLightboxImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Format discount if it's a number
  const discountPercentage = typeof discount === 'number' ? discount : 
                            book.discount ? book.discount : 0;

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div 
            className={`relative aspect-${aspectRatio} rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 cursor-zoom-in`}
            onClick={() => hasImages && openLightbox(selectedImage)}
          >
            {hasImages && images[selectedImage]?.url ? (
              <>
                <Image
                  src={images[selectedImage].url}
                  alt={book.title || "Book image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={selectedImage === 0}
                />
                
                {/* Zoom Indicator */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 rounded-full p-2 sm:p-3 transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className={`absolute ${badgePosition} flex flex-col gap-2 z-10`}>
              {discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold shadow-lg">
                  -{discountPercentage}% ছাড়
                </span>
              )}
              {book.bestseller && (
                <span className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold shadow-lg flex items-center gap-1">
                  <span className="text-xs">🏆</span> বেস্টসেলার
                </span>
              )}
              {book.featured && (
                <span className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold shadow-lg">
                  ফিচার্ড
                </span>
              )}
              {book.new && (
                <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold shadow-lg">
                  নতুন
                </span>
              )}
            </div>
          </div>

          {/* Image Count Badge */}
          {hasImages && images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs sm:text-sm">
              {selectedImage + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && hasImages && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  idx === selectedImage 
                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          images={images}
          currentIndex={lightboxImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}